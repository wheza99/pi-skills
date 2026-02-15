const puppeteer = require('puppeteer');

async function simulateInput(url, options = {}) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: parseInt(options.timeout) || 30000
    });

    const result = { actions: [] };

    // Parse actions
    const actions = options.actions ? JSON.parse(options.actions) : [];

    for (const action of actions) {
        try {
            switch (action.type) {
                // Mouse actions
                case 'click':
                    await page.click(action.selector, action.options || {});
                    result.actions.push({ type: 'click', selector: action.selector, success: true });
                    break;

                case 'dblclick':
                    await page.click(action.selector, { clickCount: 2, ...action.options });
                    result.actions.push({ type: 'dblclick', selector: action.selector, success: true });
                    break;

                case 'rightclick':
                    await page.click(action.selector, { button: 'right', ...action.options });
                    result.actions.push({ type: 'rightclick', selector: action.selector, success: true });
                    break;

                case 'hover':
                    await page.hover(action.selector);
                    result.actions.push({ type: 'hover', selector: action.selector, success: true });
                    break;

                case 'mouse-move':
                    await page.mouse.move(action.x, action.y, action.options || {});
                    result.actions.push({ type: 'mouse-move', x: action.x, y: action.y, success: true });
                    break;

                case 'mouse-down':
                    await page.mouse.down(action.options || {});
                    result.actions.push({ type: 'mouse-down', success: true });
                    break;

                case 'mouse-up':
                    await page.mouse.up(action.options || {});
                    result.actions.push({ type: 'mouse-up', success: true });
                    break;

                case 'drag':
                    await page.hover(action.selector);
                    await page.mouse.down();
                    await page.mouse.move(action.toX, action.toY, { steps: action.steps || 10 });
                    await page.mouse.up();
                    result.actions.push({ type: 'drag', selector: action.selector, success: true });
                    break;

                // Keyboard actions
                case 'type':
                    await page.type(action.selector, action.text, { delay: action.delay || 50 });
                    result.actions.push({ type: 'type', selector: action.selector, success: true });
                    break;

                case 'press':
                    const keys = action.key.split('+');
                    if (keys.length > 1) {
                        for (const k of keys.slice(0, -1)) {
                            await page.keyboard.down(k);
                        }
                        await page.keyboard.press(keys[keys.length - 1]);
                        for (const k of keys.slice(0, -1).reverse()) {
                            await page.keyboard.up(k);
                        }
                    } else {
                        await page.keyboard.press(action.key);
                    }
                    result.actions.push({ type: 'press', key: action.key, success: true });
                    break;

                case 'keydown':
                    await page.keyboard.down(action.key);
                    result.actions.push({ type: 'keydown', key: action.key, success: true });
                    break;

                case 'keyup':
                    await page.keyboard.up(action.key);
                    result.actions.push({ type: 'keyup', key: action.key, success: true });
                    break;

                case 'send-char':
                    await page.keyboard.sendCharacter(action.char);
                    result.actions.push({ type: 'send-char', char: action.char, success: true });
                    break;

                // Scroll actions
                case 'scroll':
                    if (action.selector) {
                        await page.$eval(action.selector, el => el.scrollIntoView());
                    } else {
                        await page.evaluate((x, y) => window.scrollBy(x, y), action.x || 0, action.y || 0);
                    }
                    result.actions.push({ type: 'scroll', success: true });
                    break;

                default:
                    result.actions.push({ type: action.type, success: false, error: 'Unknown action type' });
            }
        } catch (err) {
            result.actions.push({ type: action.type, selector: action.selector, success: false, error: err.message });
        }
    }

    // Get final state
    result.finalUrl = page.url();

    if (options.screenshot) {
        await page.screenshot({ path: options.screenshot, fullPage: options.fullPage === 'true' });
        result.screenshot = options.screenshot;
    }

    await browser.close();
    return result;
}

// CLI usage
const args = process.argv.slice(2);
const urlArg = args.find(a => !a.startsWith('--'));

const options = {
    timeout: args.find(a => a.startsWith('--timeout='))?.split('=')[1],
    actions: args.find(a => a.startsWith('--actions='))?.split('=')[1],
    screenshot: args.find(a => a.startsWith('--screenshot='))?.split('=')[1],
    fullPage: args.find(a => a.startsWith('--full-page='))?.split('=')[1]
};

if (!urlArg) {
    console.log('Usage: node input.js <url> --actions=\'[...]\'');
    console.log('');
    console.log('Mouse actions:');
    console.log('  click: {"type":"click","selector":"button"}');
    console.log('  dblclick: {"type":"dblclick","selector":".item"}');
    console.log('  rightclick: {"type":"rightclick","selector":".item"}');
    console.log('  hover: {"type":"hover","selector":".item"}');
    console.log('  mouse-move: {"type":"mouse-move","x":100,"y":200}');
    console.log('  mouse-down/up: {"type":"mouse-down"}');
    console.log('  drag: {"type":"drag","selector":".item","toX":200,"toY":300}');
    console.log('');
    console.log('Keyboard actions:');
    console.log('  type: {"type":"type","selector":"input","text":"hello","delay":50}');
    console.log('  press: {"type":"press","key":"Enter"} or {"type":"press","key":"Control+a"}');
    console.log('  keydown/up: {"type":"keydown","key":"Shift"}');
    console.log('  send-char: {"type":"send-char","char":"a"}');
    console.log('');
    console.log('Scroll actions:');
    console.log('  scroll: {"type":"scroll","x":0,"y":500}');
    console.log('  scroll: {"type":"scroll","selector":".container"}');
    process.exit(1);
}

simulateInput(urlArg, options)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
