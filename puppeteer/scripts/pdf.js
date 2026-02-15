const puppeteer = require('puppeteer');
const path = require('path');

async function generatePdf(url, output, options = {}) {
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

    const pdfOptions = {
        path: output,
        format: options.format || 'A4',
        printBackground: options.printBackground !== 'false',
        margin: {
            top: options.marginTop || '1cm',
            bottom: options.marginBottom || '1cm',
            left: options.marginLeft || '1cm',
            right: options.marginRight || '1cm'
        }
    };

    if (options.landscape === 'true') {
        pdfOptions.landscape = true;
    }

    await page.pdf(pdfOptions);
    await browser.close();
    return output;
}

// CLI usage
const args = process.argv.slice(2);
const urlArg = args.find(a => !a.startsWith('--'));
const outputArg = args.find(a => a.startsWith('--output='))?.split('=')[1] || 'output.pdf';

const options = {
    format: args.find(a => a.startsWith('--format='))?.split('=')[1],
    landscape: args.find(a => a.startsWith('--landscape='))?.split('=')[1],
    printBackground: args.find(a => a.startsWith('--print-background='))?.split('=')[1],
    marginTop: args.find(a => a.startsWith('--margin-top='))?.split('=')[1],
    marginBottom: args.find(a => a.startsWith('--margin-bottom='))?.split('=')[1],
    marginLeft: args.find(a => a.startsWith('--margin-left='))?.split('=')[1],
    marginRight: args.find(a => a.startsWith('--margin-right='))?.split('=')[1],
    timeout: args.find(a => a.startsWith('--timeout='))?.split('=')[1],
    waitFor: args.find(a => a.startsWith('--wait-for='))?.split('=')[1]
};

if (!urlArg) {
    console.log('Usage: node pdf.js <url> [--output=file.pdf] [--format=A4|Letter] [--landscape=true] [--margin-top=1cm]');
    process.exit(1);
}

generatePdf(urlArg, outputArg, options)
    .then(result => console.log(`PDF saved: ${result}`))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
