---
name: vercel
description: Skill untuk membantu development dan deployment dengan Vercel - platform untuk frontend frameworks, serverless functions, storage, AI SDK, dan Next.js. Gunakan ketika user ingin deploy aplikasi, setup Vercel Functions, menggunakan Vercel Blob, Edge Config, atau AI SDK.
---

# Vercel Development

Skill ini membantu development dan deployment dengan Vercel, platform untuk developers yang menyediakan tools, workflows, dan infrastructure untuk membangun dan mendeploy web applications.

## Setup

### Install Vercel CLI

```bash
# Menggunakan npm
npm i -g vercel

# Menggunakan pnpm
pnpm i -g vercel

# Menggunakan bun
bun i -g vercel

# Update ke versi terbaru
npm i -g vercel@latest
```

### Login & Autentikasi

```bash
# Login ke Vercel
vercel login

# Login dengan email spesifik
vercel login your@email.com

# Login dengan GitHub
vercel login --github

# Cek user yang sedang login
vercel whoami
```

## Deploy Project

### Deploy dari CLI

```bash
# Deploy ke preview
vercel

# Deploy ke production
vercel --prod

# Deploy dengan nama spesifik
vercel --prod --yes
```

### Setup Project Baru

```bash
# Link direktori lokal ke Vercel project
vercel link

# Pull environment variables
vercel env pull

# Pull dari environment spesifik
vercel pull --environment=production
```

### Local Development

```bash
# Jalankan development server (replicate Vercel environment)
vercel dev

# Dengan port spesifik
vercel dev --port 3000
```

## Vercel Functions

### Serverless Functions

```typescript
// app/api/hello/route.ts (Next.js App Router)
export async function GET(request: Request) {
  const response = await fetch('https://api.vercel.app/products');
  const products = await response.json();
  return Response.json(products);
}

// POST handler
export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ success: true, data: body });
}
```

### Konfigurasi Functions

```typescript
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10,
      "runtime": "nodejs20.x"
    }
  }
}
```

### Edge Runtime

```typescript
// app/api/edge/route.ts
export const runtime = 'edge';

export async function GET(request: Request) {
  return new Response('Hello from Edge!', {
    headers: { 'content-type': 'text/plain' }
  });
}
```

## AI SDK

### Install AI SDK

```bash
pnpm i ai
```

### Generate Text

```typescript
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-4',
  prompt: 'Explain quantum computing.',
});
```

### Generate Structured Data

```typescript
import { generateObject } from 'ai';
import { z } from 'zod';

const { object } = await generateObject({
  model: 'openai/gpt-4',
  schema: z.object({
    name: z.string(),
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
  }),
  prompt: 'Generate a pasta recipe.',
});
```

### Tool Calling

```typescript
import { generateText, tool } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-4',
  prompt: 'What is the weather in Tokyo?',
  tools: {
    getWeather: tool({
      description: 'Get weather for a location',
      inputSchema: z.object({
        location: z.string(),
      }),
      execute: async ({ location }) => {
        return { location, temperature: 25 };
      },
    }),
  },
});
```

### Streaming

```typescript
import { streamText } from 'ai';

const result = streamText({
  model: 'openai/gpt-4',
  prompt: 'Write a poem about coding.',
});

for await (const textPart of result.textStream) {
  process.stdout.write(textPart);
}
```

## Vercel Blob Storage

### Install

```bash
pnpm i @vercel/blob
```

### Server Upload

```typescript
import { put } from '@vercel/blob';

// Upload file
const blob = await put('avatar.jpg', file, {
  access: 'public',
});

// Upload dengan random suffix
const blob = await put('document.pdf', file, {
  access: 'public',
  addRandomSuffix: true,
});

// Overwrite existing blob
const blob = await put('config.json', file, {
  access: 'public',
  allowOverwrite: true,
});
```

### List & Delete

```typescript
import { list, del, head } from '@vercel/blob';

// List blobs
const { blobs } = await list({
  prefix: 'uploads/',
  limit: 100,
});

// Delete blob
await del(blobUrl);

// Get blob metadata
const blob = await head(blobUrl);
```

### Client Upload

```typescript
// Generate upload URL dari server
import { handleUpload } from '@vercel/blob/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  const blob = await put(file.name, file, {
    access: 'public',
  });
  
  return Response.json(blob);
}
```

## Edge Config

### Setup

```typescript
import { createClient } from '@vercel/edge-config';

const edgeConfig = createClient(process.env.EDGE_CONFIG_ID);
```

### Read Data

```typescript
// Get single value
const value = await edgeConfig.get('feature-flag');

// Get all values
const all = await edgeConfig.getAll();

// Get multiple values
const values = await edgeConfig.get(['flag1', 'flag2']);
```

### Feature Flags

```typescript
// app/layout.tsx
import { getIndex } from '@vercel/edge-config';

export default async function RootLayout() {
  const showNewFeature = await getIndex('new-feature-enabled');
  
  return (
    <html>
      <body>
        {showNewFeature ? <NewFeature /> : <OldFeature />}
      </body>
    </html>
  );
}
```

## Next.js Specific

### ISR (Incremental Static Regeneration)

```typescript
// app/page.tsx
export default async function Page() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 }, // Revalidate setiap 60 detik
  });
  const data = await res.json();
  
  return <div>{data.title}</div>;
}
```

### Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
/>
```

### Font Optimization

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### OG Image Generation

```tsx
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Default Title';
  
  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        fontSize: 60,
        background: 'white',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {title}
      </div>
    ),
    { width: 1200, height: 600 }
  );
}
```

## Environments

- **Local**: Development di local machine
- **Preview**: Pre-production testing (otomatis dari branch non-main)
- **Production**: Live, user-facing site
- **Custom**: Staging, QA, dll (Pro/Enterprise)

### Environment Variables

```bash
# List env vars
vercel env ls

# Add env var
vercel env add MY_KEY production

# Pull env vars ke local
vercel env pull .env.local

# Remove env var
vercel env rm MY_KEY production
```

## CLI Commands Reference

```bash
# Deployment
vercel                  # Deploy ke preview
vercel --prod           # Deploy ke production
vercel deploy           # Sama dengan vercel
vercel build            # Build locally

# Project management
vercel project ls       # List projects
vercel project add      # Create project
vercel project rm       # Remove project
vercel link             # Link local dir to project

# Logs & debugging
vercel logs [url]       # View logs
vercel logs [url] --follow  # Stream logs
vercel inspect [url]    # Deployment details

# Domains
vercel domains ls       # List domains
vercel domains add [domain]
vercel domains rm [domain]
vercel domains buy [domain]

# DNS
vercel dns ls [domain]
vercel dns add [domain] [name] [type] [value]

# Certificates
vercel certs ls
vercel certs issue [domain]

# Storage
vercel blob list        # List blobs
vercel blob put [file]  # Upload blob
vercel blob del [url]   # Delete blob

# Cache
vercel cache purge      # Purge all cache
vercel cache purge --type cdn
vercel cache purge --type data

# Rollback
vercel rollback         # Rollback production
vercel rollback [url]   # Rollback to specific

# Promote
vercel promote [url]    # Promote deployment
```

## vercel.json Configuration

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "outputDirectory": ".next",
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ],
  "redirects": [
    { "source": "/old", "destination": "/new", "permanent": true }
  ],
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.example.com/:path*" }
  ]
}
```

## Useful Links

- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- AI SDK: https://sdk.vercel.ai
- Templates: https://vercel.com/templates
- Status: https://vercel-status.com
- Community: https://community.vercel.com
- GitHub: https://github.com/vercel
