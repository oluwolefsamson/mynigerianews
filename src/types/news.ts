export type CategorySlug =
  | 'politics'
  | 'business'
  | 'entertainment'
  | 'sports'
  | 'technology'
  | 'health'
  | 'education'
  | 'world'

export type NewsArticle = {
  slug: string
  title: string
  excerpt: string
  category: string
  categorySlug: CategorySlug
  author: string
  authorRole: string
  publishedAt: string
  updatedAt?: string
  readTime: string
  image: string
  imageAlt: string
  video_url?: string | null
  featured?: boolean
  spotlight?: boolean
  location?: string
  tags: string[]
  content: string[]
  bullets?: string[]
  related: string[]
  sourceUrl?: string | null
}

export type CategoryDefinition = {
  slug: CategorySlug
  label: string
  description: string
}
