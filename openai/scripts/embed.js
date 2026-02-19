#!/usr/bin/env node
/**
 * OpenAI Embeddings Helper Script
 * Usage: node embed.js [options] "Text to embed"
 * 
 * Options:
 *   --model=<model>      Model to use (default: text-embedding-3-small)
 *   --file=<path>        Read text from file
 *   --output=<path>      Save embeddings to file
 */

const OpenAI = require('openai');
const fs = require('fs');

// Parse arguments
const args = process.argv.slice(2);
let text = '';
let model = 'text-embedding-3-small';
let outputFile = null;
let inputFile = null;

for (const arg of args) {
    if (arg.startsWith('--model=')) {
        model = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
        outputFile = arg.split('=')[1];
    } else if (arg.startsWith('--file=')) {
        inputFile = arg.split('=')[1];
    } else if (!arg.startsWith('--')) {
        text = arg;
    }
}

if (inputFile) {
    text = fs.readFileSync(inputFile, 'utf-8');
}

if (!text) {
    console.error('Usage: node embed.js [options] "Text to embed"');
    console.error('');
    console.error('Options:');
    console.error('  --model=<model>      Model to use (default: text-embedding-3-small)');
    console.error('  --file=<path>        Read text from file');
    console.error('  --output=<path>      Save embeddings to JSON file');
    process.exit(1);
}

async function main() {
    const client = new OpenAI();
    
    const response = await client.embeddings.create({
        model,
        input: text,
    });
    
    const embedding = response.data[0];
    const result = {
        model,
        embedding: embedding.embedding,
        dimensions: embedding.embedding.length,
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
    };
    
    if (outputFile) {
        fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
        console.log(`Embeddings saved to ${outputFile}`);
        console.log(`Dimensions: ${result.dimensions}`);
    } else {
        console.log(JSON.stringify(result, null, 2));
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
