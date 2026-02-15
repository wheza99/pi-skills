const puppeteer = require('puppeteer');
const path = require('path');

async function uploadFiles(url, options = {}) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: parseInt(options.timeout) || 30000
    });

    const result = { success: false, files: [] };

    try {
        // Wait for file input
        const inputFile = options.selector || 'input[type="file"]';
        await page.waitForSelector(inputFile, { timeout: 10000 });

        // Get file input element
        const fileInput = await page.$(inputFile);

        if (!fileInput) {
            throw new Error(`File input not found: ${inputFile}`);
        }

        // Upload files
        const filePaths = options.files.split(',').map(f => f.trim());
        await fileInput.uploadFile(...filePaths);

        result.files = filePaths.map(f => path.basename(f));
        result.success = true;

        // If submit button specified, click it
        if (options.submit) {
            await page.click(options.submit);
            await page.waitForNavigation({ timeout: 30000 }).catch(() => { });
            result.submitted = true;
            result.finalUrl = page.url();
        }

        // Take screenshot after upload
        if (options.screenshot) {
            await page.screenshot({ path: options.screenshot });
            result.screenshot = options.screenshot;
        }

    } catch (err) {
        result.error = err.message;
    }

    await browser.close();
    return result;
}

// CLI usage
const args = process.argv.slice(2);
const urlArg = args.find(a => !a.startsWith('--'));

const options = {
    timeout: args.find(a => a.startsWith('--timeout='))?.split('=')[1],
    selector: args.find(a => a.startsWith('--selector='))?.split('=')[1],
    files: args.find(a => a.startsWith('--files='))?.split('=')[1],
    submit: args.find(a => a.startsWith('--submit='))?.split('=')[1],
    screenshot: args.find(a => a.startsWith('--screenshot='))?.split('=')[1]
};

if (!urlArg || !options.files) {
    console.log('Usage: node upload.js <url> --files=<path1,path2> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --files=<path1,path2>: Comma-separated file paths to upload');
    console.log('  --selector=<css>: File input selector (default: input[type="file"])');
    console.log('  --submit=<css>: Submit button selector to click after upload');
    console.log('  --screenshot=<path>: Save screenshot after upload');
    console.log('');
    console.log('Examples:');
    console.log('  node upload.js https://file-upload.com --files="./test.txt"');
    console.log('  node upload.js https://file-upload.com --files="./a.txt,./b.txt" --submit="button[type=submit]"');
    process.exit(1);
}

uploadFiles(urlArg, options)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
