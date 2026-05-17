import type { MetadataRoute } from 'next'

import { articles, navCategories } from '@/data/news'
import { absoluteUrl } from '@/lib/metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    ...navCategories.map((category) => `/category/${category.slug}`),
    ...articles.map((article) => `/article/${article.slug}`),
  ]

  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
  }))
}
