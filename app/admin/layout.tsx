import { redirect } from 'next/navigation'
import { createClient, getUserProfile } from '@/lib/supabase/server'
import AdminSidebar from './AdminSidebar'

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

  return (
    <div className="flex h-screen bg-background-light">
      <AdminSidebar />
      <main className="ml-[240px] flex-1 bg-background-light dark:bg-background-dark overflow-auto">
        {children}
      </main>
    </div>
  )
}