#!/usr/bin/env node
/**
 * WAHA Groups Helper Script
 * Usage: node groups.js <command> [options]
 * 
 * Commands:
 *   list                          List all groups
 *   get <groupId>                 Get group info
 *   create <name> <participants>  Create group (participants comma-separated)
 *   leave <groupId>               Leave group
 *   invite <groupId>              Get invite code
 *   add <groupId> <participants>  Add participants
 *   remove <groupId> <participants> Remove participants
 */

const fetch = require('node-fetch');

const args = process.argv.slice(2);
const command = args[0];

async function request(method, endpoint, body = null) {
    const apiKey = process.env.WAHA_API_KEY;
    const baseUrl = process.env.WAHA_BASE_URL || 'http://localhost:3000';
    const session = process.env.WAHA_SESSION || 'default';
    
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
    
    const response = await fetch(`${baseUrl}/api/${session}${endpoint}`, options);
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error: ${response.status} - ${error}`);
    }
    
    return response.json();
}

function parseParticipants(str) {
    return str.split(',').map(p => ({
        id: p.includes('@') ? p : `${p}@c.us`
    }));
}

async function main() {
    try {
        switch (command) {
            case 'list':
                const groups = await request('GET', '/groups?limit=100');
                console.log(JSON.stringify(groups, null, 2));
                break;
                
            case 'get':
                const groupId = args[1];
                if (!groupId) {
                    console.error('Error: groupId required');
                    process.exit(1);
                }
                const group = await request('GET', `/groups/${encodeURIComponent(groupId)}`);
                console.log(JSON.stringify(group, null, 2));
                break;
                
            case 'create':
                const groupName = args[1];
                const participantsStr = args[2];
                if (!groupName || !participantsStr) {
                    console.error('Error: name and participants required');
                    process.exit(1);
                }
                const created = await request('POST', '/groups', {
                    name: groupName,
                    participants: parseParticipants(participantsStr)
                });
                console.log('Group created:');
                console.log(JSON.stringify(created, null, 2));
                break;
                
            case 'leave':
                const leaveGroupId = args[1];
                if (!leaveGroupId) {
                    console.error('Error: groupId required');
                    process.exit(1);
                }
                await request('POST', `/groups/${encodeURIComponent(leaveGroupId)}/leave`);
                console.log(`Left group ${leaveGroupId}`);
                break;
                
            case 'invite':
                const inviteGroupId = args[1];
                if (!inviteGroupId) {
                    console.error('Error: groupId required');
                    process.exit(1);
                }
                const inviteCode = await request('GET', `/groups/${encodeURIComponent(inviteGroupId)}/invite-code`);
                console.log(`Invite link: https://chat.whatsapp.com/${inviteCode}`);
                break;
                
            case 'add':
                const addGroupId = args[1];
                const addParticipants = args[2];
                if (!addGroupId || !addParticipants) {
                    console.error('Error: groupId and participants required');
                    process.exit(1);
                }
                await request('POST', `/groups/${encodeURIComponent(addGroupId)}/participants/add`, {
                    participants: parseParticipants(addParticipants)
                });
                console.log(`Participants added to ${addGroupId}`);
                break;
                
            case 'remove':
                const removeGroupId = args[1];
                const removeParticipants = args[2];
                if (!removeGroupId || !removeParticipants) {
                    console.error('Error: groupId and participants required');
                    process.exit(1);
                }
                await request('POST', `/groups/${encodeURIComponent(removeGroupId)}/participants/remove`, {
                    participants: parseParticipants(removeParticipants)
                });
                console.log(`Participants removed from ${removeGroupId}`);
                break;
                
            case 'promote':
                const promoteGroupId = args[1];
                const promoteParticipants = args[2];
                if (!promoteGroupId || !promoteParticipants) {
                    console.error('Error: groupId and participants required');
                    process.exit(1);
                }
                await request('POST', `/groups/${encodeURIComponent(promoteGroupId)}/admin/promote`, {
                    participants: parseParticipants(promoteParticipants)
                });
                console.log(`Participants promoted to admin`);
                break;
                
            case 'demote':
                const demoteGroupId = args[1];
                const demoteParticipants = args[2];
                if (!demoteGroupId || !demoteParticipants) {
                    console.error('Error: groupId and participants required');
                    process.exit(1);
                }
                await request('POST', `/groups/${encodeURIComponent(demoteGroupId)}/admin/demote`, {
                    participants: parseParticipants(demoteParticipants)
                });
                console.log(`Admins demoted to participants`);
                break;
                
            default:
                console.error('Usage: node groups.js <command> [options]');
                console.error('');
                console.error('Commands:');
                console.error('  list                          List all groups');
                console.error('  get <groupId>                 Get group info');
                console.error('  create <name> <participants>  Create group');
                console.error('  leave <groupId>               Leave group');
                console.error('  invite <groupId>              Get invite code');
                console.error('  add <groupId> <participants>  Add participants');
                console.error('  remove <groupId> <participants> Remove participants');
                console.error('  promote <groupId> <participants> Promote to admin');
                console.error('  demote <groupId> <participants> Demote to participant');
                process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
