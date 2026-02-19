#!/usr/bin/env node
/**
 * WAHA Send Message Helper Script
 * Usage: node send.js <type> <chatId> <content> [options]
 * 
 * Types:
 *   text    - Send text message
 *   image   - Send image
 *   video   - Send video
 *   voice   - Send voice
 *   file    - Send file/document
 *   location - Send location
 *   poll    - Send poll
 * 
 * Options:
 *   --session=<name>     Session name (default: default)
 *   --caption=<text>     Caption for media
 *   --reply-to=<id>      Reply to message
 *   --mentions=<ids>     Mentions (comma-separated)
 */

const fetch = require('node-fetch');

// Parse arguments
const args = process.argv.slice(2);
let type = args[0];
let chatId = args[1];
let content = args[2];
let session = 'default';
let caption = '';
let replyTo = null;
let mentions = null;

for (const arg of args) {
    if (arg.startsWith('--session=')) {
        session = arg.split('=')[1];
    } else if (arg.startsWith('--caption=')) {
        caption = arg.split('=').slice(1).join('=');
    } else if (arg.startsWith('--reply-to=')) {
        replyTo = arg.split('=')[1];
    } else if (arg.startsWith('--mentions=')) {
        mentions = arg.split('=')[1].split(',').map(m => m.trim());
    }
}

if (!type || !chatId) {
    console.error('Usage: node send.js <type> <chatId> <content> [options]');
    console.error('');
    console.error('Types:');
    console.error('  text     - Send text message');
    console.error('  image    - Send image (URL)');
    console.error('  video    - Send video (URL)');
    console.error('  voice    - Send voice (URL)');
    console.error('  file     - Send file (URL)');
    console.error('  location - Send location (lat,lng)');
    console.error('  poll     - Send poll (name|option1,option2,option3)');
    console.error('');
    console.error('Options:');
    console.error('  --session=<name>     Session name (default: default)');
    console.error('  --caption=<text>     Caption for media');
    console.error('  --reply-to=<id>      Reply to message');
    console.error('  --mentions=<ids>     Mentions (comma-separated)');
    process.exit(1);
}

async function sendRequest(endpoint, body) {
    const apiKey = process.env.WAHA_API_KEY;
    const baseUrl = process.env.WAHA_BASE_URL || 'http://localhost:3000';
    
    if (!apiKey) {
        console.error('Error: WAHA_API_KEY environment variable not set');
        process.exit(1);
    }
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error: ${response.status} - ${error}`);
    }
    
    return response.json();
}

async function main() {
    let endpoint, body;
    
    switch (type) {
        case 'text':
            endpoint = '/api/sendText';
            body = {
                session,
                chatId,
                text: content
            };
            if (replyTo) body.reply_to = replyTo;
            if (mentions) {
                body.mentions = mentions;
                body.text = content + ' ' + mentions.map(m => `@${m.replace('@c.us', '')}`).join(' ');
            }
            break;
            
        case 'image':
            endpoint = '/api/sendImage';
            body = {
                session,
                chatId,
                file: {
                    mimetype: 'image/jpeg',
                    url: content,
                    filename: 'image.jpg'
                },
                caption
            };
            break;
            
        case 'video':
            endpoint = '/api/sendVideo';
            body = {
                session,
                chatId,
                file: {
                    mimetype: 'video/mp4',
                    url: content,
                    filename: 'video.mp4'
                },
                caption,
                convert: false
            };
            break;
            
        case 'voice':
            endpoint = '/api/sendVoice';
            body = {
                session,
                chatId,
                file: {
                    mimetype: 'audio/ogg; codecs=opus',
                    url: content
                },
                convert: true
            };
            break;
            
        case 'file':
            const ext = content.split('.').pop().toLowerCase();
            const mimetypes = {
                'pdf': 'application/pdf',
                'doc': 'application/msword',
                'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'xls': 'application/vnd.ms-excel',
                'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'zip': 'application/zip'
            };
            endpoint = '/api/sendFile';
            body = {
                session,
                chatId,
                file: {
                    mimetype: mimetypes[ext] || 'application/octet-stream',
                    url: content,
                    filename: content.split('/').pop()
                },
                caption
            };
            break;
            
        case 'location':
            const [lat, lng] = content.split(',').map(v => parseFloat(v.trim()));
            endpoint = '/api/sendLocation';
            body = {
                session,
                chatId,
                latitude: lat,
                longitude: lng,
                title: caption || 'Location'
            };
            break;
            
        case 'poll':
            const [name, optionsStr] = content.split('|');
            const options = optionsStr.split(',').map(o => o.trim());
            endpoint = '/api/sendPoll';
            body = {
                session,
                chatId,
                poll: {
                    name: name.trim(),
                    options,
                    multipleAnswers: false
                }
            };
            break;
            
        default:
            console.error(`Unknown type: ${type}`);
            process.exit(1);
    }
    
    try {
        const result = await sendRequest(endpoint, body);
        console.log('Message sent successfully!');
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
