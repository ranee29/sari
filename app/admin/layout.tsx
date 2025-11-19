import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/auth/config'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  // Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/auth/login')
  }

  // Get user profile to check role
  const profile = await getUserProfile(user.id)

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard') // Redirect non-admin users to customer dashboard
  }

  return <>{children}</>
}