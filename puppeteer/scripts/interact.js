const puppeteer = require('puppeteer');

async function interactWithPage(url, actions, options = {}) {
    const browser = await puppeteer.launch({
        headless: options.headless !== 'false',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to URL
    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: parseInt(options.timeout) || 30000
    });

    const results = { actions: [], finalUrl: null, screenshot: null };

    // Parse and execute actions
    const actionList = typeof actions === 'string' ? JSON.parse(actions) : actions;

    for (const action of actionList) {
        try {
            switch (action.type) {
                case 'type':
                    await page.waitForSelector(action.selector, { timeout: 5000 });
                    if (action.clear === true) {
                        await page.$eval(action.selector, el => el.value = '');
                    }
                    await page.type(action.selector, action.value, { delay: action.delay || 50 });
                    results.actions.push({ type: 'type', selector: action.selector, success: true });
                    break;

                case 'click':
                    await page.waitForSelector(action.selector, { timeout: 5000 });
                    await page.click(action.selector);
                    results.actions.push({ type: 'click', selector: action.selector, success: true });
                    break;

                case 'select':
                    await page.waitForSelector(action.selector, { timeout: 5000 });
                    await page.select(action.selector, action.value);
                    results.actions.push({ type: 'select', selector: action.selector, success: true });
                    break;

                case 'check':
                    await page.waitForSelector(action.selector, { timeout: 5000 });
                    if (action.checked !== false) {
                        await page.check(action.selector);
                    } else {
                        await page.uncheck(action.selector);
                    }
                    results.actions.push({ type: 'check', selector: action.selector, success: true });
                    break;

                case 'wait':
                    if (action.selector) {
                        await page.waitForSelector(action.selector, { timeout: action.timeout || 10000 });
                    } else if (action.navigation) {
                        await page.waitForNavigation({ timeout: action.timeout || 30000 });
                    } else {
                        await page.waitForTimeout(action.ms || 1000);
                    }
                    results.actions.push({ type: 'wait', success: true });
                    break;

                case 'scroll':
                    if (action.selector) {
                        await page.$eval(action.selector, el => el.scrollIntoView());
                    } else {
                        await page.evaluate((x, y) => window.scrollBy(x, y), action.x || 0, action.y || 0);
                    }
                    results.actions.push({ type: 'scroll', success: true });
                    break;

                case 'press':
                    await page.keyboard.press(action.key);
                    results.actions.push({ type: 'press', key: action.key, success: true });
                    break;

                case 'hover':
                    await page.waitForSelector(action.selector, { timeout: 5000 });
                    await page.hover(action.selector);
                    results.actions.push({ type: 'hover', selector: action.selector, success: true });
                    break;

                case 'goto':
                    await page.goto(action.url, { waitUntil: 'networkidle2' });
                    results.actions.push({ type: 'goto', url: action.url, success: true });
                    break;

                case 'evaluate':
                    const evalResult = await page.evaluate(action.script);
                    results.actions.push({ type: 'evaluate', result: evalResult, success: true });
                    break;

                default:
                    results.actions.push({ type: action.type, success: false, error: 'Unknown action type' });
            }
        } catch (err) {
            results.actions.push({ type: action.type, selector: action.selector, success: false, error: err.message });
        }
    }

    // Get final URL
    results.finalUrl = page.url();

    // Take screenshot if requested
    if (options.screenshot) {
        await page.screenshot({ path: options.screenshot, fullPage: options.fullPage === 'true' });
        results.screenshot = options.screenshot;
    }

    await browser.close();
    return results;
}

// CLI usage
const args = process.argv.slice(2);
const urlArg = args.find(a => !a.startsWith('--'));
const actionsArg = args.find(a => a.startsWith('--actions='))?.split('=')[1];
const options = {
    headless: args.find(a => a.startsWith('--headless='))?.split('=')[1],
    timeout: args.find(a => a.startsWith('--timeout='))?.split('=')[1],
    screenshot: args.find(a => a.startsWith('--screenshot='))?.split('=')[1],
    fullPage: args.find(a => a.startsWith('--full-page='))?.split('=')[1]
};

if (!urlArg || !actionsArg) {
    console.log('Usage: node interact.js <url> --actions=\'[{"type":"type","selector":"input","value":"hello"},{"type":"click","selector":"button"}]\'');
    console.log('');
    console.log('Action types:');
    console.log('  type: {"type":"type","selector":"input","value":"text","clear":true}');
    console.log('  click: {"type":"click","selector":"button"}');
    console.log('  select: {"type":"select","selector":"select","value":"option"}');
    console.log('  check: {"type":"check","selector":"checkbox","checked":true}');
    console.log('  wait: {"type":"wait","selector":".element","ms":1000}');
    console.log('  scroll: {"type":"scroll","selector":".element","x":0,"y":100}');
    console.log('  press: {"type":"press","key":"Enter"}');
    console.log('  hover: {"type":"hover","selector":".element"}');
    console.log('  goto: {"type":"goto","url":"https://example.com"}');
    console.log('  evaluate: {"type":"evaluate","script":"() => document.title"}');
    process.exit(1);
}

interactWithPage(urlArg, actionsArg, options)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
