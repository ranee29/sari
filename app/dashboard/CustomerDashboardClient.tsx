'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, Package, ShoppingCart, Receipt, User, Settings, HelpCircle, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth/config'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export default function CustomerDashboardClient() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut()
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account.',
      })
      router.push('/')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home, isActive: true },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'My Cart / Reservation', href: '/dashboard/cart', icon: ShoppingCart },
    { name: 'My Orders', href: '/dashboard/orders', icon: Receipt },
    { name: 'Account Settings', href: '/dashboard/settings', icon: User },
    { name: 'Help / Support', href: '/dashboard/help', icon: HelpCircle },
  ]

  return (
    <div className="flex h-screen bg-background-light">
      {/* Fixed Sidebar - Desktop */}
      <aside className="fixed flex h-full w-[240px] flex-col bg-sidebar-dark text-white">
        <div className="flex h-20 items-center justify-start px-8">
          <h1 className="text-lg font-semibold tracking-wide text-gray-300">Sari</h1>
        </div>
        <nav className="flex-grow p-4 pt-0">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center rounded-lg px-4 py-3 font-medium transition-colors ${
                      item.isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-gray-300 hover:bg-secondary/20 hover:text-white'
                    }`}
                  >
                    <Icon className="mr-4" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="p-4 pt-0">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="group flex w-full items-center rounded-lg px-4 py-3 font-medium text-gray-300 hover:bg-secondary/20 hover:text-white disabled:opacity-50"
          >
            <LogOut className="mr-4" />
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[240px] flex-1 bg-background-light dark:bg-background-dark">
        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8 dark:border-gray-700 dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-600">C</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">Customer</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome back!</h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">Here's what's happening with your orders and reservations.</p>
            </div>

            {/* Stats Cards */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                    <Receipt className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/50">
                    <ShoppingCart className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/50">
                    <Receipt className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                    <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">Jan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Link href="/products">
                  <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <Package className="w-8 h-8 text-green-500 mb-2" />
                    <p className="font-medium text-green-600 dark:text-green-400">Browse Products</p>
                  </div>
                </Link>
                <Link href="/dashboard/orders">
                  <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <Receipt className="w-8 h-8 text-yellow-500 mb-2" />
                    <p className="font-medium text-yellow-600 dark:text-yellow-400">View Orders</p>
                  </div>
                </Link>
                <Link href="/dashboard/settings">
                  <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <User className="w-8 h-8 text-purple-500 mb-2" />
                    <p className="font-medium text-purple-600 dark:text-purple-400">Update Profile</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="mt-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                <Link href="/dashboard/orders" className="text-sm font-medium text-green-600 hover:underline dark:text-green-400">
                  View all
                </Link>
              </div>
              <div className="mt-4 flex items-center justify-center rounded-xl bg-white p-16 text-center dark:bg-gray-800">
                <p className="text-gray-500 dark:text-gray-400">No recent orders. Start shopping to see your order history here.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}