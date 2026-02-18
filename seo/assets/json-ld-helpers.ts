// lib/seo/schema.ts
// Helper functions untuk generate JSON-LD structured data

// Base schema
export interface SchemaBase {
  '@context': 'https://schema.org'
  '@type': string
}

// Organization Schema
export function generateOrganizationSchema(config: {
  name: string
  url: string
  logo: string
  description?: string
  sameAs?: string[]
  address?: {
    street: string
    city: string
    region: string
    postalCode: string
    country: string
  }
  contactPoint?: {
    phone: string
    contactType: string
  }
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url: config.url,
    logo: config.logo,
  }

  if (config.description) schema.description = config.description
  if (config.sameAs) schema.sameAs = config.sameAs
  if (config.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: config.address.street,
      addressLocality: config.address.city,
      addressRegion: config.address.region,
      postalCode: config.address.postalCode,
      addressCountry: config.address.country,
    }
  }
  if (config.contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      telephone: config.contactPoint.phone,
      contactType: config.contactPoint.contactType,
    }
  }

  return schema
}

// Website Schema (untuk search box)
export function generateWebsiteSchema(config: {
  name: string
  url: string
  searchUrl?: string
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: config.url,
  }

  if (config.searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.searchUrl}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    }
  }

  return schema
}

// Article Schema
export function generateArticleSchema(config: {
  headline: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  author: {
    name: string
    url?: string
  }
  publisher: {
    name: string
    logo: string
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.headline,
    description: config.description,
    url: config.url,
    ...(config.image && { image: config.image }),
    datePublished: config.datePublished,
    dateModified: config.dateModified || config.datePublished,
    author: {
      '@type': 'Person',
      name: config.author.name,
      ...(config.author.url && { url: config.author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: config.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: config.publisher.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': config.url,
    },
  }
}

// BlogPosting Schema
export function generateBlogPostingSchema(config: {
  headline: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  author: {
    name: string
    url?: string
  }
  publisher: {
    name: string
    logo: string
  }
  wordCount?: number
  articleBody?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: config.headline,
    description: config.description,
    url: config.url,
    ...(config.image && { image: config.image }),
    datePublished: config.datePublished,
    dateModified: config.dateModified || config.datePublished,
    author: {
      '@type': 'Person',
      name: config.author.name,
      ...(config.author.url && { url: config.author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: config.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: config.publisher.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': config.url,
    },
    ...(config.wordCount && { wordCount: config.wordCount }),
    ...(config.articleBody && { articleBody: config.articleBody }),
  }
}

// FAQ Schema
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// HowTo Schema
export function generateHowToSchema(config: {
  name: string
  description?: string
  totalTime?: string
  steps: Array<{
    name: string
    text: string
    image?: string
  }>
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: config.name,
    ...(config.description && { description: config.description }),
    ...(config.totalTime && { totalTime: config.totalTime }),
    step: config.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  }
}

// Breadcrumb Schema
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Person Schema (untuk author)
export function generatePersonSchema(config: {
  name: string
  url: string
  image?: string
  jobTitle?: string
  worksFor?: string
  sameAs?: string[]
  knowsAbout?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.name,
    url: config.url,
    ...(config.image && { image: config.image }),
    ...(config.jobTitle && { jobTitle: config.jobTitle }),
    ...(config.worksFor && {
      worksFor: {
        '@type': 'Organization',
        name: config.worksFor,
      },
    }),
    ...(config.sameAs && { sameAs: config.sameAs }),
    ...(config.knowsAbout && { knowsAbout: config.knowsAbout }),
  }
}

// Combine multiple schemas using @graph
export function combineSchemas(...schemas: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  }
}
