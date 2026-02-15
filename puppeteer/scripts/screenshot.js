const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function takeScreenshot(url, output, options = {}) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport if specified
    if (options.width && options.height) {
        await page.setViewport({
            width: parseInt(options.width),
            height: parseInt(options.height)
        });
    } else {
        await page.setViewport({ width: 1920, height: 1080 });
    }

    // Navigate to URL
    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: parseInt(options.timeout) || 30000
    });

    // Wait for selector if specified
    if (options.waitFor) {
        await page.waitForSelector(options.waitFor, { timeout: 10000 });
    }

    // Take screenshot
    const screenshotOptions = {
        path: output,
        fullPage: options.fullPage === 'true'
    };

    if (options.selector) {
        const element = await page.$(options.selector);
        if (element) {
            await element.screenshot(screenshotOptions);
        } else {
            throw new Error(`Element not found: ${options.selector}`);
        }
    } else {
        await page.screenshot(screenshotOptions);
    }

    await browser.close();
    return output;
}

// CLI usage
const args = process.argv.slice(2);
const urlArg = args.find(a => !a.startsWith('--'));
const outputArg = args.find(a => a.startsWith('--output='))?.split('=')[1] || 'screenshot.png';

const options = {
    fullPage: args.includes('--full-page'),
    width: args.find(a => a.startsWith('--width='))?.split('=')[1],
    height: args.find(a => a.startsWith('--height='))?.split('=')[1],
    timeout: args.find(a => a.startsWith('--timeout='))?.split('=')[1],
    selector: args.find(a => a.startsWith('--selector='))?.split('=')[1],
    waitFor: args.find(a => a.startsWith('--wait-for='))?.split('=')[1]
};

if (!urlArg) {
    console.log('Usage: node screenshot.js <url> [--output=file.png] [--full-page] [--width=N] [--height=N] [--selector=css] [--wait-for=css] [--timeout=ms]');
    process.exit(1);
}

takeScreenshot(urlArg, outputArg, options)
    .then(result => console.log(`Screenshot saved: ${result}`))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
