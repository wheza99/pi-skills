const puppeteer = require('puppeteer');

async function managePages(urls, options = {}) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = browser.defaultBrowserContext();
    const results = [];

    // Process multiple URLs
    const urlList = typeof urls === 'string' ? JSON.parse(urls) : urls;

    for (const urlInfo of urlList) {
        const page = await context.newPage();

        const url = typeof urlInfo === 'string' ? urlInfo : urlInfo.url;
        const pageOptions = typeof urlInfo === 'object' ? urlInfo : {};

        try {
            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: parseInt(options.timeout) || 30000
            });

            if (pageOptions.waitFor) {
                await page.waitForSelector(pageOptions.waitFor, { timeout: 10000 });
            }

            const pageInfo = {
                url: page.url(),
                title: await page.title(),
                success: true
            };

            // Take screenshot if requested
            if (options.screenshotDir && pageOptions.screenshot !== false) {
                const filename = url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50) + '.png';
                const path = `${options.screenshotDir}/${filename}`;
                await page.screenshot({ path, fullPage: options.fullPage === 'true' });
                pageInfo.screenshot = path;
            }

            // Get text if requested
            if (options.text === 'true') {
                pageInfo.text = await page.evaluate(() => document.body.innerText);
            }

            // Get specific data
            if (pageOptions.extract) {
                pageInfo.data = {};
                for (const [key, selector] of Object.entries(pageOptions.extract)) {
                    pageInfo.data[key] = await page.$eval(selector, el => el.innerText).catch(() => null);
                }
            }

            results.push(pageInfo);
        } catch (err) {
            results.push({
                url,
                success: false,
                error: err.message
            });
        }

        await page.close();
    }

    // Get browser info
    const browserInfo = {
        version: await browser.version(),
        userAgent: await browser.userAgent(),
        pagesProcessed: results.length
    };

    await browser.close();

    return {
        browser: browserInfo,
        pages: results
    };
}

// CLI usage
const args = process.argv.slice(2);
const urlsArg = args.find(a => !a.startsWith('--'));

const options = {
    timeout: args.find(a => a.startsWith('--timeout='))?.split('=')[1],
    text: args.find(a => a.startsWith('--text='))?.split('=')[1],
    screenshotDir: args.find(a => a.startsWith('--screenshot-dir='))?.split('=')[1],
    fullPage: args.find(a => a.startsWith('--full-page='))?.split('=')[1]
};

if (!urlsArg) {
    console.log('Usage: node pages.js <urls-json> [options]');
    console.log('');
    console.log('URLs can be:');
    console.log('  - JSON array of URLs: ["https://url1.com","https://url2.com"]');
    console.log('  - JSON array of objects: [{"url":"...","extract":{"title":"h1"}}]');
    console.log('');
    console.log('Options:');
    console.log('  --timeout=<ms>: Navigation timeout');
    console.log('  --text=true: Extract page text');
    console.log('  --screenshot-dir=<dir>: Directory to save screenshots');
    console.log('  --full-page=true: Full page screenshots');
    console.log('');
    console.log('Examples:');
    console.log('  node pages.js \'["https://example.com","https://example.org"]\'');
    console.log('  node pages.js \'[{"url":"https://example.com","extract":{"title":"h1","desc":"p"}}]\'');
    process.exit(1);
}

managePages(urlsArg, options)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
