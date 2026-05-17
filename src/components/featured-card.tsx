import Image from 'next/image'
import Link from 'next/link'

import { ArrowRight, Clock3 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { NewsArticle } from '@/types/news'

type FeaturedCardProps = {
  article: NewsArticle
  large?: boolean
}

export function FeaturedCard({ article, large }: FeaturedCardProps) {
  return (
    <Card className="overflow-hidden border-neutral-200">
      <Link href={`/article/${article.slug}`} className="block select-none">
        <div className={`relative ${large ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}>
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
        <CardContent className={large ? 'p-5' : 'p-4'}>
          <div className="flex items-center gap-2">
            <Badge>{article.category}</Badge>
            <span className="eyebrow text-neutral-500">Featured</span>
          </div>
          <h3 className={`mt-3 font-semibold leading-[1.18] tracking-[-0.03em] text-neutral-950 ${large ? 'text-[1.6rem]' : 'text-[1.05rem]'}`}>
            {article.title}
          </h3>
          <p className="mt-2 text-[0.92rem] leading-6 text-neutral-600">{article.excerpt}</p>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-neutral-500">
            <Clock3 className="h-3.5 w-3.5" />
            <span>{article.readTime}</span>
          </div>
          <Button variant="link" className="mt-4 h-auto px-0 text-[0.88rem] font-semibold select-none">
            Read story <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardContent>
      </Link>
    </Card>
  )
}
