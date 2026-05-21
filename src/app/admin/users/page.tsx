import { createClient } from '@/lib/supabase/server'
import { UserCheck, UserX, Mail } from 'lucide-react'

export default async function UsersPage() {
  const supabase = await createClient()

  // Get admin profiles (users who have logged into the admin)
  const { data: profiles } = await supabase
    .from('admin_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const roleColors: Record<string, string> = {
    super_admin: 'bg-purple-100 text-purple-700',
    editor: 'bg-blue-100 text-blue-700',
    viewer: 'bg-neutral-100 text-neutral-600',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Users</h1>
          <p className="mt-0.5 text-[0.88rem] text-neutral-500">Admin users with dashboard access</p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="px-5 py-3 text-left text-[0.78rem] font-semibold uppercase text-neutral-500">User</th>
              <th className="px-4 py-3 text-left text-[0.78rem] font-semibold uppercase text-neutral-500 hidden md:table-cell">Role</th>
              <th className="px-4 py-3 text-left text-[0.78rem] font-semibold uppercase text-neutral-500 hidden lg:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {profiles && profiles.length > 0 ? profiles.map((profile) => (
              <tr key={profile.id} className="hover:bg-neutral-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a8f07]/10 text-[0.82rem] font-bold text-[#0a8f07]">
                      {(profile.email ?? 'A').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{profile.full_name ?? '—'}</p>
                      <p className="text-[0.78rem] text-neutral-400">{profile.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className={`rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${roleColors[profile.role] ?? 'bg-neutral-100 text-neutral-600'}`}>
                    {profile.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell text-[0.8rem] text-neutral-400">
                  {new Date(profile.created_at).toLocaleDateString('en-NG')}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-neutral-400">
                    <UserX className="h-8 w-8" />
                    <p className="text-[0.88rem]">No admin users yet.</p>
                    <p className="text-[0.82rem]">Run the seed script to create the super admin account.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Instructions box */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <p className="text-[0.88rem] font-semibold text-blue-800">Admin Account</p>
            <p className="mt-1 text-[0.82rem] text-blue-600">
              Super admin: <strong>info@nigerianews.com</strong><br />
              To add more users, invite them via Supabase Dashboard → Authentication → Users.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
