import { CategoryDefinition, NewsArticle } from '@/types/news'

export const siteName = 'MyNigeriaNews'

export const navCategories: CategoryDefinition[] = [
  { slug: 'politics', label: 'Politics', description: 'National policy, elections, governance and public affairs.' },
  { slug: 'business', label: 'Business', description: 'Markets, enterprise, banking, and economic policy.' },
  { slug: 'entertainment', label: 'Entertainment', description: 'Film, music, celebrity, and culture coverage.' },
  { slug: 'sports', label: 'Sports', description: 'Football, athletics, and the wider sporting calendar.' },
  { slug: 'technology', label: 'Technology', description: 'Startups, telecoms, AI, and digital innovation.' },
  { slug: 'health', label: 'Health', description: 'Public health, hospitals, and wellness reporting.' },
  { slug: 'education', label: 'Education', description: 'Schools, tertiary education, exams, and learning policy.' },
  { slug: 'world', label: 'World', description: 'Africa and international developments with local impact.' },
]

export const breakingItems = [
  'FG moves to expand digital identity rollout across public services',
  'Lagos dry port operators seek faster customs clearance reforms',
  'Super Eagles camp opens ahead of World Cup qualifier window',
  'Education unions flag staffing gaps in state-owned universities',
]

export const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com', short: 'Fb' },
  { label: 'X', href: 'https://x.com', short: 'X' },
  { label: 'Instagram', href: 'https://instagram.com', short: 'Ig' },
  { label: 'YouTube', href: 'https://youtube.com', short: 'Yt' },
]

export const articles: NewsArticle[] = [
  {
    slug: 'fg-announces-new-digital-economy-initiative',
    title: 'FG Announces New Digital Economy Initiative to Support SMEs and Public Services',
    excerpt:
      'The new programme is expected to improve broadband access, streamline business registration and expand digital literacy across the states.',
    category: 'Politics',
    categorySlug: 'politics',
    author: 'Amina Bello',
    authorRole: 'Senior Correspondent',
    publishedAt: '2026-05-17T06:30:00+01:00',
    readTime: '4 min read',
    image: 'https://img.freepik.com/free-photo/group-people-working-out-business-plan-office_1303-15773.jpg',
    imageAlt: 'Business team discussing strategy in a meeting room',
    featured: true,
    spotlight: true,
    location: 'Abuja',
    tags: ['Digital policy', 'SMEs', 'Broadband'],
    bullets: ['New public-private framework to expand connectivity', 'One-stop digital onboarding to reduce paperwork'],
    content: [
      'The Federal Government on Friday outlined a broad digital economy initiative aimed at deepening access to online public services and improving the operating environment for small businesses.',
      'Officials said the programme will focus on broadband expansion, digital identity systems, technology skills, and faster registration channels for entrepreneurs who still rely on paper-heavy processes.',
      'Industry stakeholders have repeatedly argued that a more predictable digital backbone would reduce administrative friction, shorten turnaround times and improve tax compliance without raising the burden on firms.',
      'The ministry said implementation will be phased, with priority given to federal agencies that handle payments, licensing and business verification.',
    ],
    related: ['lagos-startup-raises-seed-funding-for-fintech-infrastructure', 'naira-market-shows-signs-of-stability-at-parallel-market', 'house-of-representatives-pushes-for-public-sector-data-reforms'],
  },
  {
    slug: 'super-eagles-prepare-for-world-cup-qualifier-with-full-squad',
    title: 'Super Eagles Prepare for World Cup Qualifier With Full Squad in Camp',
    excerpt:
      'Coaches say the team is focused on set pieces, fitness checks and tactical drills ahead of a decisive fixture in Uyo.',
    category: 'Sports',
    categorySlug: 'sports',
    author: 'Chinedu Okafor',
    authorRole: 'Sports Editor',
    publishedAt: '2026-05-17T08:10:00+01:00',
    readTime: '3 min read',
    image: 'https://img.freepik.com/free-photo/photographer-taking-picture-ocean-coast_657883-287.jpg',
    imageAlt: 'Photographer capturing a sports scene outdoors',
    featured: true,
    location: 'Uyo',
    tags: ['Football', 'CAF', 'World Cup'],
    content: [
      'The Super Eagles have opened camp with a near-complete squad as preparations intensify for the next World Cup qualifier.',
      'Officials said the technical crew wants an early start on shape, recovery and finishing patterns after a congested run of club matches across Europe and North Africa.',
      'Supporters in Uyo are expected to turn out in large numbers, with ticket sales tracking ahead of last week’s pace.',
    ],
    related: ['lagos-stadium-renovation-work-enters-final-phase', 'nigerian-athlete-breaks-national-record-at-track-meet', 'private-clubs-raise-concerns-over-league-calendar-overlap'],
  },
  {
    slug: 'lagos-startup-raises-seed-funding-for-fintech-infrastructure',
    title: 'Lagos Startup Raises Seed Funding for Fintech Infrastructure Expansion',
    excerpt:
      'The company says it will use the new round to grow payment tooling for merchants and onboard more businesses across West Africa.',
    category: 'Business',
    categorySlug: 'business',
    author: 'Bamidele Akinyemi',
    authorRole: 'Business Reporter',
    publishedAt: '2026-05-17T07:45:00+01:00',
    readTime: '4 min read',
    image: 'https://img.freepik.com/free-photo/meeting-with-business-partner_1098-19613.jpg',
    imageAlt: 'Business professionals in a planning meeting',
    featured: true,
    location: 'Lagos',
    tags: ['Startup', 'Fintech', 'Funding'],
    content: [
      'A Lagos-based fintech infrastructure startup has closed a seed round that backers say will accelerate payment reliability for small and medium-sized merchants.',
      'The founders said the capital will go into product engineering, compliance automation and regional sales as the company moves from pilot deployments to a broader rollout.',
      'Investors continue to lean into tools that simplify settlement, reconciliation and merchant onboarding in a market where transaction volumes are still rising.',
    ],
    related: ['naira-market-shows-signs-of-stability-at-parallel-market', 'banks-tighten-controls-on-agent-banking-fraud', 'telecom-operators-push-for-faster-right-of-way-approvals'],
  },
  {
    slug: 'naira-market-shows-signs-of-stability-at-parallel-market',
    title: 'Naira Market Shows Signs of Stability at Parallel Market as Trading Volume Cools',
    excerpt:
      'Currency dealers say the market has become less volatile this week, even as demand remains uneven across importers and retail buyers.',
    category: 'Business',
    categorySlug: 'business',
    author: 'Tosin Adeyemi',
    authorRole: 'Markets Correspondent',
    publishedAt: '2026-05-17T09:05:00+01:00',
    readTime: '3 min read',
    image: 'https://img.freepik.com/free-photo/stock-market-exchange-economics-investment-graph_53876-120046.jpg',
    imageAlt: 'Stock market chart on a screen',
    tags: ['FX', 'Markets', 'Economy'],
    content: [
      'The naira posted a steadier tone in the parallel market on Thursday as dealers reported more balanced buy and sell orders.',
      'Analysts say the improvement appears tied to lighter speculative pressure and a gradual slowdown in import-driven demand ahead of month-end obligations.',
      'Market participants are, however, still watching policy signals from the central bank and import channels closely.',
    ],
    related: ['fg-announces-new-digital-economy-initiative', 'telecom-operators-push-for-faster-right-of-way-approvals', 'cbn-maintains-watchful-tone-as-inflation-eases-slightly'],
  },
  {
    slug: 'lagos-state-to-expand-primary-health-centre-renovation-plan',
    title: 'Lagos State to Expand Primary Health Centre Renovation Plan Across More Local Councils',
    excerpt:
      'Health officials say the upgrades will target maternal care, drug storage and basic diagnostics in under-served communities.',
    category: 'Health',
    categorySlug: 'health',
    author: 'Kemi Ajayi',
    authorRole: 'Health Correspondent',
    publishedAt: '2026-05-17T06:55:00+01:00',
    readTime: '4 min read',
    image: 'https://img.freepik.com/free-photo/closeup-support-hands_53876-14963.jpg',
    imageAlt: 'Close-up of support hands in a healthcare context',
    tags: ['Primary care', 'Hospitals', 'Wellness'],
    content: [
      'The Lagos State Government says it will widen the primary health centre upgrade programme to cover additional councils in a bid to reduce pressure on general hospitals.',
      'According to officials, the next phase will focus on power supply, equipment replacement and basic maternal services that many families still struggle to access near home.',
      'Public health advocates say the move could make a measurable difference if staffing and referral systems are improved at the same time.',
    ],
    related: ['education-ministry-rolls-out-new-teacher-training-window', 'federal-health-workers-outline-patient-safety-demands', 'mental-health-practitioners-call-for-better-community-screening'],
  },
  {
    slug: 'education-ministry-rolls-out-new-teacher-training-window',
    title: 'Education Ministry Rolls Out New Teacher Training Window Ahead of Third-Term Resumption',
    excerpt:
      'The initiative will focus on classroom management, digital learning and early-grade literacy support for public schools.',
    category: 'Education',
    categorySlug: 'education',
    author: 'Grace Ibeh',
    authorRole: 'Education Reporter',
    publishedAt: '2026-05-17T07:20:00+01:00',
    readTime: '4 min read',
    image: 'https://img.freepik.com/free-photo/books-imagination-still-life_17805234.jpg',
    imageAlt: 'Books and learning materials arranged on a desk',
    tags: ['Teachers', 'Schools', 'Learning'],
    content: [
      'The ministry has opened a new training window for public school teachers as states prepare for the final term of the academic year.',
      'Officials said the curriculum will combine classroom management, assessment techniques and digital literacy modules that can be delivered in short batches.',
      'School administrators have welcomed the plan but say it will need steady monitoring to ensure the training reaches frontline teachers rather than remaining at headquarters.',
    ],
    related: ['university-administration-extends-registration-deadline-for-final-year-students', 'secondary-school-heads-push-for-lab-equipment-funding', 'parent-groups-call-for-better-textbook-distribution'],
  },
  {
    slug: 'lagos-creative-industry-week-shows-strong-crowd-response',
    title: 'Lagos Creative Industry Week Shows Strong Crowd Response at Film and Music Panels',
    excerpt:
      'Panels on distribution, streaming economics and copyright reform drew large audiences from the city’s creative sector.',
    category: 'Entertainment',
    categorySlug: 'entertainment',
    author: 'Ifeoma Nwosu',
    authorRole: 'Entertainment Correspondent',
    publishedAt: '2026-05-17T10:15:00+01:00',
    readTime: '3 min read',
    image: 'https://img.freepik.com/free-photo/medium-shot-friends-pool-looking-camera_23-2148226191.jpg',
    imageAlt: 'Group of people enjoying a social scene',
    tags: ['Film', 'Music', 'Culture'],
    content: [
      'Lagos Creative Industry Week drew strong attendance as filmmakers, musicians and rights experts debated the economics of distribution in an increasingly digital market.',
      'Sessions on copyright enforcement and streaming revenue proved especially popular with younger creators seeking more practical paths to monetisation.',
      'Organisers say the event will now expand its workshop line-up for independent producers ahead of next year’s edition.',
    ],
    related: ['streaming-platforms-reshape-film-marketing-across-africa', 'comedians-fill-outdoor-venue-for-weekend-show', 'fashion-brand-unveils-new-collaboration-with-rising-artists'],
  },
  {
    slug: 'telecom-operators-push-for-faster-right-of-way-approvals',
    title: 'Telecom Operators Push for Faster Right-of-Way Approvals to Speed Fibre Rollout',
    excerpt:
      'Industry leaders say the delays are slowing new broadband connections and affecting service quality in urban clusters.',
    category: 'Technology',
    categorySlug: 'technology',
    author: 'Yusuf Umar',
    authorRole: 'Technology Correspondent',
    publishedAt: '2026-05-17T08:40:00+01:00',
    readTime: '4 min read',
    image: 'https://img.freepik.com/free-photo/cloud-system-tablet-background-smart-technology-remixed-media_53876-124705.jpg',
    imageAlt: 'Digital technology interface on a tablet screen',
    tags: ['Telecoms', 'Broadband', 'Infrastructure'],
    content: [
      'Telecom operators are urging state governments to approve right-of-way requests faster as fibre deployment remains uneven across the country.',
      'Executives say quicker approvals would help reduce dropouts, improve broadband reliability and make new business districts easier to connect.',
      'The call comes as operators continue to invest in last-mile expansion and new enterprise services for digital-first businesses.',
    ],
    related: ['lagos-startup-raises-seed-funding-for-fintech-infrastructure', 'fg-announces-new-digital-economy-initiative', 'banks-tighten-controls-on-agent-banking-fraud'],
  },
  {
    slug: 'house-of-representatives-pushes-for-public-sector-data-reforms',
    title: 'House of Representatives Pushes for Public Sector Data Reforms and Shared Registries',
    excerpt:
      'Lawmakers say fragmented records are slowing service delivery and making audits harder to complete.',
    category: 'Politics',
    categorySlug: 'politics',
    author: 'Sani Ibrahim',
    authorRole: 'Political Reporter',
    publishedAt: '2026-05-17T09:30:00+01:00',
    readTime: '3 min read',
    image: 'https://img.freepik.com/free-photo/group-business-people-discussing-documents_23-2149356529.jpg',
    imageAlt: 'Officials reviewing documents during a policy discussion',
    tags: ['Governance', 'Reforms', 'Legislature'],
    content: [
      'The House is weighing proposals that would force agencies to adopt shared registries for identity, business licensing and payments in order to reduce duplication.',
      'Supporters say public sector fragmentation increases costs for citizens and makes it difficult to compare records across ministries.',
      'The committee will hear submissions from agencies and civil society groups before a draft is finalised.',
    ],
    related: ['fg-announces-new-digital-economy-initiative', 'federal-cabinet-discusses-public-service-performance-targets', 'governors-call-for-more-transparent-budget-tracking'],
  },
  {
    slug: 'federal-health-workers-outline-patient-safety-demands',
    title: 'Federal Health Workers Outline Patient Safety Demands Ahead of National Talks',
    excerpt:
      'The unions want improved staffing, better shift planning and stronger equipment maintenance in referral hospitals.',
    category: 'Health',
    categorySlug: 'health',
    author: 'Miriam Eze',
    authorRole: 'Health Desk',
    publishedAt: '2026-05-17T10:00:00+01:00',
    readTime: '4 min read',
    image: 'https://img.freepik.com/free-photo/doctor-examining-woman-with-colposcope-modern-clinic_651396-3407.jpg',
    imageAlt: 'Medical professional conducting a clinical examination',
    tags: ['Hospitals', 'Staffing', 'Patient care'],
    content: [
      'Health workers say they want patient safety placed higher on the agenda at the next round of national talks with federal authorities.',
      'The unions argue that staffing gaps and aging equipment are still causing avoidable strain in major teaching hospitals.',
      'They want a clearer maintenance schedule, quicker procurement and more predictable shift rosters across facilities.',
    ],
    related: ['lagos-state-to-expand-primary-health-centre-renovation-plan', 'mental-health-practitioners-call-for-better-community-screening', 'pharmacy-owners-seek-crackdown-on-counterfeit-drugs'],
  },
  {
    slug: 'university-administration-extends-registration-deadline-for-final-year-students',
    title: 'University Administration Extends Registration Deadline for Final-Year Students',
    excerpt:
      'The extension follows a late release of results and repeated appeals from student leaders over administrative delays.',
    category: 'Education',
    categorySlug: 'education',
    author: 'Olumide Kareem',
    authorRole: 'Campus Reporter',
    publishedAt: '2026-05-17T10:40:00+01:00',
    readTime: '3 min read',
    image: 'https://img.freepik.com/free-photo/students-studying-with-laptops-campus_23-2149766729.jpg',
    imageAlt: 'Students studying with laptops in a campus environment',
    tags: ['University', 'Students', 'Registration'],
    content: [
      'The university says final-year students will now have additional days to complete registration after delays in the release of outstanding results.',
      'Student representatives had argued that the earlier deadline would have disadvantaged those still clearing departmental requirements.',
      'The administration said the new window is intended to reduce bottlenecks while keeping the academic calendar intact.',
    ],
    related: ['education-ministry-rolls-out-new-teacher-training-window', 'secondary-school-heads-push-for-lab-equipment-funding', 'parent-groups-call-for-better-textbook-distribution'],
  },
  {
    slug: 'streaming-platforms-reshape-film-marketing-across-africa',
    title: 'Streaming Platforms Reshape Film Marketing Across Africa as Producers Target Diaspora Audiences',
    excerpt:
      'Producers say release strategies are changing as digital premieres and social campaigns replace old-school publicity rolls.',
    category: 'Entertainment',
    categorySlug: 'entertainment',
    author: 'Tunde Rasheed',
    authorRole: 'Culture Editor',
    publishedAt: '2026-05-17T11:20:00+01:00',
    readTime: '4 min read',
    image: 'https://img.freepik.com/free-photo/people-celebrating-party-night_23-2149300995.jpg',
    imageAlt: 'Audience at a lively entertainment event',
    tags: ['Film', 'Streaming', 'Africa'],
    content: [
      'Africa’s film marketers are adjusting to a world where trailers, influencer clips and diaspora screenings can matter as much as a cinema launch.',
      'Several producers say the new strategy improves discovery but also demands stronger post-production quality and faster digital turnaround.',
      'Industry watchers expect more mid-budget films to be tailored for streaming platforms and premium online festivals.',
    ],
    related: ['lagos-creative-industry-week-shows-strong-crowd-response', 'comedians-fill-outdoor-venue-for-weekend-show', 'fashion-brand-unveils-new-collaboration-with-rising-artists'],
  },
  {
    slug: 'daily-paper-roundup-lagos-port-congestion-eases-slightly',
    title: 'Daily Paper Roundup: Lagos Port Congestion Eases Slightly After Weekend Clearance Push',
    excerpt:
      'Freight operators say improved coordination at key terminals has reduced queue lengths, though delays remain visible.',
    category: 'World',
    categorySlug: 'world',
    author: 'Editorial Desk',
    authorRole: 'News Desk',
    publishedAt: '2026-05-17T11:45:00+01:00',
    readTime: '2 min read',
    image: 'https://img.freepik.com/free-photo/medium-shot-man-reading-newspaper-home_23-2149396155.jpg',
    imageAlt: 'Man reading a newspaper',
    tags: ['Transport', 'Logistics', 'Trade'],
    content: [
      'Freight operators say targeted clearance efforts have reduced the worst queue lengths at Lagos terminals, though dispatch delays are still affecting some imports.',
      'Terminal managers say the coordination push will continue through the week as cargo backlogs are gradually broken down.',
    ],
    related: ['naira-market-shows-signs-of-stability-at-parallel-market', 'house-of-representatives-pushes-for-public-sector-data-reforms', 'fg-announces-new-digital-economy-initiative'],
  },
]

export const getArticleBySlug = (slug: string) => articles.find((article) => article.slug === slug)

export const getArticlesByCategory = (slug: string) =>
  articles.filter((article) => article.categorySlug === slug)

export const getFeaturedArticles = () => articles.filter((article) => article.featured)

export const getRelatedArticles = (article: NewsArticle) =>
  article.related
    .map((slug) => getArticleBySlug(slug))
    .filter((item): item is NewsArticle => Boolean(item))

export const categoryHighlights = [
  {
    slug: 'politics',
    kicker: 'Politics',
    title: 'National policy shifts and the pressure points shaping public life.',
  },
  {
    slug: 'business',
    kicker: 'Business',
    title: 'Markets, enterprise and the companies moving capital across the region.',
  },
  {
    slug: 'sports',
    kicker: 'Sports',
    title: 'Football, athletics and the fixtures the whole country is watching.',
  },
  {
    slug: 'technology',
    kicker: 'Technology',
    title: 'Broadband, fintech, and the digital systems changing how Nigerians work.',
  },
]
