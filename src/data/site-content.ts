import { navCategories } from '@/data/news'
import type {
  AdvertisePageContent,
  ContactPageContent,
  FooterContent,
  HomePageContent,
  NavItem,
  PromoCard,
  StaticPageContent,
} from '@/types/cms'

export const headerContent: {
  navItems: NavItem[]
  promos: PromoCard[]
} = {
  navItems: [
    { label: 'Home', href: '/' },
    { label: 'Business', href: '/category/business' },
    { label: 'Sports', href: '/category/sports' },
    { label: 'Politics', href: '/category/politics' },
    { label: 'Entertainment', href: '/category/entertainment' },
    { label: 'National', href: '/category/politics' },
    { label: 'World', href: '/category/world' },
    { label: 'Travel', href: '/category/world' },
    { label: 'Contact Us', href: '/contact' },
  ],
  promos: [
    {
      title: 'Search your desired job',
      description: 'Discover a career you are passionate about.',
      icon: 'search',
    },
    {
      title: 'Post a job today',
      description: 'Reach the ideal candidate for your team.',
      icon: 'post',
    },
  ],
}

export const homeContent: HomePageContent = {
  hero: {
    leadSlug: 'fg-announces-new-digital-economy-initiative',
    sideSlugs: [
      'lagos-startup-raises-seed-funding-for-fintech-infrastructure',
      'naira-market-shows-signs-of-stability-at-parallel-market',
      'telecom-operators-push-for-faster-right-of-way-approvals',
      'super-eagles-prepare-for-world-cup-qualifier-with-full-squad',
    ],
  },
  trending: {
    slugs: [
      'fg-announces-new-digital-economy-initiative',
      'naira-market-shows-signs-of-stability-at-parallel-market',
      'super-eagles-prepare-for-world-cup-qualifier-with-full-squad',
      'telecom-operators-push-for-faster-right-of-way-approvals',
    ],
  },
  sports: {
    slugs: [
      'lagos-state-to-expand-primary-health-centre-renovation-plan',
      'super-eagles-prepare-for-world-cup-qualifier-with-full-squad',
      'federal-health-workers-outline-patient-safety-demands',
      'telecom-operators-push-for-faster-right-of-way-approvals',
    ],
  },
  editorPicks: {
    slugs: [
      'house-of-representatives-pushes-for-public-sector-data-reforms',
      'lagos-creative-industry-week-shows-strong-crowd-response',
      'education-ministry-rolls-out-new-teacher-training-window',
      'federal-health-workers-outline-patient-safety-demands',
      'streaming-platforms-reshape-film-marketing-across-africa',
    ],
  },
  featuredPosts: {
    slugs: [
      'fg-announces-new-digital-economy-initiative',
      'super-eagles-prepare-for-world-cup-qualifier-with-full-squad',
      'lagos-startup-raises-seed-funding-for-fintech-infrastructure',
      'naira-market-shows-signs-of-stability-at-parallel-market',
      'telecom-operators-push-for-faster-right-of-way-approvals',
      'education-ministry-rolls-out-new-teacher-training-window',
    ],
  },
  weeklyReview: {
    title: 'Weekly Review',
  },
  featuredVideo: {
    title: 'Featured Video',
  },
  categoryBlocks: [
    {
      slug: 'politics',
      label: 'National',
      featuredSlug: 'house-of-representatives-pushes-for-public-sector-data-reforms',
      listSlugs: ['house-of-representatives-pushes-for-public-sector-data-reforms'],
    },
    {
      slug: 'business',
      label: 'Politics',
      featuredSlug: 'fg-announces-new-digital-economy-initiative',
      listSlugs: ['naira-market-shows-signs-of-stability-at-parallel-market', 'lagos-startup-raises-seed-funding-for-fintech-infrastructure'],
    },
    {
      slug: 'world',
      label: 'World',
      featuredSlug: 'daily-paper-roundup-lagos-port-congestion-eases-slightly',
      listSlugs: ['daily-paper-roundup-lagos-port-congestion-eases-slightly'],
    },
    {
      slug: 'sports',
      label: 'Sports',
      featuredSlug: 'super-eagles-prepare-for-world-cup-qualifier-with-full-squad',
      listSlugs: ['super-eagles-prepare-for-world-cup-qualifier-with-full-squad'],
    },
    {
      slug: 'technology',
      label: 'Technology',
      featuredSlug: 'telecom-operators-push-for-faster-right-of-way-approvals',
      listSlugs: ['telecom-operators-push-for-faster-right-of-way-approvals', 'lagos-startup-raises-seed-funding-for-fintech-infrastructure'],
    },
    {
      slug: 'entertainment',
      label: 'Entertainment',
      featuredSlug: 'lagos-creative-industry-week-shows-strong-crowd-response',
      listSlugs: ['lagos-creative-industry-week-shows-strong-crowd-response'],
    },
  ],
}

export const footerContent: FooterContent = {
  description:
    'MyNigeria News is a digital media and information platform committed to delivering accurate, timely, and relevant news about Nigeria. We provide trusted coverage across business, real estate, technology, and national developments, helping individuals and organizations stay informed and make better decisions.',
  mostViewed: [
    {
      title: 'Former NTA Sports\' Niyi Oyeleke Laid to Rest in Offa',
      href: '/article/super-eagles-prepare-for-world-cup-qualifier-with-full-squad',
      date: '05 Mar, 2026',
    },
    {
      title: 'Iran Accuses UN, EU of Silence Over Escalating Middle East Crisis',
      href: '/article/daily-paper-roundup-lagos-port-congestion-eases-slightly',
      date: '05 Mar, 2026',
    },
    {
      title: 'OPL 245: Tinubu ends 15-year oil dispute, boosts deepwater',
      href: '/article/naira-market-shows-signs-of-stability-at-parallel-market',
      date: '05 Mar, 2026',
    },
  ],
  tags: ['Business', 'Sports', 'Politics', 'Entertainment', 'National', 'World', 'Travel', 'Investigations'],
}

export const aboutPageContent: StaticPageContent = {
  eyebrow: 'About',
  title: 'A newsroom built for clear, daily reporting',
  paragraphs: [
    'MyNigeriaNews is designed as a modern editorial platform for national and regional coverage across Nigeria and Africa.',
    'The site focuses on clean hierarchy, fast reading, and a realistic newsroom feel with dense but organized presentation.',
  ],
}

export const advertisePageContent: AdvertisePageContent = {
  eyebrow: 'Advertise',
  title: 'Reach a Nigerian news audience every day',
  paragraphs: ['Use premium placements across the homepage, category pages and article detail layouts.'],
  placements: [
    {
      label: 'News platform',
      title: 'Homepage and article banners',
      description: 'Promote brands across premium masthead, in-article and sidebar positions on the news site.',
    },
    {
      label: 'Job platform',
      title: 'Recruitment campaign banners',
      description: 'Show hiring messages to readers already looking for business, career and opportunity updates.',
    },
    {
      label: 'Car rental platform',
      title: 'Travel and mobility ads',
      description: 'Reach visitors planning trips, transport bookings or short-term vehicle rentals.',
    },
  ],
}

export const privacyPageContent: StaticPageContent = {
  eyebrow: 'Privacy Policy',
  title: 'Privacy and data handling',
  paragraphs: [
    'This prototype does not collect or process real user data. Any newsletter forms are present for UI demonstration only.',
    'If the site is connected to a backend later, this page should be updated with full data processing and consent details.',
  ],
}

export const contactPageContent: ContactPageContent = {
  eyebrow: 'Contact',
  title: 'Contact the newsroom',
  paragraphs: [
    'Reach the MyNigeriaNews editorial and advertising teams through the details below. For press releases, corrections, partnership requests or business enquiries, please use the most relevant channel.',
  ],
  email: 'editor@mynigeria.news',
  phone: '+234 800 000 0000',
  office: '12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
  hours: 'Monday to Friday, 9:00 AM to 5:00 PM. For urgent corrections outside office hours, use the email address above.',
  mapEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=3.3920%2C6.4200%2C3.4370%2C6.4550&layer=mapnik',
}

export const categoryPageContent = navCategories
