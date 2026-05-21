/**
 * Seed Admin Account
 * Run: node scripts/seed-admin.mjs
 *
 * This creates the super admin user in Supabase Auth and adds their profile.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local manually
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local')
    const raw = readFileSync(envPath, 'utf-8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx < 0) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const value = trimmed.slice(eqIdx + 1).trim()
      if (!process.env[key]) process.env[key] = value
    }
  } catch (e) {
    console.error('Could not load .env.local:', e.message)
  }
}

loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  console.error('❌  NEXT_PUBLIC_SUPABASE_URL is missing in .env.local')
  process.exit(1)
}

if (!SERVICE_ROLE_KEY) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not set — will try with anon key (may fail)')
}

const supabase = createClient(
  SUPABASE_URL,
  SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const ADMIN_EMAIL = 'info@nigerianews.com'
const ADMIN_PASSWORD = 'Admin@nigerianews.com'

async function seedAdmin() {
  console.log('🌱 Seeding admin account…')
  console.log(`   Email:    ${ADMIN_EMAIL}`)
  console.log(`   Password: ${ADMIN_PASSWORD}`)
  console.log()

  // Check if user already exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    console.error('❌  Could not list users (service_role key required):', listError.message)
    console.log()
    console.log('👉  Manual steps:')
    console.log('    1. Go to your Supabase dashboard → Authentication → Users')
    console.log(`    2. Click "Invite user" or "Add user"`)
    console.log(`    3. Email: ${ADMIN_EMAIL}`)
    console.log(`    4. Password: ${ADMIN_PASSWORD}`)
    console.log('    5. Then run this SQL in the SQL Editor:')
    console.log()
    console.log(`INSERT INTO public.admin_profiles (id, email, role)`)
    console.log(`SELECT id, email, 'super_admin'`)
    console.log(`FROM auth.users WHERE email = '${ADMIN_EMAIL}'`)
    console.log(`ON CONFLICT (id) DO UPDATE SET role = 'super_admin';`)
    process.exit(0)
  }

  const existing = users?.find((u) => u.email === ADMIN_EMAIL)

  let userId

  if (existing) {
    console.log('ℹ️  User already exists, updating password…')
    const { error } = await supabase.auth.admin.updateUserById(existing.id, { password: ADMIN_PASSWORD })
    if (error) console.warn('   Could not update password:', error.message)
    userId = existing.id
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    })
    if (error) {
      console.error('❌  Failed to create user:', error.message)
      process.exit(1)
    }
    userId = data.user.id
    console.log('✅  Auth user created:', userId)
  }

  // Upsert admin profile
  const { error: profileError } = await supabase
    .from('admin_profiles')
    .upsert({ id: userId, email: ADMIN_EMAIL, role: 'super_admin', full_name: 'Super Admin' })

  if (profileError) {
    console.warn('⚠️  Could not upsert admin profile:', profileError.message)
    console.log('   Run this SQL manually:')
    console.log(`   INSERT INTO public.admin_profiles (id, email, role, full_name)`)
    console.log(`   VALUES ('${userId}', '${ADMIN_EMAIL}', 'super_admin', 'Super Admin')`)
    console.log(`   ON CONFLICT (id) DO UPDATE SET role = 'super_admin';`)
  } else {
    console.log('✅  Admin profile created/updated')
  }

  console.log()
  console.log('🎉 Done! Login at: http://localhost:3000/admin/login')
  console.log(`   Email:    ${ADMIN_EMAIL}`)
  console.log(`   Password: ${ADMIN_PASSWORD}`)
}

seedAdmin().catch((e) => {
  console.error('Unexpected error:', e)
  process.exit(1)
})
