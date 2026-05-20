'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, fadeIn, staggerContainer, scaleIn, viewportOnce } from '@/lib/motion'

type Variant = 'fadeInUp' | 'fadeIn' | 'scaleIn' | 'stagger'

const variantMap = {
  fadeInUp,
  fadeIn,
  scaleIn,
  stagger: staggerContainer,
}

type AnimatedSectionProps = {
  children: ReactNode
  className?: string
  variant?: Variant
  delay?: number
  as?: 'div' | 'section' | 'aside'
}

export function AnimatedSection({
  children,
  className,
  variant = 'fadeInUp',
  delay = 0,
  as = 'div',
}: AnimatedSectionProps) {
  const Tag = motion[as]
  const variants = variantMap[variant]

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Tag>
  )
}

export function AnimatedGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div className={className} variants={fadeInUp}>
      {children}
    </motion.div>
  )
}
