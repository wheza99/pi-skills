const puppeteer = require('puppeteer');
const devices = puppeteer.KnownDevices || {};

async function emulateDevice(url, options = {}) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Emulate device if specified
    if (options.device && devices[options.device]) {
        await page.emulate(devices[options.device]);
    } else {
        // Custom viewport and user agent
        await page.setViewport({
            width: parseInt(options.width) || 1920,
            height: parseInt(options.height) || 1080,
            deviceScaleFactor: parseFloat(options.scale) || 1,
            isMobile: options.mobile === 'true',
            hasTouch: options.touch === 'true',
            isLandscape: options.landscape === 'true'
        });

        if (options.userAgent) {
            await page.setUserAgent(options.userAgent);
        }

        if (options.locale) {
            await page.setExtraHTTPHeaders({
                'Accept-Language': options.locale
            });
        }
    }

    // Get device info
    const deviceInfo = await page.evaluate(() => ({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        devicePixelRatio: window.devicePixelRatio,
        isTouchDevice: 'ontouchstart' in window,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
    }));

    // Navigate
    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: parseInt(options.timeout) || 30000
    });

    // Take screenshot
    let screenshotPath = null;
    if (options.screenshot) {
        await page.screenshot({
            path: options.screenshot,
            fullPage: options.fullPage === 'true'
        });
        screenshotPath = options.screenshot;
    }

    await browser.close();

    return {
        device: options.device || 'custom',
        deviceInfo,
        screenshot: screenshotPath
    };
}

// List available devices
function listDevices() {
    const deviceList = Object.keys(devices).sort();
    console.log('Available devices:');
    console.log('');
    deviceList.forEach(device => {
        const d = devices[device];
        console.log(`  ${device}`);
        console.log(`    - ${d.viewport.width}x${d.viewport.height}, scale=${d.viewport.deviceScaleFactor}`);
        console.log(`    - Mobile: ${d.viewport.isMobile}, Touch: ${d.viewport.hasTouch}`);
    });
}

// CLI usage
const args = process.argv.slice(2);
const urlArg = args.find(a => !a.startsWith('--'));

const options = {
    device: args.find(a => a.startsWith('--device='))?.split('=')[1],
    width: args.find(a => a.startsWith('--width='))?.split('=')[1],
    height: args.find(a => a.startsWith('--height='))?.split('=')[1],
    scale: args.find(a => a.startsWith('--scale='))?.split('=')[1],
    mobile: args.find(a => a.startsWith('--mobile='))?.split('=')[1],
    touch: args.find(a => a.startsWith('--touch='))?.split('=')[1],
    landscape: args.find(a => a.startsWith('--landscape='))?.split('=')[1],
    userAgent: args.find(a => a.startsWith('--user-agent='))?.split('=')[1],
    locale: args.find(a => a.startsWith('--locale='))?.split('=')[1],
    timeout: args.find(a => a.startsWith('--timeout='))?.split('=')[1],
    screenshot: args.find(a => a.startsWith('--screenshot='))?.split('=')[1],
    fullPage: args.find(a => a.startsWith('--full-page='))?.split('=')[1]
};

if (args.includes('--list-devices')) {
    listDevices();
    process.exit(0);
}

if (!urlArg) {
    console.log('Usage: node emulate.js <url> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --device=<name>: Use predefined device (see --list-devices)');
    console.log('  --width=<n>: Viewport width (default: 1920)');
    console.log('  --height=<n>: Viewport height (default: 1080)');
    console.log('  --scale=<n>: Device pixel ratio (default: 1)');
    console.log('  --mobile=true: Emulate mobile');
    console.log('  --touch=true: Enable touch');
    console.log('  --landscape=true: Landscape orientation');
    console.log('  --user-agent=<ua>: Custom user agent');
    console.log('  --locale=<lang>: Accept-Language header (e.g., id-ID)');
    console.log('  --screenshot=<path>: Save screenshot');
    console.log('  --full-page=true: Full page screenshot');
    console.log('  --list-devices: List all available devices');
    console.log('');
    console.log('Examples:');
    console.log('  node emulate.js https://example.com --device="iPhone 13" --screenshot=iphone.png');
    console.log('  node emulate.js https://example.com --width=375 --height=667 --mobile=true');
    process.exit(1);
}

emulateDevice(urlArg, options)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
