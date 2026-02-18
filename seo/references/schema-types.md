# JSON-LD Schema Types

## Article

```typescript
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Article description",
  "image": [
    "https://example.com/photos/1x1/photo.jpg",
    "https://example.com/photos/4x3/photo.jpg",
    "https://example.com/photos/16x9/photo.jpg"
  ],
  "datePublished": "2024-01-01T08:00:00+08:00",
  "dateModified": "2024-01-02T09:20:00+08:00",
  "author": [{
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/authors/author-name"
  }],
  "publisher": {
    "@type": "Organization",
    "name": "Publisher Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.jpg"
    }
  }
}
```

## BlogPosting

```typescript
const blogPostingSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Blog Post Title",
  "description": "Description",
  "datePublished": "2024-01-01",
  "dateModified": "2024-01-02",
  "author": {
    "@type": "Person",
    "name": "Author",
    "url": "https://example.com/author"
  },
  "image": "https://example.com/image.jpg",
  "publisher": {
    "@type": "Organization",
    "name": "Site Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/blog/post-slug"
  }
}
```

## FAQPage

```typescript
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This is the answer to the question."
      }
    },
    {
      "@type": "Question",
      "name": "Another question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Another answer here."
      }
    }
  ]
}
```

## HowTo

```typescript
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to do something",
  "description": "Complete description of the task",
  "totalTime": "PT30M", // ISO 8601 duration
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "10"
  },
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Step 1 Name",
      "text": "Detailed description of step 1",
      "image": "https://example.com/step1.jpg"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Step 2 Name",
      "text": "Detailed description of step 2",
      "image": "https://example.com/step2.jpg"
    }
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "Tool Name"
    }
  ],
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "Supply Name"
    }
  ]
}
```

## Organization

```typescript
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "description": "Company description",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Street",
    "addressLocality": "City",
    "addressRegion": "State",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-123-456-7890",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://facebook.com/company",
    "https://twitter.com/company",
    "https://linkedin.com/company/name",
    "https://instagram.com/company"
  ]
}
```

## Person

```typescript
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Full Name",
  "url": "https://example.com/author/name",
  "image": "https://example.com/avatar.jpg",
  "jobTitle": "Job Title",
  "worksFor": {
    "@type": "Organization",
    "name": "Company Name"
  },
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "University Name"
  },
  "knowsAbout": ["Topic 1", "Topic 2", "Topic 3"],
  "sameAs": [
    "https://twitter.com/username",
    "https://linkedin.com/in/username",
    "https://github.com/username"
  ]
}
```

## BreadcrumbList

```typescript
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Category",
      "item": "https://example.com/category"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Article Title",
      "item": "https://example.com/category/article"
    }
  ]
}
```

## WebSite (for Sitelinks Search Box)

```typescript
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Site Name",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

## Product

```typescript
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "image": "https://example.com/product.jpg",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/product",
    "priceCurrency": "USD",
    "price": "99.99",
    "priceValidUntil": "2024-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Seller Name"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "100"
  }
}
```

## LocalBusiness

```typescript
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "image": "https://example.com/image.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Street",
    "addressLocality": "City",
    "addressRegion": "State",
    "postalCode": "12345"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -6.2088,
    "longitude": 106.8456
  },
  "url": "https://example.com",
  "telephone": "+1-123-456-7890",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ]
}
```

## VideoObject

```typescript
const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Video Title",
  "description": "Video description",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "uploadDate": "2024-01-01T08:00:00+08:00",
  "duration": "PT5M30S",
  "contentUrl": "https://example.com/video.mp4",
  "embedUrl": "https://example.com/embed/video"
}
```

## Course

```typescript
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Course Name",
  "description": "Course description",
  "provider": {
    "@type": "Organization",
    "name": "Provider Name"
  },
  "educationalCredentialAwarded": "Certificate",
  "occupationalCredentialAwarded": "Job Title"
}
```

## Recipe

```typescript
const recipeSchema = {
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Recipe Name",
  "description": "Recipe description",
  "image": "https://example.com/recipe.jpg",
  "author": {
    "@type": "Person",
    "name": "Author"
  },
  "datePublished": "2024-01-01",
  "prepTime": "PT15M",
  "cookTime": "PT30M",
  "totalTime": "PT45M",
  "recipeYield": "4 servings",
  "recipeIngredient": [
    "1 cup ingredient 1",
    "2 cups ingredient 2"
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "text": "Step 1 description"
    },
    {
      "@type": "HowToStep",
      "text": "Step 2 description"
    }
  ],
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "250 calories"
  }
}
```

## Event

```typescript
const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Event Name",
  "description": "Event description",
  "startDate": "2024-06-01T09:00:00+07:00",
  "endDate": "2024-06-01T17:00:00+07:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Venue Name",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Street",
      "addressLocality": "City",
      "addressCountry": "ID"
    }
  },
  "image": "https://example.com/event.jpg",
  "organizer": {
    "@type": "Organization",
    "name": "Organizer Name"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/tickets",
    "price": "100000",
    "priceCurrency": "IDR",
    "availability": "https://schema.org/InStock"
  }
}
```

## Multiple Schemas in One Page

```typescript
// Combine multiple schemas
export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      
      {/* Page content */}
    </>
  )
}
```

## Graph (Multiple Entities)

```typescript
const graphSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "Site Name",
      "url": "https://example.com"
    },
    {
      "@type": "Organization",
      "name": "Company Name",
      "url": "https://example.com"
    },
    {
      "@type": "WebPage",
      "name": "Page Title",
      "url": "https://example.com/page"
    }
  ]
}
```
