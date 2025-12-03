import { redirect } from 'next/navigation'
import { createClient, getUserProfile } from '@/lib/supabase/server'
import CustomerDashboardContent from './CustomerDashboardClient'

export default async function DashboardPage() {
  const supabase = createClient()

  // Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    console.log('Dashboard: No user or error:', error)
    redirect('/auth/login')
  }

  console.log('Dashboard: User ID:', user.id)

  // Get user profile to check role
  const profile = await getUserProfile(user.id)

  console.log('Dashboard: User profile:', profile)
  console.log('Dashboard: User role:', profile?.role)

  // Redirect admin users to admin dashboard
  if (profile?.role === 'admin') {
    console.log('Dashboard: Redirecting admin to /admin')
    redirect('/admin')
  }

  console.log('Dashboard: Rendering customer dashboard')
  // Render customer dashboard for customer users
  // Note: Layout is automatically applied by Next.js from layout.tsx
  return <CustomerDashboardContent />
}