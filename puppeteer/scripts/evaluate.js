const puppeteer = require('puppeteer');
const fs = require('fs');

async function evaluateScript(url, options = {}) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: parseInt(options.timeout) || 30000
    });

    let result = {};

    // Execute script from file or string
    let scriptToRun = options.script;

    if (options.scriptFile && fs.existsSync(options.scriptFile)) {
        scriptToRun = fs.readFileSync(options.scriptFile, 'utf8');
    }

    if (scriptToRun) {
        // Check if it's a function or expression
        const wrappedScript = scriptToRun.trim().startsWith('function') || scriptToRun.trim().startsWith('(') || scriptToRun.trim().startsWith('async')
            ? `(${scriptToRun})()`
            : scriptToRun;

        result.value = await page.evaluate(wrappedScript);
    }

    // Get common page data
    if (options.title === 'true') {
        result.title = await page.title();
    }

    if (options.url === 'true') {
        result.url = page.url();
    }

    if (options.html === 'true') {
        result.html = await page.content();
    }

    if (options.text === 'true') {
        result.text = await page.evaluate(() => document.body.innerText);
    }

    if (options.querySelector) {
        result.querySelector = {};
        for (const selector of options.querySelector.split(',')) {
            const value = await page.$eval(selector.trim(), el => el.outerHTML).catch(() => null);
            result.querySelector[selector.trim()] = value;
        }
    }

    if (options.querySelectorAll) {
        result.querySelectorAll = {};
        for (const selector of options.querySelectorAll.split(',')) {
            const values = await page.$$eval(selector.trim(), els => els.map(el => el.outerHTML)).catch(() => []);
            result.querySelectorAll[selector.trim()] = values;
        }
    }

    await browser.close();
    return result;
}

// CLI usage
const args = process.argv.slice(2);
const urlArg = args.find(a => !a.startsWith('--'));

const options = {
    timeout: args.find(a => a.startsWith('--timeout='))?.split('=')[1],
    script: args.find(a => a.startsWith('--script='))?.split('=')[1],
    scriptFile: args.find(a => a.startsWith('--script-file='))?.split('=')[1],
    title: args.find(a => a.startsWith('--title='))?.split('=')[1],
    url: args.find(a => a.startsWith('--url='))?.split('=')[1],
    html: args.find(a => a.startsWith('--html='))?.split('=')[1],
    text: args.find(a => a.startsWith('--text='))?.split('=')[1],
    querySelector: args.find(a => a.startsWith('--query-selector='))?.split('=')[1],
    querySelectorAll: args.find(a => a.startsWith('--query-selector-all='))?.split('=')[1]
};

if (!urlArg) {
    console.log('Usage: node evaluate.js <url> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --script=<js>: Execute JavaScript code');
    console.log('  --script-file=<path>: Execute JavaScript from file');
    console.log('  --title=true: Get page title');
    console.log('  --url=true: Get current URL');
    console.log('  --html=true: Get page HTML');
    console.log('  --text=true: Get page text');
    console.log('  --query-selector=<sel>: Get first matching element');
    console.log('  --query-selector-all=<sel>: Get all matching elements');
    console.log('');
    console.log('Examples:');
    console.log('  node evaluate.js https://example.com --title=true --text=true');
    console.log('  node evaluate.js https://example.com --script="document.title"');
    console.log('  node evaluate.js https://example.com --script="() => ({title: document.title, links: document.links.length})"');
    process.exit(1);
}

evaluateScript(urlArg, options)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
