'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

import { cn } from '@/lib/utils'

const DEFAULT_IMAGE_SRC = '/news-default-image.svg'

type NewsImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src: string
  alt: string
}

function isRemoteSrc(src: string) {
  return /^https?:\/\//i.test(src)
}

export function NewsImage({ src, alt, className, fill, width, height, ...props }: NewsImageProps) {
  const initialSrc = src?.trim() || DEFAULT_IMAGE_SRC
  const [currentSrc, setCurrentSrc] = useState(initialSrc)
  const remote = isRemoteSrc(currentSrc)

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      unoptimized={remote}
      referrerPolicy={remote ? 'no-referrer' : props.referrerPolicy}
      onError={() => {
        if (currentSrc !== DEFAULT_IMAGE_SRC) {
          setCurrentSrc(DEFAULT_IMAGE_SRC)
        }
      }}
    />
  )
}
