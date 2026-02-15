const puppeteer = require('puppeteer');

async function setContext(url, options = {}) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = browser.defaultBrowserContext();

    // Override permissions if needed
    const permissions = [];
    if (options.geolocation) permissions.push('geolocation');
    if (options.notifications === 'true') permissions.push('notifications');

    if (permissions.length > 0) {
        await context.overridePermissions(url, permissions);
    }

    const page = await browser.newPage();

    // Set geolocation
    if (options.geolocation) {
        const [latitude, longitude] = options.geolocation.split(',').map(parseFloat);
        await page.setGeolocation({ latitude, longitude });
    }

    // Set timezone
    if (options.timezone) {
        await page.emulateTimezone(options.timezone);
    }

    // Set locale
    if (options.locale) {
        await page.setExtraHTTPHeaders({
            'Accept-Language': options.locale
        });
    }

    // Set offline mode
    if (options.offline === 'true') {
        await page.setOfflineMode(true);
    }

    // Navigate
    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: parseInt(options.timeout) || 30000
    });

    // Get current context info
    const contextInfo = await page.evaluate(() => ({
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: navigator.language,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
    }));

    // Test geolocation if set
    let geoInfo = null;
    if (options.geolocation && options.testGeo === 'true') {
        try {
            // This will trigger geolocation permission prompt
            geoInfo = await page.evaluate(() => {
                return new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        pos => resolve({
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude,
                            accuracy: pos.coords.accuracy
                        }),
                        err => reject(err.message)
                    );
                });
            });
        } catch (err) {
            geoInfo = { error: err.message || 'Geolocation not available' };
        }
    }

    let screenshot = null;
    if (options.screenshot) {
        await page.screenshot({ path: options.screenshot });
        screenshot = options.screenshot;
    }

    await browser.close();

    return {
        contextInfo,
        geolocation: geoInfo,
        screenshot
    };
}

// CLI usage
const args = process.argv.slice(2);
const urlArg = args.find(a => !a.startsWith('--'));

const options = {
    timeout: args.find(a => a.startsWith('--timeout='))?.split('=')[1],
    geolocation: args.find(a => a.startsWith('--geolocation='))?.split('=')[1],
    testGeo: args.find(a => a.startsWith('--test-geo='))?.split('=')[1],
    timezone: args.find(a => a.startsWith('--timezone='))?.split('=')[1],
    locale: args.find(a => a.startsWith('--locale='))?.split('=')[1],
    offline: args.find(a => a.startsWith('--offline='))?.split('=')[1],
    notifications: args.find(a => a.startsWith('--notifications='))?.split('=')[1],
    screenshot: args.find(a => a.startsWith('--screenshot='))?.split('=')[1]
};

if (!urlArg) {
    console.log('Usage: node context.js <url> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --geolocation=<lat,lng>: Set geolocation (e.g., -6.2088,106.8456)');
    console.log('  --test-geo=true: Test geolocation access');
    console.log('  --timezone=<tz>: Set timezone (e.g., Asia/Jakarta)');
    console.log('  --locale=<lang>: Set locale (e.g., id-ID)');
    console.log('  --offline=true: Enable offline mode');
    console.log('  --notifications=true: Grant notification permission');
    console.log('  --screenshot=<path>: Save screenshot');
    console.log('');
    console.log('Examples:');
    console.log('  node context.js https://example.com --timezone="Asia/Jakarta" --locale="id-ID"');
    console.log('  node context.js https://maps.google.com --geolocation="-6.2088,106.8456"');
    process.exit(1);
}

setContext(urlArg, options)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
