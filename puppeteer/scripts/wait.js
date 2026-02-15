const puppeteer = require('puppeteer');

async function waitForConditions(url, conditions, options = {}) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: parseInt(options.timeout) || 60000
    });

    const results = { conditions: [] };

    // Parse conditions
    const conditionList = typeof conditions === 'string' ? JSON.parse(conditions) : conditions;

    for (const condition of conditionList) {
        const startTime = Date.now();
        let success = false;
        let value = null;
        let error = null;

        try {
            switch (condition.type) {
                case 'selector':
                    await page.waitForSelector(condition.value, {
                        timeout: condition.timeout || 30000,
                        visible: condition.visible !== false,
                        hidden: condition.hidden === true
                    });
                    success = true;
                    break;

                case 'xpath':
                    await page.waitForXPath(condition.value, {
                        timeout: condition.timeout || 30000
                    });
                    success = true;
                    break;

                case 'function':
                    await page.waitForFunction(condition.value, {
                        timeout: condition.timeout || 30000,
                        polling: condition.polling || 'raf'
                    }, ...condition.args || []);
                    success = true;
                    break;

                case 'navigation':
                    await page.waitForNavigation({
                        timeout: condition.timeout || 30000,
                        waitUntil: condition.waitUntil || 'load'
                    });
                    success = true;
                    break;

                case 'timeout':
                    await new Promise(r => setTimeout(r, condition.value));
                    success = true;
                    break;

                case 'response':
                    const response = await page.waitForResponse(
                        condition.url
                            ? resp => resp.url().includes(condition.url)
                            : undefined,
                        { timeout: condition.timeout || 30000 }
                    );
                    value = {
                        url: response.url(),
                        status: response.status()
                    };
                    success = true;
                    break;

                case 'request':
                    const request = await page.waitForRequest(
                        condition.url
                            ? req => req.url().includes(condition.url)
                            : undefined,
                        { timeout: condition.timeout || 30000 }
                    );
                    value = {
                        url: request.url(),
                        method: request.method()
                    };
                    success = true;
                    break;

                case 'file-dialog':
                    await page.waitForFileChooser({ timeout: condition.timeout || 30000 });
                    success = true;
                    break;

                default:
                    error = `Unknown condition type: ${condition.type}`;
            }
        } catch (err) {
            error = err.message;
        }

        results.conditions.push({
            type: condition.type,
            value: condition.value,
            success,
            error,
            result: value,
            duration: Date.now() - startTime
        });
    }

    // Get final state
    results.finalUrl = page.url();
    results.title = await page.title();

    // Screenshot if requested
    if (options.screenshot) {
        await page.screenshot({ path: options.screenshot });
        results.screenshot = options.screenshot;
    }

    await browser.close();
    return results;
}

// CLI usage
const args = process.argv.slice(2);
const urlArg = args.find(a => !a.startsWith('--'));
const conditionsArg = args.find(a => a.startsWith('--conditions='))?.split('=')[1];
const options = {
    timeout: args.find(a => a.startsWith('--timeout='))?.split('=')[1],
    screenshot: args.find(a => a.startsWith('--screenshot='))?.split('=')[1]
};

if (!urlArg || !conditionsArg) {
    console.log('Usage: node wait.js <url> --conditions=\'[...]\'');
    console.log('');
    console.log('Condition types:');
    console.log('  selector: {"type":"selector","value":".element","timeout":5000}');
    console.log('  xpath: {"type":"xpath","value":"//div[@class=\'test\']"}');
    console.log('  function: {"type":"function","value":"() => document.readyState === \'complete\'"}');
    console.log('  navigation: {"type":"navigation","waitUntil":"networkidle2"}');
    console.log('  timeout: {"type":"timeout","value":2000}');
    console.log('  response: {"type":"response","url":"/api/"}');
    console.log('  request: {"type":"request","url":"/api/"}');
    console.log('');
    console.log('Examples:');
    console.log('  node wait.js https://example.com --conditions=\'[{"type":"selector","value":"h1"}]\'');
    console.log('  node wait.js https://example.com --conditions=\'[{"type":"timeout","value":2000},{"type":"function","value":"() => window.dataLoaded"}]\'');
    process.exit(1);
}

waitForConditions(urlArg, conditionsArg, options)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
