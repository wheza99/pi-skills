const puppeteer = require('puppeteer');

async function handleDialogs(url, options = {}) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    const dialogHistory = [];

    // Set up dialog handler
    page.on('dialog', async dialog => {
        const dialogInfo = {
            type: dialog.type(),
            message: dialog.message(),
            defaultValue: dialog.defaultValue()
        };

        dialogHistory.push(dialogInfo);

        // Handle based on options
        const acceptPatterns = options.accept ? options.accept.split(',') : [];
        const dismissPatterns = options.dismiss ? options.dismiss.split(',') : [];
        const promptText = options.promptText;

        const shouldAccept = acceptPatterns.some(p => dialog.type() === p.trim() || dialog.message().includes(p.trim()));
        const shouldDismiss = dismissPatterns.some(p => dialog.type() === p.trim() || dialog.message().includes(p.trim()));

        if (shouldDismiss) {
            await dialog.dismiss();
            dialogInfo.action = 'dismissed';
        } else {
            await dialog.accept(promptText || '');
            dialogInfo.action = 'accepted';
            if (promptText && dialog.type() === 'prompt') {
                dialogInfo.enteredText = promptText;
            }
        }
    });

    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: parseInt(options.timeout) || 30000
    });

    // If trigger selector is specified, click it to trigger dialog
    if (options.trigger) {
        await page.waitForSelector(options.trigger, { timeout: 5000 });
        await page.click(options.trigger);

        // Wait a bit for dialog to be handled
        await new Promise(r => setTimeout(r, 500));
    }

    const result = {
        url: page.url(),
        title: await page.title(),
        dialogs: dialogHistory
    };

    if (options.screenshot) {
        await page.screenshot({ path: options.screenshot });
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
    trigger: args.find(a => a.startsWith('--trigger='))?.split('=')[1],
    accept: args.find(a => a.startsWith('--accept='))?.split('=')[1],
    dismiss: args.find(a => a.startsWith('--dismiss='))?.split('=')[1],
    promptText: args.find(a => a.startsWith('--prompt-text='))?.split('=')[1],
    screenshot: args.find(a => a.startsWith('--screenshot='))?.split('=')[1]
};

if (!urlArg) {
    console.log('Usage: node dialog.js <url> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --trigger=<css>: Click this element to trigger dialog');
    console.log('  --accept=<pattern>: Accept dialogs matching type or message');
    console.log('  --dismiss=<pattern>: Dismiss dialogs matching type or message');
    console.log('  --prompt-text=<text>: Text to enter in prompt dialogs');
    console.log('  --screenshot=<path>: Save screenshot');
    console.log('');
    console.log('Dialog types: alert, confirm, prompt, beforeunload');
    console.log('');
    console.log('Examples:');
    console.log('  node dialog.js https://example.com --trigger=".show-alert" --accept=alert');
    console.log('  node dialog.js https://example.com --trigger=".show-prompt" --accept=prompt --prompt-text="Hello"');
    process.exit(1);
}

handleDialogs(urlArg, options)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
