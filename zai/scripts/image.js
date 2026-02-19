#!/usr/bin/env node
/**
 * Z.AI Image Generation Helper Script
 * Usage: node image.js [options] "Image prompt"
 * 
 * Options:
 *   --model=<model>      Model to use (default: glm-image)
 *   --size=<size>        Image size (default: 1280x1280)
 *   --output=<path>      Save image to file
 */

const OpenAI = require('openai');
const fs = require('fs');
const https = require('https');
const http = require('http');

// Parse arguments
const args = process.argv.slice(2);
let prompt = '';
let model = 'glm-image';
let size = '1280x1280';
let outputFile = null;

for (const arg of args) {
    if (arg.startsWith('--model=')) {
        model = arg.split('=')[1];
    } else if (arg.startsWith('--size=')) {
        size = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
        outputFile = arg.split('=')[1];
    } else if (!arg.startsWith('--')) {
        prompt = arg;
    }
}

if (!prompt) {
    console.error('Usage: node image.js [options] "Image prompt"');
    console.error('');
    console.error('Options:');
    console.error('  --model=<model>      Model to use (default: glm-image)');
    console.error('  --size=<size>        Image size (default: 1280x1280)');
    console.error('  --output=<path>      Save image to file');
    process.exit(1);
}

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        protocol.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
                return;
            }
            const fileStream = fs.createWriteStream(filepath);
            response.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });
        }).on('error', reject);
    });
}

async function main() {
    const apiKey = process.env.ZAI_API_KEY;
    if (!apiKey) {
        console.error('Error: ZAI_API_KEY environment variable not set');
        process.exit(1);
    }
    
    const client = new OpenAI({
        apiKey,
        baseURL: 'https://api.z.ai/api/paas/v4/'
    });
    
    console.log(`Generating image with ${model}...`);
    
    const response = await client.images.generate({
        model,
        prompt,
        size,
    });
    
    const url = response.data[0].url;
    
    if (outputFile) {
        await downloadImage(url, outputFile);
        console.log(`Image saved to ${outputFile}`);
    } else {
        console.log(`Image URL: ${url}`);
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
