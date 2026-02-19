#!/usr/bin/env node
/**
 * OpenAI Speech-to-Text Helper Script
 * Usage: node stt.js [options] <audio_file>
 * 
 * Options:
 *   --model=<model>      Model to use (default: gpt-4o-transcribe)
 *   --output=<path>      Save transcription to file
 *   --language=<lang>    Language code (e.g., en, id, es)
 */

const OpenAI = require('openai');
const fs = require('fs');

// Parse arguments
const args = process.argv.slice(2);
let audioFile = null;
let model = 'gpt-4o-transcribe';
let outputFile = null;
let language = null;

for (const arg of args) {
    if (arg.startsWith('--model=')) {
        model = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
        outputFile = arg.split('=')[1];
    } else if (arg.startsWith('--language=')) {
        language = arg.split('=')[1];
    } else if (!arg.startsWith('--')) {
        audioFile = arg;
    }
}

if (!audioFile) {
    console.error('Usage: node stt.js [options] <audio_file>');
    console.error('');
    console.error('Options:');
    console.error('  --model=<model>      Model to use (default: gpt-4o-transcribe)');
    console.error('  --output=<path>      Save transcription to file');
    console.error('  --language=<lang>    Language code (e.g., en, id, es)');
    process.exit(1);
}

if (!fs.existsSync(audioFile)) {
    console.error(`Error: File not found: ${audioFile}`);
    process.exit(1);
}

async function main() {
    const client = new OpenAI();
    
    console.log(`Transcribing ${audioFile} with ${model}...`);
    
    const requestOpts = {
        file: fs.createReadStream(audioFile),
        model,
    };
    
    if (language) {
        requestOpts.language = language;
    }
    
    const response = await client.audio.transcriptions.create(requestOpts);
    
    const text = response.text;
    
    if (outputFile) {
        fs.writeFileSync(outputFile, text);
        console.log(`Transcription saved to ${outputFile}`);
    } else {
        console.log(text);
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
