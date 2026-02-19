#!/usr/bin/env node
/**
 * Z.AI Speech-to-Text Helper Script
 * Usage: node stt.js [options] <audio_file>
 * 
 * Options:
 *   --output=<path>      Save transcription to file
 *   --stream             Stream the response
 */

const fs = require('fs');
const FormData = require('form-data');

// Parse arguments
const args = process.argv.slice(2);
let audioFile = null;
let outputFile = null;
let stream = false;

for (const arg of args) {
    if (arg.startsWith('--output=')) {
        outputFile = arg.split('=')[1];
    } else if (arg === '--stream') {
        stream = true;
    } else if (!arg.startsWith('--')) {
        audioFile = arg;
    }
}

if (!audioFile) {
    console.error('Usage: node stt.js [options] <audio_file>');
    console.error('');
    console.error('Options:');
    console.error('  --output=<path>      Save transcription to file');
    console.error('  --stream             Stream the response');
    console.error('');
    console.error('Note: Audio duration must be ≤ 30 seconds, file size ≤ 25 MB');
    process.exit(1);
}

if (!fs.existsSync(audioFile)) {
    console.error(`Error: File not found: ${audioFile}`);
    process.exit(1);
}

async function main() {
    const apiKey = process.env.ZAI_API_KEY;
    if (!apiKey) {
        console.error('Error: ZAI_API_KEY environment variable not set');
        process.exit(1);
    }
    
    const form = new FormData();
    form.append('model', 'glm-asr-2512');
    form.append('stream', stream.toString());
    form.append('file', fs.createReadStream(audioFile));
    
    console.log(`Transcribing ${audioFile}...`);
    
    const response = await fetch('https://api.z.ai/api/paas/v4/audio/transcriptions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            ...form.getHeaders()
        },
        body: form
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error: ${response.status} - ${error}`);
    }
    
    const text = await response.text();
    
    if (outputFile) {
        fs.writeFileSync(outputFile, text);
        console.log(`Transcription saved to ${outputFile}`);
    } else {
        console.log(text);
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1));
