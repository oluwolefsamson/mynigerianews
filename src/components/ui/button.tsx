import * as React from 'react'

import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
  children?: React.ReactNode
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-[#0a8f07] text-white hover:bg-[#087805]',
  secondary: 'bg-neutral-100 text-neutral-950 hover:bg-neutral-200',
  outline: 'border border-neutral-200 bg-white text-neutral-950 hover:bg-neutral-50',
  ghost: 'text-neutral-950 hover:bg-neutral-100',
  link: 'text-[#0a8f07] underline-offset-4 hover:underline',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3 text-sm',
  lg: 'h-11 px-5 text-base',
  icon: 'h-9 w-9',
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a8f07]/25 disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn((children.props as { className?: string }).className, classes),
    })
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
