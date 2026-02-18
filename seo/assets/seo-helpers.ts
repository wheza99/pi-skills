// lib/seo/metadata.ts
// Helper functions untuk generate metadata

import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  url: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  noindex?: boolean
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Your Site Name'
const DEFAULT_OG_IMAGE = process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE || '/og-default.jpg'

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    url,
    image = DEFAULT_OG_IMAGE,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags,
    noindex = false,
  } = config

  const fullImageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: type === 'article' ? 'article' : 'website',
      images: [{ url: fullImageUrl, width: 1200, height: 630 }],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
    },
    alternates: {
      canonical: url,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

// Generate metadata untuk blog post
export function generatePostMetadata(post: {
  title: string
  excerpt: string
  slug: string
  featuredImage?: string
  publishedAt: string
  updatedAt?: string
  author?: { name: string }
  category?: { name: string }
  tags?: { name: string }[]
}): Metadata {
  return generateMetadata({
    title: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    image: post.featuredImage,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    author: post.author?.name,
    section: post.category?.name,
    tags: post.tags?.map(t => t.name),
  })
}

// Generate metadata untuk category page
export function generateCategoryMetadata(category: {
  name: string
  description?: string
  slug: string
}): Metadata {
  return generateMetadata({
    title: `${category.name} - ${SITE_NAME}`,
    description: category.description || `Artikel dalam kategori ${category.name}`,
    url: `${SITE_URL}/category/${category.slug}`,
  })
}

// Generate metadata untuk author page
export function generateAuthorMetadata(author: {
  name: string
  bio?: string
  slug: string
}): Metadata {
  return generateMetadata({
    title: `${author.name} - ${SITE_NAME}`,
    description: author.bio || `Artikel oleh ${author.name}`,
    url: `${SITE_URL}/author/${author.slug}`,
  })
}

// Generate root layout metadata
export function generateRootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: 'Your site description here',
    keywords: ['keyword1', 'keyword2', 'keyword3'],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: SITE_URL,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
