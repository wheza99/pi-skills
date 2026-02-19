---
name: waha
description: Skill untuk menggunakan WAHA (WhatsApp HTTP API) - WhatsApp API yang bisa di-install di server sendiri. Gunakan untuk mengirim/menerima pesan WhatsApp, mengelola groups, contacts, channels, status/stories, polls, webhooks, dan event handling. Compatible dengan berbagai engines (WEBJS, NOWEB, GOWS).
---

# WAHA - WhatsApp HTTP API

Skill untuk menggunakan WAHA (WhatsApp HTTP API) untuk otomasi WhatsApp.

## Setup

### 1. Install Docker

WAHA berjalan di Docker. Install Docker terlebih dahulu:
- [Docker for Linux](https://docs.docker.com/engine/install/)
- [Docker for Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Docker for macOS](https://docs.docker.com/desktop/install/mac-install/)

### 2. Download & Run WAHA

```bash
# Pull image
docker pull devlikeapro/waha

# Init WAHA (generate credentials)
docker run --rm -v "$(pwd)":/app/env devlikeapro/waha init-waha /app/env

# Run WAHA
docker run -it --env-file "$(pwd)/.env" -v "$(pwd)/sessions:/app/.sessions" --rm -p 3000:3000 --name waha devlikeapro/waha
```

### 3. Akses Dashboard & Swagger

- **Dashboard**: http://localhost:3000/dashboard
- **Swagger**: http://localhost:3000/swagger
- **OpenAPI JSON**: http://localhost:3000/swagger/openapi.json

### 4. Set Environment Variable

```bash
# API Key dari .env file
export WAHA_API_KEY="your_api_key_here"
export WAHA_BASE_URL="http://localhost:3000"
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/sessions` | Create session |
| `GET` | `/api/sessions` | List sessions |
| `POST` | `/api/sendText` | Send text message |
| `POST` | `/api/sendImage` | Send image |
| `POST` | `/api/sendVoice` | Send voice message |
| `POST` | `/api/sendVideo` | Send video |
| `POST` | `/api/sendFile` | Send file/document |
| `POST` | `/api/sendLocation` | Send location |
| `POST` | `/api/sendPoll` | Send poll |
| `POST` | `/api/sendSeen` | Mark as read |
| `PUT` | `/api/reaction` | Add reaction |
| `GET` | `/api/{session}/groups` | Get groups |
| `GET` | `/api/{session}/groups/{id}` | Get group |

## Chat ID Format

| Type | Format | Example |
|------|--------|---------|
| User | `{phone}@c.us` | `62812345678@c.us` |
| Group | `{id}@g.us` | `120363123456@g.us` |
| Channel | `{id}@newsletter` | `120363123456@newsletter` |
| Status | `status@broadcast` | `status@broadcast` |

**Note**: Gunakan nomor telepon internasional tanpa `+`, tambahkan `@c.us` di akhir.

## Sessions

### Create Session

```bash
curl -X 'POST' \
  'http://localhost:3000/api/sessions' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "default",
    "config": {
      "webhooks": [
        {
          "url": "https://your-webhook.com",
          "events": ["message"]
        }
      ]
    }
  }'
```

### Session Status

| Status | Description |
|--------|-------------|
| `STOPPED` | Session stopped |
| `STARTING` | Session starting |
| `SCAN_QR_CODE` | Need to scan QR |
| `WORKING` | Ready to use |
| `FAILED` | Error occurred |

### Start/Stop Session

```bash
# Start
curl -X 'POST' 'http://localhost:3000/api/sessions/default/start' \
  -H 'X-Api-Key: your_api_key'

# Stop
curl -X 'POST' 'http://localhost:3000/api/sessions/default/stop' \
  -H 'X-Api-Key: your_api_key'

# Logout
curl -X 'POST' 'http://localhost:3000/api/sessions/default/logout' \
  -H 'X-Api-Key: your_api_key'

# Delete
curl -X 'DELETE' 'http://localhost:3000/api/sessions/default' \
  -H 'X-Api-Key: your_api_key'
```

### Get QR Code

```bash
# Get QR image
curl -X 'GET' 'http://localhost:3000/api/default/auth/qr' \
  -H 'X-Api-Key: your_api_key' \
  --output qr.png

# Get QR as base64
curl -X 'GET' 'http://localhost:3000/api/default/auth/qr' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Accept: application/json'
```

## Send Messages

### Send Text

```bash
curl -X 'POST' \
  'http://localhost:3000/api/sendText' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "session": "default",
    "chatId": "62812345678@c.us",
    "text": "Hello from WAHA!"
  }'
```

### Reply to Message

```bash
curl -X 'POST' \
  'http://localhost:3000/api/sendText' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "session": "default",
    "chatId": "62812345678@c.us",
    "text": "Reply text",
    "reply_to": "false_62812345678@c.us_AAAAAAAAAAAAAA"
  }'
```

### Mention Contact in Group

```bash
curl -X 'POST' \
  'http://localhost:3000/api/sendText' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "session": "default",
    "chatId": "120363123456@g.us",
    "text": "Hello @62812345678!",
    "mentions": ["62812345678@c.us"]
  }'
```

### Send Image

```bash
# From URL
curl -X 'POST' \
  'http://localhost:3000/api/sendImage' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "session": "default",
    "chatId": "62812345678@c.us",
    "file": {
      "mimetype": "image/jpeg",
      "url": "https://example.com/image.jpg",
      "filename": "image.jpg"
    },
    "caption": "Check this image!"
  }'
```

### Send Voice

```bash
curl -X 'POST' \
  'http://localhost:3000/api/sendVoice' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "session": "default",
    "chatId": "62812345678@c.us",
    "file": {
      "mimetype": "audio/ogg; codecs=opus",
      "url": "https://example.com/voice.opus"
    },
    "convert": false
  }'
```

**Voice Format**: WhatsApp hanya menerima OPUS dalam container OGG.
- Set `convert: true` untuk auto-convert
- Convert manual: `ffmpeg -i input.mp3 -c:a libopus -b:a 32k -ar 48000 -ac 1 output.opus`

### Send Video

```bash
curl -X 'POST' \
  'http://localhost:3000/api/sendVideo' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "session": "default",
    "chatId": "62812345678@c.us",
    "file": {
      "mimetype": "video/mp4",
      "url": "https://example.com/video.mp4",
      "filename": "video.mp4"
    },
    "caption": "Check this video!",
    "convert": false
  }'
```

### Send File/Document

```bash
curl -X 'POST' \
  'http://localhost:3000/api/sendFile' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "session": "default",
    "chatId": "62812345678@c.us",
    "file": {
      "mimetype": "application/pdf",
      "url": "https://example.com/document.pdf",
      "filename": "document.pdf"
    },
    "caption": "Here is the document"
  }'
```

### Send Location

```bash
curl -X 'POST' \
  'http://localhost:3000/api/sendLocation' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "session": "default",
    "chatId": "62812345678@c.us",
    "latitude": -6.2088,
    "longitude": 106.8456,
    "title": "Jakarta"
  }'
```

### Send Poll

```bash
curl -X 'POST' \
  'http://localhost:3000/api/sendPoll' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "session": "default",
    "chatId": "62812345678@c.us",
    "poll": {
      "name": "What do you prefer?",
      "options": ["Option A", "Option B", "Option C"],
      "multipleAnswers": false
    }
  }'
```

### Send Contact (vCard)

```bash
curl -X 'POST' \
  'http://localhost:3000/api/sendContactVcard' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "session": "default",
    "chatId": "62812345678@c.us",
    "contacts": [
      {
        "fullName": "John Doe",
        "organization": "Company",
        "phoneNumber": "+62812345678",
        "whatsappId": "62812345678"
      }
    ]
  }'
```

### Add Reaction

```bash
curl -X 'PUT' \
  'http://localhost:3000/api/reaction' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "session": "default",
    "messageId": "false_62812345678@c.us_AAAAAAAAAAAAAA",
    "reaction": "👍"
  }'
```

### Mark as Read (Send Seen)

```bash
curl -X 'POST' \
  'http://localhost:3000/api/sendSeen' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "session": "default",
    "chatId": "62812345678@c.us"
  }'
```

## Edit & Delete Messages

### Edit Message

```bash
curl -X 'PUT' \
  'http://localhost:3000/api/default/chats/62812345678%40c.us/messages/true_62812345678%40c.us_AAA' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "Edited message",
    "linkPreview": true
  }'
```

### Delete Message

```bash
curl -X 'DELETE' \
  'http://localhost:3000/api/default/chats/62812345678%40c.us/messages/true_62812345678%40c.us_AAA' \
  -H 'X-Api-Key: your_api_key'
```

## Groups

### Get All Groups

```bash
curl -X 'GET' \
  'http://localhost:3000/api/default/groups?limit=10&offset=0' \
  -H 'X-Api-Key: your_api_key'
```

### Create Group

```bash
curl -X 'POST' \
  'http://localhost:3000/api/default/groups' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "My Group",
    "participants": [
      {"id": "62812345678@c.us"}
    ]
  }'
```

### Add/Remove Participants

```bash
# Add
curl -X 'POST' \
  'http://localhost:3000/api/default/groups/120363123456@g.us/participants/add' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "participants": [{"id": "62812345678@c.us"}]
  }'

# Remove
curl -X 'POST' \
  'http://localhost:3000/api/default/groups/120363123456@g.us/participants/remove' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "participants": [{"id": "62812345678@c.us"}]
  }'
```

### Promote/Demote Admin

```bash
# Promote to admin
curl -X 'POST' \
  'http://localhost:3000/api/default/groups/120363123456@g.us/admin/promote' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "participants": [{"id": "62812345678@c.us"}]
  }'

# Demote to participant
curl -X 'POST' \
  'http://localhost:3000/api/default/groups/120363123456@g.us/admin/demote' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "participants": [{"id": "62812345678@c.us"}]
  }'
```

### Leave Group

```bash
curl -X 'POST' \
  'http://localhost:3000/api/default/groups/120363123456@g.us/leave' \
  -H 'X-Api-Key: your_api_key'
```

### Get Invite Code

```bash
curl -X 'GET' \
  'http://localhost:3000/api/default/groups/120363123456@g.us/invite-code' \
  -H 'X-Api-Key: your_api_key'
```

## Webhooks

### Configure Webhook

```bash
curl -X 'POST' \
  'http://localhost:3000/api/sessions' \
  -H 'X-Api-Key: your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "default",
    "config": {
      "webhooks": [
        {
          "url": "https://your-server.com/webhook",
          "events": ["message", "session.status"],
          "hmac": {
            "key": "your-secret-key"
          },
          "retries": {
            "policy": "exponential",
            "delaySeconds": 2,
            "attempts": 5
          }
        }
      ]
    }
  }'
```

### Available Events

| Event | Description |
|-------|-------------|
| `message` | Incoming message |
| `message.any` | All messages (including own) |
| `message.reaction` | Reaction added/removed |
| `message.ack` | Message delivered/read |
| `session.status` | Session status change |
| `group.v2.join` | Joined a group |
| `group.v2.leave` | Left a group |
| `group.v2.participants` | Participant changes |
| `poll.vote` | Poll vote received |
| `call.received` | Incoming call |

### Webhook Headers

- `X-Webhook-Request-Id`: Unique request ID
- `X-Webhook-Timestamp`: Unix timestamp (ms)
- `X-Webhook-Hmac`: HMAC signature (if configured)
- `X-Webhook-Hmac-Algorithm`: `sha512`

### Webhook Payload

```json
{
  "id": "evt_1111111111111111111111111",
  "timestamp": 1741249702485,
  "event": "message",
  "session": "default",
  "me": {
    "id": "62812345678@c.us",
    "pushName": "My Name"
  },
  "payload": {
    "id": "true_62812345678@c.us_AAAAAAAAAA",
    "from": "62812345678@c.us",
    "to": "62812345679@c.us",
    "body": "Hello!",
    "hasMedia": false,
    "fromMe": false
  },
  "engine": "WEBJS"
}
```

## WebSockets

```javascript
const ws = new WebSocket('ws://localhost:3000/ws?x-api-key=your_api_key&session=*&events=message,session.status');

ws.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};
```

## Message ACK Status

| ack | ackName | Description |
|-----|---------|-------------|
| -1 | ERROR | Error occurred |
| 0 | PENDING | Pending |
| 1 | SERVER | Sent to server |
| 2 | DEVICE | Delivered to device |
| 3 | READ | Read by recipient |
| 4 | PLAYED | Played (voice/video) |

## Engines

| Engine | Description |
|--------|-------------|
| `WEBJS` | Stable, reliable, predictable (default) |
| `NOWEB` | Lightweight, fast, flexible |
| `GOWS` | Lightweight golang-based |

## Script Helper

```bash
cd .pi/skills/waha && node scripts/send.js text "62812345678@c.us" "Hello!"
cd .pi/skills/waha && node scripts/send.js image "62812345678@c.us" "https://example.com/image.jpg" --caption="Check this!"
cd .pi/skills/waha && node scripts/sessions.js list
cd .pi/skills/waha && node scripts/sessions.js qr
```

## Tips

1. **Rate Limiting**: Jangan terlalu sering mengirim pesan untuk menghindari blokir
2. **Media Format**: 
   - Image: JPEG
   - Voice: OGG/OPUS
   - Video: MP4 (libx264)
3. **QR Code**: QR berlaku 60 detik pertama, lalu 20 detik untuk berikutnya
4. **Session Storage**: Mount volume `/app/.sessions` untuk persistensi
5. **Production**: Gunakan reverse proxy dengan HTTPS

## Referensi

- [WAHA Documentation](https://waha.devlike.pro/docs/)
- [Dashboard](https://waha.devlike.pro/dashboard)
- [Swagger](https://waha.devlike.pro/swagger)
- [Postman Collection](https://www.postman.com/devlikeapro/workspace/waha)
- [GitHub](https://github.com/devlikeapro/waha)
- [How to Avoid Blocking](https://waha.devlike.pro/docs/overview/%EF%B8%8F-how-to-avoid-blocking/)
