import { NextResponse } from 'next/server'
import { getBreakingNewsItems } from '@/services/article-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  const items = await getBreakingNewsItems()
  return NextResponse.json(items)
}
