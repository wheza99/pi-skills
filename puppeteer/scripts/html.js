const puppeteer = require('puppeteer');
const fs = require('fs');

async function renderHtml(htmlContent, output, options = {}) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set content
    if (htmlContent.startsWith('http')) {
        await page.goto(htmlContent, { waitUntil: 'networkidle2' });
    } else if (fs.existsSync(htmlContent)) {
        const html = fs.readFileSync(htmlContent, 'utf8');
        await page.setContent(html, { waitUntil: 'networkidle0' });
    } else {
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    }

    // Set viewport
    await page.setViewport({
        width: parseInt(options.width) || 1200,
        height: parseInt(options.height) || 800
    });

    // Wait for content to render
    if (options.waitFor) {
        await page.waitForSelector(options.waitFor, { timeout: 10000 });
    } else {
        await new Promise(r => setTimeout(r, 500));
    }

    const result = {};

    // Output based on file extension
    const ext = output.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
        await page.pdf({
            path: output,
            format: options.format || 'A4',
            printBackground: true,
            margin: {
                top: options.marginTop || '1cm',
                bottom: options.marginBottom || '1cm',
                left: options.marginLeft || '1cm',
                right: options.marginRight || '1cm'
            }
        });
        result.type = 'pdf';
    } else {
        // Default to PNG
        await page.screenshot({
            path: output,
            fullPage: options.fullPage === 'true',
            type: ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : 'png'
        });
        result.type = 'image';
    }

    result.path = output;
    result.width = parseInt(options.width) || 1200;
    result.height = parseInt(options.height) || 800;

    await browser.close();
    return result;
}

// CLI usage
const args = process.argv.slice(2);
const htmlArg = args.find(a => !a.startsWith('--'));
const outputArg = args.find(a => a.startsWith('--output='))?.split('=')[1] || 'output.png';

const options = {
    width: args.find(a => a.startsWith('--width='))?.split('=')[1],
    height: args.find(a => a.startsWith('--height='))?.split('=')[1],
    fullPage: args.find(a => a.startsWith('--full-page='))?.split('=')[1],
    format: args.find(a => a.startsWith('--format='))?.split('=')[1],
    waitFor: args.find(a => a.startsWith('--wait-for='))?.split('=')[1],
    marginTop: args.find(a => a.startsWith('--margin-top='))?.split('=')[1],
    marginBottom: args.find(a => a.startsWith('--margin-bottom='))?.split('=')[1],
    marginLeft: args.find(a => a.startsWith('--margin-left='))?.split('=')[1],
    marginRight: args.find(a => a.startsWith('--margin-right='))?.split('=')[1]
};

if (!htmlArg) {
    console.log('Usage: node html.js <html|file|url> --output=<file>');
    console.log('');
    console.log('Options:');
    console.log('  --output=<path>: Output file (png, jpg, pdf)');
    console.log('  --width=<n>: Viewport width (default: 1200)');
    console.log('  --height=<n>: Viewport height (default: 800)');
    console.log('  --full-page=true: Capture full page');
    console.log('  --format=<format>: PDF format (A4, Letter, etc.)');
    console.log('  --wait-for=<selector>: Wait for element before capture');
    console.log('');
    console.log('Examples:');
    console.log('  node html.js "<h1>Hello</h1>" --output=hello.png');
    console.log('  node html.js ./page.html --output=page.pdf');
    console.log('  node html.js https://example.com --output=site.png --full-page=true');
    process.exit(1);
}

renderHtml(htmlArg, outputArg, options)
    .then(result => console.log(`Rendered: ${result.path}`))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
