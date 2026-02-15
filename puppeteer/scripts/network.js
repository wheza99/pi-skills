const puppeteer = require('puppeteer');

async function monitorNetwork(url, options = {}) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    const requests = [];
    const responses = [];
    const failures = [];

    // Enable request interception if blocking is needed
    if (options.block || options.modify) {
        await page.setRequestInterception(true);

        page.on('request', request => {
            // Block specific patterns
            if (options.block) {
                const blockPatterns = options.block.split(',');
                const shouldBlock = blockPatterns.some(pattern =>
                    request.url().includes(pattern.trim()) ||
                    request.resourceType() === pattern.trim()
                );
                if (shouldBlock) {
                    request.abort();
                    failures.push({
                        url: request.url(),
                        method: request.method(),
                        type: request.resourceType(),
                        blocked: true
                    });
                    return;
                }
            }
            request.continue();
        });
    }

    // Track all requests
    page.on('request', request => {
        requests.push({
            url: request.url(),
            method: request.method(),
            type: request.resourceType(),
            headers: request.headers(),
            postData: request.postData()
        });
    });

    // Track all responses
    page.on('response', async response => {
        const responseInfo = {
            url: response.url(),
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
            ok: response.ok()
        };

        // Try to get response body for certain types
        if (options.includeBody === 'true' && response.ok()) {
            try {
                const contentType = response.headers()['content-type'] || '';
                if (contentType.includes('json') || contentType.includes('text')) {
                    responseInfo.body = await response.text();
                }
            } catch (e) {
                responseInfo.bodyError = e.message;
            }
        }

        responses.push(responseInfo);
    });

    // Track failed requests
    page.on('requestfailed', request => {
        failures.push({
            url: request.url(),
            method: request.method(),
            type: request.resourceType(),
            error: request.failure()?.errorText
        });
    });

    // Track console messages
    const consoleMessages = [];
    if (options.console === 'true') {
        page.on('console', msg => {
            consoleMessages.push({
                type: msg.type(),
                text: msg.text(),
                location: msg.location()
            });
        });
    }

    // Navigate
    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: parseInt(options.timeout) || 60000
    });

    await browser.close();

    const result = {
        summary: {
            totalRequests: requests.length,
            totalResponses: responses.length,
            failedRequests: failures.length,
            blockedRequests: failures.filter(f => f.blocked).length
        },
        requests: options.verbose !== 'true' ? requests.slice(0, 20) : requests,
        responses: options.verbose !== 'true' ? responses.slice(0, 20) : responses
    };

    if (failures.length > 0) {
        result.failures = failures;
    }

    if (consoleMessages.length > 0) {
        result.console = consoleMessages;
    }

    // Group by resource type
    if (options.groupByType === 'true') {
        result.byType = {};
        for (const req of requests) {
            const type = req.type || 'other';
            if (!result.byType[type]) {
                result.byType[type] = { count: 0, urls: [] };
            }
            result.byType[type].count++;
            if (result.byType[type].urls.length < 10) {
                result.byType[type].urls.push(req.url);
            }
        }
    }

    return result;
}

// CLI usage
const args = process.argv.slice(2);
const urlArg = args.find(a => !a.startsWith('--'));

const options = {
    timeout: args.find(a => a.startsWith('--timeout='))?.split('=')[1],
    block: args.find(a => a.startsWith('--block='))?.split('=')[1],
    includeBody: args.find(a => a.startsWith('--include-body='))?.split('=')[1],
    console: args.find(a => a.startsWith('--console='))?.split('=')[1],
    groupByType: args.find(a => a.startsWith('--group-by-type='))?.split('=')[1],
    verbose: args.find(a => a.startsWith('--verbose='))?.split('=')[1]
};

if (!urlArg) {
    console.log('Usage: node network.js <url> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --block=<pattern1,pattern2>: Block requests matching patterns or resource types');
    console.log('  --include-body=true: Include response body for text/json responses');
    console.log('  --console=true: Capture console messages');
    console.log('  --group-by-type=true: Group requests by resource type');
    console.log('  --verbose=true: Show all requests/responses (default: first 20)');
    console.log('');
    console.log('Examples:');
    console.log('  node network.js https://example.com');
    console.log('  node network.js https://example.com --block=image,stylesheet --group-by-type=true');
    process.exit(1);
}

monitorNetwork(urlArg, options)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
