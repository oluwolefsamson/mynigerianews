import * as React from 'react'

import { cn } from '@/lib/utils'

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100', className)} {...props} />
}

export function AvatarImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={cn('h-full w-full object-cover', className)} />
}

export function AvatarFallback({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex h-full w-full items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700', className)}
      {...props}
    >
      {children}
    </div>
  )
}
