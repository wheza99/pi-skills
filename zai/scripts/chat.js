#!/usr/bin/env node
/**
 * Z.AI Chat Helper Script
 * Usage: node chat.js [options] "Your prompt here"
 * 
 * Options:
 *   --model=<model>      Model to use (default: glm-4.7-flashx)
 *   --stream             Stream the response
 *   --think              Enable thinking mode
 *   --json               Output as JSON
 *   --system=<text>      System instructions
 *   --max-tokens=<n>     Max tokens to generate
 *   --coding             Use coding endpoint
 */

const OpenAI = require('openai');

// Parse arguments
const args = process.argv.slice(2);
let prompt = '';
let model = 'glm-4.7-flashx';
let stream = false;
let think = false;
let jsonOutput = false;
let system = '';
let maxTokens = null;
let coding = false;

for (const arg of args) {
    if (arg.startsWith('--model=')) {
        model = arg.split('=')[1];
    } else if (arg === '--stream') {
        stream = true;
    } else if (arg === '--think') {
        think = true;
    } else if (arg === '--json') {
        jsonOutput = true;
    } else if (arg.startsWith('--system=')) {
        system = arg.split('=').slice(1).join('=');
    } else if (arg.startsWith('--max-tokens=')) {
        maxTokens = parseInt(arg.split('=')[1]);
    } else if (arg === '--coding') {
        coding = true;
    } else if (!arg.startsWith('--')) {
        prompt = arg;
    }
}

if (!prompt) {
    console.error('Usage: node chat.js [options] "Your prompt here"');
    console.error('');
    console.error('Options:');
    console.error('  --model=<model>      Model to use (default: glm-4.7-flashx)');
    console.error('  --stream             Stream the response');
    console.error('  --think              Enable thinking mode');
    console.error('  --json               Output as JSON');
    console.error('  --system=<text>      System instructions');
    console.error('  --max-tokens=<n>     Max tokens to generate');
    console.error('  --coding             Use coding endpoint');
    process.exit(1);
}

async function main() {
    const apiKey = process.env.ZAI_API_KEY;
    if (!apiKey) {
        console.error('Error: ZAI_API_KEY environment variable not set');
        process.exit(1);
    }
    
    const baseUrl = coding 
        ? 'https://api.z.ai/api/coding/paas/v4/'
        : 'https://api.z.ai/api/paas/v4/';
    
    const client = new OpenAI({ apiKey, baseURL: baseUrl });
    
    const messages = [];
    
    if (system) {
        messages.push({ role: 'system', content: system });
    }
    
    messages.push({ role: 'user', content: prompt });
    
    const requestOpts = {
        model,
        messages,
    };
    
    if (maxTokens) {
        requestOpts.max_tokens = maxTokens;
    }
    
    if (think) {
        requestOpts.extra_body = {
            thinking: { type: 'enabled' }
        };
    }
    
    if (stream) {
        requestOpts.stream = true;
        const streamResponse = await client.chat.completions.create(requestOpts);
        
        let reasoning = '';
        let content = '';
        
        for await (const chunk of streamResponse) {
            const delta = chunk.choices[0].delta;
            
            if (delta.reasoning_content) {
                reasoning += delta.reasoning_content;
                if (!jsonOutput) {
                    process.stderr.write(`\x1b[90m${delta.reasoning_content}\x1b[0m`);
                }
            }
            
            if (delta.content) {
                content += delta.content;
                if (!jsonOutput) {
                    process.stdout.write(delta.content);
                }
            }
        }
        
        if (!jsonOutput) {
            console.log();
        } else {
            console.log(JSON.stringify({ reasoning, content }, null, 2));
        }
    } else {
        const response = await client.chat.completions.create(requestOpts);
        
        if (jsonOutput) {
            console.log(JSON.stringify(response, null, 2));
        } else {
            console.log(response.choices[0].message.content);
        }
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
