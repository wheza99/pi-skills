#!/usr/bin/env node
/**
 * Z.AI Vision Helper Script
 * Usage: node vision.js [options] <image_url> "Question about image"
 * 
 * Options:
 *   --model=<model>      Model to use (default: glm-4.6v)
 *   --think              Enable thinking mode
 *   --stream             Stream the response
 */

const OpenAI = require('openai');

// Parse arguments
const args = process.argv.slice(2);
let imageUrl = '';
let question = '';
let model = 'glm-4.6v';
let think = false;
let stream = false;

for (const arg of args) {
    if (arg.startsWith('--model=')) {
        model = arg.split('=')[1];
    } else if (arg === '--think') {
        think = true;
    } else if (arg === '--stream') {
        stream = true;
    } else if (!arg.startsWith('--')) {
        if (!imageUrl) {
            imageUrl = arg;
        } else {
            question = arg;
        }
    }
}

if (!imageUrl || !question) {
    console.error('Usage: node vision.js [options] <image_url> "Question about image"');
    console.error('');
    console.error('Options:');
    console.error('  --model=<model>      Model to use (default: glm-4.6v)');
    console.error('  --think              Enable thinking mode');
    console.error('  --stream             Stream the response');
    console.error('');
    console.error('Example:');
    console.error('  node vision.js https://example.com/image.png "What is in this image?"');
    process.exit(1);
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
    
    const messages = [
        {
            role: 'user',
            content: [
                { type: 'image_url', image_url: { url: imageUrl } },
                { type: 'text', text: question }
            ]
        }
    ];
    
    const requestOpts = {
        model,
        messages,
    };
    
    if (think) {
        requestOpts.extra_body = { thinking: { type: 'enabled' } };
    }
    
    if (stream) {
        requestOpts.stream = true;
        const streamResponse = await client.chat.completions.create(requestOpts);
        
        for await (const chunk of streamResponse) {
            const delta = chunk.choices[0].delta;
            
            if (delta.reasoning_content) {
                process.stderr.write(`\x1b[90m${delta.reasoning_content}\x1b[0m`);
            }
            
            if (delta.content) {
                process.stdout.write(delta.content);
            }
        }
        console.log();
    } else {
        const response = await client.chat.completions.create(requestOpts);
        console.log(response.choices[0].message.content);
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
