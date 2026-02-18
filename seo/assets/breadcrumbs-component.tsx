// components/seo/Breadcrumbs.tsx
// Breadcrumb component dengan JSON-LD

import Link from 'next/link'
import { generateBreadcrumbSchema } from '@/lib/seo/schema'
import JsonLd from './JsonLd'

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Generate schema
  const schema = generateBreadcrumbSchema(
    items.map(item => ({
      name: item.name,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}`,
    }))
  )

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <div key={item.href} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {index === items.length - 1 ? (
              <span className="text-gray-600" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-blue-600 hover:text-blue-800"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}

// Usage:
// <Breadcrumbs items={[
//   { name: 'Home', href: '/' },
//   { name: 'Blog', href: '/blog' },
//   { name: 'Article Title', href: '/blog/article-slug' },
// ]} />
