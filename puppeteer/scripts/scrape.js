const puppeteer = require('puppeteer');

async function scrapeContent(url, options = {}) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: parseInt(options.timeout) || 30000
    });

    if (options.waitFor) {
        await page.waitForSelector(options.waitFor, { timeout: 10000 });
    }

    const result = {};

    // Get page title
    if (options.title !== 'false') {
        result.title = await page.title();
    }

    // Get page URL (after any redirects)
    result.url = page.url();

    // Get meta description
    if (options.meta !== 'false') {
        result.description = await page.$eval('meta[name="description"]', el => el.content).catch(() => null);
    }

    // Extract text content
    if (options.text === 'true') {
        result.text = await page.evaluate(() => document.body.innerText);
    }

    // Extract HTML content
    if (options.html === 'true') {
        result.html = await page.content();
    }

    // Extract specific selectors
    if (options.selectors) {
        const selectors = options.selectors.split(',');
        result.elements = {};

        for (const selector of selectors) {
            const trimmed = selector.trim();
            const elements = await page.$$eval(trimmed, els =>
                els.map(el => ({
                    text: el.innerText || el.textContent || '',
                    html: el.innerHTML,
                    href: el.href || null,
                    src: el.src || null
                }))
            ).catch(() => []);
            result.elements[trimmed] = elements;
        }
    }

    // Extract all links
    if (options.links === 'true') {
        result.links = await page.$$eval('a', links =>
            links.map(a => ({
                text: a.innerText,
                href: a.href
            }))
        );
    }

    // Extract all images
    if (options.images === 'true') {
        result.images = await page.$$eval('img', imgs =>
            imgs.map(img => ({
                alt: img.alt,
                src: img.src
            }))
        );
    }

    // Extract tables
    if (options.tables === 'true') {
        result.tables = await page.$$eval('table', tables =>
            tables.map(table => {
                const rows = Array.from(table.querySelectorAll('tr'));
                return rows.map(row =>
                    Array.from(row.querySelectorAll('th, td')).map(cell => cell.innerText)
                );
            })
        );
    }

    await browser.close();
    return result;
}

// CLI usage
const args = process.argv.slice(2);
const urlArg = args.find(a => !a.startsWith('--'));

const options = {
    timeout: args.find(a => a.startsWith('--timeout='))?.split('=')[1],
    waitFor: args.find(a => a.startsWith('--wait-for='))?.split('=')[1],
    text: args.find(a => a.startsWith('--text='))?.split('=')[1],
    html: args.find(a => a.startsWith('--html='))?.split('=')[1],
    selectors: args.find(a => a.startsWith('--selectors='))?.split('=')[1],
    links: args.find(a => a.startsWith('--links='))?.split('=')[1],
    images: args.find(a => a.startsWith('--images='))?.split('=')[1],
    tables: args.find(a => a.startsWith('--tables='))?.split('=')[1]
};

if (!urlArg) {
    console.log('Usage: node scrape.js <url> [--text=true] [--html=true] [--links=true] [--images=true] [--tables=true] [--selectors="h1,.class,#id"]');
    process.exit(1);
}

scrapeContent(urlArg, options)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
