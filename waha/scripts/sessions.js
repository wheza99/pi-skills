#!/usr/bin/env node
/**
 * WAHA Sessions Helper Script
 * Usage: node sessions.js <command> [options]
 * 
 * Commands:
 *   list              List all sessions
 *   get <name>        Get session info
 *   start <name>      Start session
 *   stop <name>       Stop session
 *   restart <name>    Restart session
 *   logout <name>     Logout session
 *   delete <name>     Delete session
 *   qr <name>         Get QR code
 *   screenshot <name> Get screenshot
 */

const fetch = require('node-fetch');
const fs = require('fs');

const args = process.argv.slice(2);
const command = args[0];
const sessionName = args[1] || 'default';

async function request(method, endpoint, body = null) {
    const apiKey = process.env.WAHA_API_KEY;
    const baseUrl = process.env.WAHA_BASE_URL || 'http://localhost:3000';
    
    if (!apiKey) {
        console.error('Error: WAHA_API_KEY environment variable not set');
        process.exit(1);
    }
    
    const options = {
        method,
        headers: {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json'
        }
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error: ${response.status} - ${error}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return response.buffer();
}

async function main() {
    try {
        switch (command) {
            case 'list':
                const sessions = await request('GET', '/api/sessions?all=true');
                console.log(JSON.stringify(sessions, null, 2));
                break;
                
            case 'get':
                const session = await request('GET', `/api/sessions/${sessionName}`);
                console.log(JSON.stringify(session, null, 2));
                break;
                
            case 'start':
                await request('POST', `/api/sessions/${sessionName}/start`);
                console.log(`Session ${sessionName} started`);
                break;
                
            case 'stop':
                await request('POST', `/api/sessions/${sessionName}/stop`);
                console.log(`Session ${sessionName} stopped`);
                break;
                
            case 'restart':
                await request('POST', `/api/sessions/${sessionName}/restart`);
                console.log(`Session ${sessionName} restarted`);
                break;
                
            case 'logout':
                await request('POST', `/api/sessions/${sessionName}/logout`);
                console.log(`Session ${sessionName} logged out`);
                break;
                
            case 'delete':
                await request('DELETE', `/api/sessions/${sessionName}`);
                console.log(`Session ${sessionName} deleted`);
                break;
                
            case 'qr':
                const qrBuffer = await request('GET', `/api/${sessionName}/auth/qr`);
                const qrFile = `${sessionName}_qr.png`;
                fs.writeFileSync(qrFile, qrBuffer);
                console.log(`QR code saved to ${qrFile}`);
                break;
                
            case 'screenshot':
                const screenshotBuffer = await request('GET', `/api/screenshot?session=${sessionName}`);
                const screenshotFile = `${sessionName}_screenshot.png`;
                fs.writeFileSync(screenshotFile, screenshotBuffer);
                console.log(`Screenshot saved to ${screenshotFile}`);
                break;
                
            case 'create':
                const webhookUrl = args[2];
                const createBody = { name: sessionName };
                if (webhookUrl) {
                    createBody.config = {
                        webhooks: [{ url: webhookUrl, events: ['message'] }]
                    };
                }
                const created = await request('POST', '/api/sessions', createBody);
                console.log('Session created:');
                console.log(JSON.stringify(created, null, 2));
                break;
                
            default:
                console.error('Usage: node sessions.js <command> [options]');
                console.error('');
                console.error('Commands:');
                console.error('  list              List all sessions');
                console.error('  get <name>        Get session info');
                console.error('  create <name> [webhook] Create session');
                console.error('  start <name>      Start session');
                console.error('  stop <name>       Stop session');
                console.error('  restart <name>    Restart session');
                console.error('  logout <name>     Logout session');
                console.error('  delete <name>     Delete session');
                console.error('  qr <name>         Get QR code');
                console.error('  screenshot <name> Get screenshot');
                process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
