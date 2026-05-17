'use client'

import { useMemo, useState } from 'react'

import { Facebook, Link2, Share2, Twitter } from 'lucide-react'

import { Button } from '@/components/ui/button'

type ArticleShareActionsProps = {
  url: string
  title: string
}

export function ArticleShareActions({ url, title }: ArticleShareActionsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = useMemo(() => encodeURIComponent(url), [url])
  const encodedTitle = useMemo(() => encodeURIComponent(title), [title])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      window.open(`mailto:?subject=${encodedTitle}&body=${encodedUrl}`, '_blank', 'noopener,noreferrer')
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // fall through to copy
      }
    }
    await copyLink()
  }

  return (
    <>
      <Button asChild variant="outline" size="sm">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer">
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </a>
      </Button>
      <Button asChild variant="outline" size="sm">
        <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer">
          <Twitter className="mr-2 h-4 w-4" />
          X
        </a>
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={nativeShare}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={copyLink}>
        <Link2 className="mr-2 h-4 w-4" />
        {copied ? 'Copied' : 'Copy link'}
      </Button>
    </>
  )
}
