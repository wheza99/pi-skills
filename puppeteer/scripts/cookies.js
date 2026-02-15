const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function manageCookies(url, action, options = {}) {
    const browser = await puppeteer.launch({
        headless: options.headless !== 'false',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Load cookies from file if provided
    if (options.cookiesFile && fs.existsSync(options.cookiesFile)) {
        const cookies = JSON.parse(fs.readFileSync(options.cookiesFile, 'utf8'));
        await page.setCookie(...cookies);
    }

    // Navigate to URL
    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: parseInt(options.timeout) || 30000
    });

    let result = {};

    switch (action) {
        case 'get':
            result.cookies = await page.cookies();
            break;

        case 'set':
            if (options.cookie) {
                const cookieData = typeof options.cookie === 'string' ? JSON.parse(options.cookie) : options.cookie;
                await page.setCookie(cookieData);
                result.success = true;
                result.cookie = cookieData;
            }
            break;

        case 'delete':
            if (options.cookieName) {
                await page.deleteCookie({ name: options.cookieName });
                result.success = true;
                result.deleted = options.cookieName;
            } else if (options.deleteAll === 'true') {
                const cookies = await page.cookies();
                for (const cookie of cookies) {
                    await page.deleteCookie({ name: cookie.name });
                }
                result.success = true;
                result.deletedAll = cookies.length;
            }
            break;

        case 'save':
            const cookiesToSave = await page.cookies();
            const savePath = options.output || 'cookies.json';
            fs.writeFileSync(savePath, JSON.stringify(cookiesToSave, null, 2));
            result.success = true;
            result.saved = savePath;
            result.count = cookiesToSave.length;
            break;

        default:
            result.cookies = await page.cookies();
    }

    await browser.close();
    return result;
}

// CLI usage
const args = process.argv.slice(2);
const urlArg = args.find(a => !a.startsWith('--'));
const actionArg = args.find(a => a.startsWith('--action='))?.split('=')[1] || 'get';

const options = {
    timeout: args.find(a => a.startsWith('--timeout='))?.split('=')[1],
    headless: args.find(a => a.startsWith('--headless='))?.split('=')[1],
    cookiesFile: args.find(a => a.startsWith('--cookies-file='))?.split('=')[1],
    cookie: args.find(a => a.startsWith('--cookie='))?.split('=')[1],
    cookieName: args.find(a => a.startsWith('--cookie-name='))?.split('=')[1],
    deleteAll: args.find(a => a.startsWith('--delete-all='))?.split('=')[1],
    output: args.find(a => a.startsWith('--output='))?.split('=')[1]
};

if (!urlArg) {
    console.log('Usage: node cookies.js <url> --action=<get|set|delete|save>');
    console.log('');
    console.log('Actions:');
    console.log('  get: Get all cookies (default)');
    console.log('  set: Set a cookie (--cookie=\'{"name":"test","value":"123","domain":".example.com"}\')');
    console.log('  delete: Delete a cookie (--cookie-name=xxx) or all (--delete-all=true)');
    console.log('  save: Save cookies to file (--output=cookies.json)');
    console.log('');
    console.log('Options:');
    console.log('  --cookies-file=<path>: Load cookies from file before navigating');
    process.exit(1);
}

manageCookies(urlArg, actionArg, options)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
