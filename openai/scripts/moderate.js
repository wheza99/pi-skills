#!/usr/bin/env node
/**
 * OpenAI Moderation Helper Script
 * Usage: node moderate.js [options] "Text to moderate"
 * 
 * Options:
 *   --model=<model>      Model to use (default: omni-moderation)
 *   --file=<path>        Read text from file
 *   --json               Output full JSON response
 */

const OpenAI = require('openai');
const fs = require('fs');

// Parse arguments
const args = process.argv.slice(2);
let text = '';
let model = 'omni-moderation';
let inputFile = null;
let jsonOutput = false;

for (const arg of args) {
    if (arg.startsWith('--model=')) {
        model = arg.split('=')[1];
    } else if (arg.startsWith('--file=')) {
        inputFile = arg.split('=')[1];
    } else if (arg === '--json') {
        jsonOutput = true;
    } else if (!arg.startsWith('--')) {
        text = arg;
    }
}

if (inputFile) {
    text = fs.readFileSync(inputFile, 'utf-8');
}

if (!text) {
    console.error('Usage: node moderate.js [options] "Text to moderate"');
    console.error('');
    console.error('Options:');
    console.error('  --model=<model>      Model to use (default: omni-moderation)');
    console.error('  --file=<path>        Read text from file');
    console.error('  --json               Output full JSON response');
    process.exit(1);
}

async function main() {
    const client = new OpenAI();
    
    const response = await client.moderations.create({
        model,
        input: text,
    });
    
    const result = response.results[0];
    
    if (jsonOutput) {
        console.log(JSON.stringify(result, null, 2));
    } else {
        console.log('Moderation Result:');
        console.log(`  Flagged: ${result.flagged ? 'YES' : 'NO'}`);
        console.log('');
        console.log('Categories:');
        for (const [category, flagged] of Object.entries(result.categories)) {
            if (flagged) {
                const score = result.category_scores[category];
                console.log(`  [!] ${category}: ${score.toFixed(4)}`);
            }
        }
        if (!result.flagged) {
            console.log('  No issues found.');
        }
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
