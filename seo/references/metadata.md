# Next.js Metadata Guide

## Static Metadata

```typescript
// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Site Name',
    template: '%s | Site Name',
  },
  description: 'Site description with keywords',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  authors: [{ name: 'Author Name', url: 'https://...' }],
  creator: 'Creator Name',
  publisher: 'Publisher Name',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://yourdomain.com',
    siteName: 'Site Name',
    title: 'Title',
    description: 'Description',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Alt text',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Title',
    description: 'Description',
    images: ['/twitter-image.jpg'],
    creator: '@username',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-code',
  },
  
  // Other
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourdomain.com'),
  alternates: {
    canonical: 'https://yourdomain.com',
    languages: {
      'id-ID': 'https://yourdomain.com/id',
      'en-US': 'https://yourdomain.com/en',
    },
  },
}
```

## Dynamic Metadata

```typescript
// app/blog/[slug]/page.tsx
import { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  // Get parent metadata
  const previousImages = (await parent).openGraph?.images || []
  
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: post.image ? [post.image] : previousImages,
    },
    alternates: {
      canonical: `https://yourdomain.com/blog/${params.slug}`,
    },
  }
}
```

## Metadata by Page Type

### Homepage
```typescript
export const metadata: Metadata = {
  title: 'Site Name - Tagline',
  description: 'Main description with primary keywords',
  openGraph: {
    type: 'website',
    images: ['/og-home.jpg'],
  },
}
```

### Blog Post
```typescript
export const metadata: Metadata = {
  title: 'Post Title',
  description: 'Post excerpt or meta description',
  authors: [{ name: 'Author' }],
  openGraph: {
    type: 'article',
    publishedTime: '2024-01-01',
    authors: ['Author'],
    section: 'Category',
    tags: ['tag1', 'tag2'],
  },
}
```

### Product Page
```typescript
export const metadata: Metadata = {
  title: 'Product Name',
  description: 'Product description',
  openGraph: {
    type: 'product',
    images: ['/product.jpg'],
    price: {
      amount: '99.99',
      currency: 'USD',
    },
  },
}
```

### Category Page
```typescript
export const metadata: Metadata = {
  title: 'Category Name',
  description: 'Category description',
  openGraph: {
    type: 'website',
  },
}
```

## Title Template

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'Site Name',
    template: '%s | Site Name',  // "Page Title | Site Name"
  },
}

// app/about/page.tsx
export const metadata: Metadata = {
  title: 'About Us',  // Result: "About Us | Site Name"
}
```

## Image Guidelines

| Platform | Size | Aspect Ratio |
|----------|------|--------------|
| Facebook/LinkedIn | 1200x630 | 1.91:1 |
| Twitter Large | 1200x600 | 2:1 |
| Twitter Small | 600x335 | 1.8:1 |
| WhatsApp | 300x157 | 1.91:1 |

## Character Limits

| Field | Limit | Best Practice |
|-------|-------|---------------|
| Title | 60 chars | 50-60 chars |
| Meta Description | 160 chars | 140-160 chars |
| OG Title | 65 chars | 40-65 chars |
| OG Description | 200 chars | 150-200 chars |
