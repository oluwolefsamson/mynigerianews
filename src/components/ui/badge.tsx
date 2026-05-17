import * as React from 'react'

import { cn } from '@/lib/utils'

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-[2px] border border-[#0a8f07]/20 bg-white px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0a8f07]',
        className,
      )}
      {...props}
    />
  )
}
