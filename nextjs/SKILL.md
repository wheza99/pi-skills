---
name: nextjs
description: Skill untuk membantu development dengan Next.js. Gunakan ketika membuat project Next.js, setup routing, data fetching, API routes, optimization, atau konfigurasi next.config.js.
---

# Next.js Development Skill

Skill ini membantu development aplikasi Next.js dengan App Router (Next.js 13+) dan Pages Router.

## Quick Start

### Membuat Project Baru

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd my-app
npm run dev
```

### Struktur Direktori App Router

```
app/
├── layout.js          # Root layout (wajib)
├── page.js            # Home page (/)
├── loading.js         # Loading UI
├── error.js           # Error handling
├── not-found.js       # 404 page
├── globals.css        # Global styles
├── favicon.ico        # Favicon
├── api/               # API routes
│   └── route.js
├── (group)/           # Route groups
│   └── page.js
└── [dynamic]/         # Dynamic routes
    └── page.js
```

## Routing

### App Router

| File | Route | Deskripsi |
|------|-------|-----------|
| `app/page.js` | `/` | Home page |
| `app/about/page.js` | `/about` | About page |
| `app/blog/[slug]/page.js` | `/blog/hello` | Dynamic route |
| `app/blog/[...slug]/page.js` | `/blog/a/b/c` | Catch-all route |
| `app/api/route.js` | `/api` | API endpoint |

### Pages Router (Legacy)

| File | Route |
|------|-------|
| `pages/index.js` | `/` |
| `pages/about.js` | `/about` |
| `pages/blog/[slug].js` | `/blog/:slug` |

## Page & Layout

### Page (app/page.js)

```tsx
// app/page.tsx
export default function Home() {
  return <h1>Hello World</h1>
}
```

### Layout (app/layout.js)

```tsx
// app/layout.tsx
import './globals.css'

export const metadata = {
  title: 'My App',
  description: 'Description here',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Nested Layout

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  )
}
```

## Data Fetching

### Server Components (Default)

```tsx
// app/users/page.tsx
async function getUsers() {
  const res = await fetch('https://api.example.com/users', {
    cache: 'no-store', // atau 'force-cache'
  })
  return res.json()
}

export default async function UsersPage() {
  const users = await getUsers()
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Revalidation

```tsx
// Revalidate setiap 60 detik
fetch('https://...', { next: { revalidate: 60 } })

// Atau di level page
export const revalidate = 60 // dalam detik
```

### Client Components

```tsx
'use client'

import { useState, useEffect } from 'react'

export default function ClientPage() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])
  
  return <div>{JSON.stringify(data)}</div>
}
```

## API Routes

### Route Handler (App Router)

```tsx
// app/api/users/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const users = [{ id: 1, name: 'John' }]
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  // Process body...
  return NextResponse.json({ success: true })
}
```

### Dynamic API Route

```tsx
// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  return NextResponse.json({ id })
}
```

## Server Actions

```tsx
// app/actions.ts
'use server'

export async function createUser(formData: FormData) {
  const name = formData.get('name')
  // Save to database...
  return { success: true }
}

// app/page.tsx
import { createUser } from './actions'

export default function Page() {
  return (
    <form action={createUser}>
      <input name="name" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Navigation

### Link Component

```tsx
import Link from 'next/link'

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog/123">Blog Post</Link>
    </nav>
  )
}
```

### Programmatic Navigation

```tsx
'use client'

import { useRouter } from 'next/navigation'

export default function Component() {
  const router = useRouter()
  
  return (
    <button onClick={() => router.push('/dashboard')}>
      Go to Dashboard
    </button>
  )
}
```

## Metadata & SEO

### Static Metadata

```tsx
export const metadata = {
  title: 'My Page',
  description: 'Page description',
  keywords: ['nextjs', 'react'],
  openGraph: {
    title: 'My Page',
    description: 'Page description',
    type: 'article',
  },
}
```

### Dynamic Metadata

```tsx
export async function generateMetadata({ params }) {
  return {
    title: `Post ${params.id}`,
  }
}
```

## Images & Assets

### next/image

```tsx
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={800}
      height={600}
      priority // Untuk above-the-fold images
    />
  )
}

// Remote images - tambahkan ke next.config.js:
// images: { remotePatterns: [{ hostname: 'example.com' }] }
```

### next/font

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

## Styling

### CSS Modules

```tsx
// styles.module.css
.container { padding: 1rem; }

// Component
import styles from './styles.module.css'
export default () => <div className={styles.container}>...</div>
```

### Tailwind CSS

```tsx
export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Hello</h1>
    </div>
  )
}
```

### Global CSS

```tsx
// app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { --primary: blue; }
```

## Error Handling

### error.js

```tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### not-found.js

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

## Middleware

```tsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check auth, redirect, etc.
  if (!request.cookies.get('token')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

## Environment Variables

```bash
# .env.local
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=https://api.example.com
```

```tsx
// Server-only
const dbUrl = process.env.DATABASE_URL

// Client-accessible (must prefix with NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

## next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'images.example.com' },
    ],
  },
  experimental: {
    serverActions: true,
  },
  // Redirects
  async redirects() {
    return [
      { source: '/old', destination: '/new', permanent: true },
    ]
  },
  // Rewrites
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'https://api.example.com/:path*' },
    ]
  },
}

module.exports = nextConfig
```

## Common Patterns

### Loading Skeleton

```tsx
// app/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Loading...</div>
}
```

### Parallel Routes

```tsx
// app/@team/page.tsx dan app/@analytics/page.tsx
// app/layout.tsx
export default function Layout({
  team,
  analytics,
}: {
  team: React.ReactNode
  analytics: React.ReactNode
}) {
  return (
    <div>
      {team}
      {analytics}
    </div>
  )
}
```

### Intercepting Routes

```
app/
├── feed/
│   └── page.js           # /feed
├── (.)photo/
│   └── [id]/
│       └── page.js       # Intercept /photo/:id in modal
└── photo/
    └── [id]/
        └── page.js       # /photo/:id full page
```

## Referensi

Lihat file referensi tambahan:
- [File Conventions](references/file-conventions.md) - Daftar lengkap file conventions
- [Functions](references/functions.md) - API functions reference
- [Config](references/config.md) - Konfigurasi next.config.js

## Useful Commands

```bash
# Development
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Turbopack (faster dev)
next dev --turbo

# Export static site
next build && next export
```

## Debugging Tips

1. **Server vs Client**: Gunakan `'use client'` untuk komponen yang membutuhkan interactivity
2. **Hydration Error**: Pastikan server dan client render sama
3. **Cache Issues**: Gunakan `cache: 'no-store'` untuk data dinamis
4. **Image Optimization**: Tambahkan domain ke `remotePatterns`
5. **Environment Variables**: Restart dev server setelah mengubah .env
