import type { CategorySlug } from '@/types/news'

export type NavItem = {
  label: string
  href: string
}

export type PromoCard = {
  title: string
  description: string
  icon: 'search' | 'post'
}

export type HeroSectionConfig = {
  leadSlug: string
  sideSlugs: string[]
}

export type StorySectionConfig = {
  slugs: string[]
}

export type CategoryBlockConfig = {
  slug: CategorySlug
  label: string
  featuredSlug: string
  listSlugs: string[]
}

export type HomePageContent = {
  hero: HeroSectionConfig
  trending: StorySectionConfig
  sports: StorySectionConfig
  editorPicks: StorySectionConfig
  featuredPosts: StorySectionConfig
  weeklyReview: {
    title: string
  }
  featuredVideo: {
    title: string
  }
  categoryBlocks: CategoryBlockConfig[]
}

export type FooterContent = {
  description: string
  mostViewed: { title: string; href: string; date: string }[]
  tags: string[]
}

export type StaticPageContent = {
  eyebrow: string
  title: string
  paragraphs: string[]
}

export type AdvertisePlacement = {
  title: string
  description: string
  label: string
}

export type AdvertisePageContent = StaticPageContent & {
  placements: AdvertisePlacement[]
}

export type ContactPageContent = StaticPageContent & {
  email: string
  phone: string
  office: string
  hours: string
  mapEmbedUrl: string
}
