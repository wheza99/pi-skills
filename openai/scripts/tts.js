#!/usr/bin/env node
/**
 * OpenAI Text-to-Speech Helper Script
 * Usage: node tts.js [options] "Text to speak"
 * 
 * Options:
 *   --model=<model>      Model to use (default: gpt-4o-mini-tts)
 *   --voice=<voice>      Voice: alloy, echo, fable, onyx, nova, shimmer (default: alloy)
 *   --output=<path>      Save audio to file (default: output.mp3)
 *   --speed=<speed>      Speed: 0.25 to 4.0 (default: 1.0)
 *   --file=<path>        Read text from file
 */

const OpenAI = require('openai');
const fs = require('fs');

// Parse arguments
const args = process.argv.slice(2);
let text = '';
let model = 'gpt-4o-mini-tts';
let voice = 'alloy';
let outputFile = 'output.mp3';
let speed = 1.0;
let inputFile = null;

for (const arg of args) {
    if (arg.startsWith('--model=')) {
        model = arg.split('=')[1];
    } else if (arg.startsWith('--voice=')) {
        voice = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
        outputFile = arg.split('=')[1];
    } else if (arg.startsWith('--speed=')) {
        speed = parseFloat(arg.split('=')[1]);
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
    console.error('Usage: node tts.js [options] "Text to speak"');
    console.error('');
    console.error('Options:');
    console.error('  --model=<model>      Model to use (default: gpt-4o-mini-tts)');
    console.error('  --voice=<voice>      Voice: alloy, echo, fable, onyx, nova, shimmer (default: alloy)');
    console.error('  --output=<path>      Save audio to file (default: output.mp3)');
    console.error('  --speed=<speed>      Speed: 0.25 to 4.0 (default: 1.0)');
    console.error('  --file=<path>        Read text from file');
    process.exit(1);
}

async function main() {
    const client = new OpenAI();
    
    console.log(`Generating speech with ${model} (voice: ${voice})...`);
    
    const response = await client.audio.speech.create({
        model,
        voice,
        input: text,
        speed,
    });
    
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outputFile, buffer);
    
    console.log(`Audio saved to ${outputFile}`);
    console.log(`Size: ${(buffer.length / 1024).toFixed(2)} KB`);
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
