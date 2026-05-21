import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.freepik.com' },
      { protocol: 'https', hostname: 'www.freepik.com' },
      { protocol: 'https', hostname: 'ichef.bbci.co.uk' },
      { protocol: 'https', hostname: 'news.bbcimg.co.uk' },
      { protocol: 'https', hostname: 'punchng.com' },
      { protocol: 'https', hostname: 'guardian.ng' },
      { protocol: 'https', hostname: 'www.vanguardngr.com' },
      { protocol: 'https', hostname: 'www.premiumtimesng.com' },
      { protocol: 'https', hostname: 'thenationonline.net' },
      { protocol: 'https', hostname: 'jvrismwfezozfsjhgpoe.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default nextConfig
