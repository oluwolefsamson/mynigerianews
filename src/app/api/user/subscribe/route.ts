import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { plan } = body

    if (plan !== 'premium') {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    // Set subscription ends in 30 days
    const subscriptionEndsAt = new Date()
    subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + 30)

    const admin = createAdminClient()
    const { error: updateError } = await admin
      .from('user_profiles')
      .update({
        subscription_status: 'premium',
        subscription_ends_at: subscriptionEndsAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Subscription update failed:', updateError.message)
      return NextResponse.json({ error: 'Failed to update subscription profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true, plan: 'premium', endsAt: subscriptionEndsAt.toISOString() })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
