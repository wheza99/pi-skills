---
name: seo
description: Skill untuk SEO (Search Engine Optimization) dan GEO (Generative Engine Optimization) di Next.js. Gunakan untuk implementasi metadata, sitemap, robots.txt, structured data (JSON-LD), Open Graph, dan optimasi ranking di Google & AI search engines.
---

# SEO & GEO Skill

Skill ini membantu implementasi SEO dan GEO untuk aplikasi Next.js dengan Supabase backend.

## Quick Start

### 1. Database Tables (Supabase)

```sql
-- Posts table dengan SEO fields
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  canonical_url TEXT,
  
  -- Status & timestamps
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relations
  author_id UUID REFERENCES profiles(id),
  category_id UUID REFERENCES categories(id)
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT
);

-- Authors/Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  expertise TEXT[]
);

-- FAQs untuk GEO structured data
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- HowTo Steps untuk GEO
CREATE TABLE how_to_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT
);

-- Site Settings
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT NOT NULL,
  site_description TEXT,
  default_og_image TEXT,
  google_site_verification TEXT,
  twitter_handle TEXT,
  facebook_app_id TEXT
);

-- Redirects untuk SEO migration
CREATE TABLE redirects (
  id SERIAL PRIMARY KEY,
  source_path TEXT UNIQUE NOT NULL,
  destination_path TEXT NOT NULL,
  is_permanent BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published ON posts(published_at DESC);
```

### 2. Project Structure

```
app/
├── layout.tsx              # Root layout dengan metadata
├── sitemap.ts              # Dynamic sitemap
├── robots.ts               # Robots.txt
├── blog/
│   ├── page.tsx            # Blog listing
│   └── [slug]/page.tsx     # Blog post dengan metadata
├── category/[slug]/page.tsx
├── author/[slug]/page.tsx
├── api/
│   ├── revalidate/route.ts
│   └── page-views/route.ts
└── admin/seo/page.tsx      # SEO dashboard

lib/
├── supabase/
│   ├── client.ts
│   └── server.ts
└── seo/
    ├── metadata.ts
    ├── schema.ts
    └── sitemap.ts

components/
└── seo/
    ├── JsonLd.tsx
    ├── Breadcrumbs.tsx
    └── MetaTags.tsx
```

## Core Implementations

### Sitemap (app/sitemap.ts)

```typescript
import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient()
  
  const [posts, categories] = await Promise.all([
    supabase.from('posts').select('slug, updated_at').eq('status', 'published'),
    supabase.from('categories').select('slug'),
  ])

  const postUrls = posts.data?.map((post) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) ?? []

  return [
    {
      url: process.env.NEXT_PUBLIC_SITE_URL!,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postUrls,
  ]
}
```

### Robots.txt (app/robots.ts)

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
```

### Blog Post dengan SEO (app/blog/[slug]/page.tsx)

```typescript
import { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import JsonLd from '@/components/seo/JsonLd'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient()
  const { data: post } = await supabase
    .from('posts')
    .select(`title, excerpt, featured_image, published_at, updated_at, author:profiles(name)`)
    .eq('slug', params.slug)
    .single()

  if (!post) return { title: 'Not Found' }

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author?.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      images: post.featured_image ? [post.featured_image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export async function generateStaticParams() {
  const supabase = createServerClient()
  const { data: posts } = await supabase.from('posts').select('slug').eq('status', 'published')
  return posts?.map((post) => ({ slug: post.slug })) ?? []
}

export default async function BlogPost({ params }: Props) {
  const supabase = createServerClient()
  const { data: post } = await supabase
    .from('posts')
    .select(`*, author:profiles(name, bio), faqs(question, answer)`)
    .eq('slug', params.slug)
    .single()

  if (!post) return <div>Not Found</div>

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author?.name },
    datePublished: post.published_at,
  }

  const faqSchema = post.faqs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null

  return (
    <>
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <article>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        {post.faqs?.map((faq, i) => (
          <div key={i}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>
    </>
  )
}
```

### JsonLd Component (components/seo/JsonLd.tsx)

```typescript
interface JsonLdProps {
  data: object
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

## Schema Types untuk GEO

### Article Schema
```typescript
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Title',
  description: 'Description',
  author: { '@type': 'Person', name: 'Author Name' },
  publisher: {
    '@type': 'Organization',
    name: 'Site Name',
    logo: { '@type': 'ImageObject', url: 'https://...' },
  },
  datePublished: '2024-01-01',
  dateModified: '2024-01-02',
}
```

### FAQ Schema
```typescript
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Question text?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Answer text.',
      },
    },
  ],
}
```

### HowTo Schema
```typescript
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to do something',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Step 1',
      text: 'Description of step 1',
    },
  ],
}
```

### Organization Schema
```typescript
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Company Name',
  url: 'https://yourdomain.com',
  logo: 'https://yourdomain.com/logo.png',
  sameAs: [
    'https://twitter.com/username',
    'https://linkedin.com/company/name',
  ],
}
```

### Breadcrumb Schema
```typescript
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://yourdomain.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: 'https://yourdomain.com/blog',
    },
  ],
}
```

## SEO Checklist

### Technical SEO
- [ ] Sitemap.xml (app/sitemap.ts)
- [ ] Robots.txt (app/robots.ts)
- [ ] HTTPS enabled
- [ ] Mobile-friendly / responsive
- [ ] Page speed < 3s
- [ ] Core Web Vitals pass

### On-Page SEO
- [ ] Title tag (50-60 chars)
- [ ] Meta description (150-160 chars)
- [ ] H1 tag (1 per page)
- [ ] Heading hierarchy (H1 → H2 → H3)
- [ ] Alt text for images
- [ ] Internal links
- [ ] Canonical URL

### GEO (AI Search)
- [ ] Article structured data
- [ ] FAQ structured data
- [ ] HowTo structured data
- [ ] Author credentials
- [ ] Direct answers at top
- [ ] Fresh/updated content

### Metadata
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Canonical URL
- [ ] Author info
- [ ] Publish/Modified dates

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
REVALIDATION_SECRET=your-secret-key
```

## Referensi

- [Metadata Guide](references/metadata.md) - Next.js metadata lengkap
- [Schema Types](references/schema-types.md) - All JSON-LD schema types
- [Database Schema](references/database.md) - Complete database schema
- [SEO Audit](references/seo-audit.md) - Checklist dan audit guide

## Useful Commands

```bash
# Test structured data
https://search.google.com/test/rich-results

# Page speed test
https://pagespeed.web.dev/

# Mobile friendly test
https://search.google.com/test/mobile-friendly

# robots.txt tester
https://www.google.com/webmasters/tools/robots-testing-tool
```
