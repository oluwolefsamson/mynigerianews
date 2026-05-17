import * as React from 'react'

import { cn } from '@/lib/utils'

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-[120px] w-full rounded-[2px] border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-950 ring-offset-white placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a8f07]/20',
        className,
      )}
      {...props}
    />
  )
}
