import { redirect } from 'next/navigation'
import { createClient, getUserProfile } from '@/lib/supabase/server'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminPage() {
  const supabase = createClient()

  // Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    console.log('Admin: No user or error:', error)
    redirect('/auth/login')
  }

  console.log('Admin: User ID:', user.id)

  // Get user profile to check role
  const profile = await getUserProfile(user.id)

  console.log('Admin: User profile:', profile)
  console.log('Admin: User role:', profile?.role)

  // Only allow admin users to access admin dashboard
  if (profile?.role !== 'admin') {
    console.log('Admin: Not admin, redirecting to /dashboard')
    redirect('/dashboard') // Redirect customers to their dashboard
  }

  console.log('Admin: Rendering admin dashboard')
  // Render admin dashboard
  return <AdminDashboardClient />
}