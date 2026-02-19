#!/usr/bin/env node
/**
 * OpenAI Chat Helper Script
 * Usage: node chat.js [options] "Your prompt here"
 * 
 * Options:
 *   --model=<model>      Model to use (default: gpt-5-mini)
 *   --stream             Stream the response
 *   --json               Output as JSON
 *   --system=<text>      System instructions
 *   --max-tokens=<n>     Max tokens to generate
 */

const OpenAI = require('openai');

// Parse arguments
const args = process.argv.slice(2);
let prompt = '';
let model = 'gpt-5-mini';
let stream = false;
let jsonOutput = false;
let system = '';
let maxTokens = null;

for (const arg of args) {
    if (arg.startsWith('--model=')) {
        model = arg.split('=')[1];
    } else if (arg === '--stream') {
        stream = true;
    } else if (arg === '--json') {
        jsonOutput = true;
    } else if (arg.startsWith('--system=')) {
        system = arg.split('=').slice(1).join('=');
    } else if (arg.startsWith('--max-tokens=')) {
        maxTokens = parseInt(arg.split('=')[1]);
    } else if (!arg.startsWith('--')) {
        prompt = arg;
    }
}

if (!prompt) {
    console.error('Usage: node chat.js [options] "Your prompt here"');
    console.error('');
    console.error('Options:');
    console.error('  --model=<model>      Model to use (default: gpt-5-mini)');
    console.error('  --stream             Stream the response');
    console.error('  --json               Output as JSON');
    console.error('  --system=<text>      System instructions');
    console.error('  --max-tokens=<n>     Max tokens to generate');
    process.exit(1);
}

async function main() {
    const client = new OpenAI();
    
    const requestOpts = {
        model,
        input: prompt,
    };
    
    if (system) {
        requestOpts.instructions = system;
    }
    
    if (maxTokens) {
        requestOpts.max_output_tokens = maxTokens;
    }
    
    if (stream) {
        requestOpts.stream = true;
        const streamResponse = await client.responses.create(requestOpts);
        
        for await (const event of streamResponse) {
            if (event.type === 'response.output_text.delta') {
                process.stdout.write(event.delta);
            }
        }
        console.log();
    } else {
        const response = await client.responses.create(requestOpts);
        
        if (jsonOutput) {
            console.log(JSON.stringify(response, null, 2));
        } else {
            console.log(response.output_text);
        }
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
