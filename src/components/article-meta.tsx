import { Clock3, MapPin, User2, Eye } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

type ArticleMetaProps = {
  category: string
  author: string
  authorRole: string
  publishedAt: string
  readTime: string
  location?: string
  viewsCount?: number
}

export function ArticleMeta({ category, author, authorRole, publishedAt, readTime, location, viewsCount }: ArticleMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600">
      <Badge>{category}</Badge>
      <span className="inline-flex items-center gap-1">
        <User2 className="h-4 w-4 text-[#0a8f07]" />
        {author}, {authorRole}
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock3 className="h-4 w-4 text-[#0a8f07]" />
        {readTime}
      </span>
      <span>{new Intl.DateTimeFormat('en-NG', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(publishedAt))}</span>
      {location ? (
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-4 w-4 text-[#0a8f07]" />
          {location}
        </span>
      ) : null}
      {viewsCount !== undefined ? (
        <span className="inline-flex items-center gap-1">
          <Eye className="h-4 w-4 text-[#0a8f07]" />
          {viewsCount.toLocaleString()} {viewsCount === 1 ? 'view' : 'views'}
        </span>
      ) : null}
    </div>
  )
}
