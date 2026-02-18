// components/seo/JsonLd.tsx
// Component untuk inject JSON-LD structured data

interface JsonLdProps {
  data: object | object[]
}

export default function JsonLd({ data }: JsonLdProps) {
  const jsonLdData = Array.isArray(data) ? data : [data]
  
  return (
    <>
      {jsonLdData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}

// Usage:
// <JsonLd data={articleSchema} />
// <JsonLd data={[articleSchema, faqSchema, breadcrumbSchema]} />
