#!/usr/bin/env node
/**
 * OpenAI Image Generation Helper Script
 * Usage: node image.js [options] "Image prompt"
 * 
 * Options:
 *   --model=<model>      Model to use (default: gpt-image-1)
 *   --size=<size>        Image size (default: 1024x1024)
 *   --quality=<quality>  Quality: standard, hd (default: standard)
 *   --output=<path>      Save image to file
 *   --n=<number>         Number of images (default: 1)
 */

const OpenAI = require('openai');
const fs = require('fs');
const https = require('https');
const http = require('http');

// Parse arguments
const args = process.argv.slice(2);
let prompt = '';
let model = 'gpt-image-1';
let size = '1024x1024';
let quality = 'standard';
let outputFile = null;
let n = 1;

for (const arg of args) {
    if (arg.startsWith('--model=')) {
        model = arg.split('=')[1];
    } else if (arg.startsWith('--size=')) {
        size = arg.split('=')[1];
    } else if (arg.startsWith('--quality=')) {
        quality = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
        outputFile = arg.split('=')[1];
    } else if (arg.startsWith('--n=')) {
        n = parseInt(arg.split('=')[1]);
    } else if (!arg.startsWith('--')) {
        prompt = arg;
    }
}

if (!prompt) {
    console.error('Usage: node image.js [options] "Image prompt"');
    console.error('');
    console.error('Options:');
    console.error('  --model=<model>      Model to use (default: gpt-image-1)');
    console.error('  --size=<size>        Image size (default: 1024x1024)');
    console.error('  --quality=<quality>  Quality: standard, hd (default: standard)');
    console.error('  --output=<path>      Save image to file');
    console.error('  --n=<number>         Number of images (default: 1)');
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
    const client = new OpenAI();
    
    console.log(`Generating ${n} image(s) with ${model}...`);
    
    const response = await client.images.generate({
        model,
        prompt,
        size,
        quality,
        n,
    });
    
    for (let i = 0; i < response.data.length; i++) {
        const image = response.data[i];
        const url = image.url;
        
        if (outputFile && n === 1) {
            await downloadImage(url, outputFile);
            console.log(`Image saved to ${outputFile}`);
        } else if (outputFile && n > 1) {
            const ext = outputFile.split('.').pop();
            const base = outputFile.replace(`.${ext}`, '');
            const filename = `${base}_${i + 1}.${ext}`;
            await downloadImage(url, filename);
            console.log(`Image ${i + 1} saved to ${filename}`);
        } else {
            console.log(`Image ${i + 1}: ${url}`);
        }
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
