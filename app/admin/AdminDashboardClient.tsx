'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, Package, Receipt, Calendar, Archive, Users, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth/config'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export default function AdminDashboardClient() {
  const [loading, setLoading] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut()
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your admin account.',
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

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    )
  }

  const mainNavigation = [
    {
      name: 'Dashboard Overview',
      href: '/admin',
      icon: Home,
      isActive: true
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      subItems: [
        { name: 'All Products', href: '/admin/products' },
        { name: 'Add Product', href: '/admin/products/add' }
      ]
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: Receipt,
      subItems: [
        { name: 'Active Orders', href: '/admin/orders/active' },
        { name: 'Completed Orders', href: '/admin/orders/completed' }
      ]
    },
    {
      name: 'Pre-Orders',
      href: '/admin/pre-orders',
      icon: Calendar,
      subItems: [
        { name: 'Active Pre-Orders', href: '/admin/pre-orders/active' },
        { name: 'Completed Pre-Orders', href: '/admin/pre-orders/completed' }
      ]
    },
    {
      name: 'Inventory',
      href: '/admin/inventory',
      icon: Archive,
      subItems: [
        { name: 'Adjust Stock', href: '/admin/inventory/adjust' },
        { name: 'Low Stock Alerts', href: '/admin/inventory/alerts' }
      ]
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      subItems: [
        { name: 'Customer List', href: '/admin/users/customers' }
      ]
    },
    {
      name: 'Reports (optional future)',
      href: '/admin/reports',
      icon: Receipt,
      disabled: true
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings
    }
  ]

  return (
    <div className="flex h-screen bg-background-light">
      {/* Fixed Sidebar - Desktop */}
      <aside className="fixed flex h-full w-[240px] flex-col bg-sidebar-dark text-white">
        <div className="flex h-20 items-center justify-start px-8">
          <h1 className="text-lg font-semibold tracking-wide text-gray-300">Sari Admin</h1>
        </div>
        <nav className="flex-grow p-4 pt-0">
          <ul className="space-y-2">
            {mainNavigation.map((item) => {
              const Icon = item.icon
              const isExpanded = expandedItems.includes(item.name)
              const hasSubItems = item.subItems && item.subItems.length > 0

              return (
                <li key={item.name}>
                  {item.disabled ? (
                    <div
                      className="group flex items-center rounded-lg px-4 py-3 font-medium w-full transition-colors text-gray-500 cursor-not-allowed opacity-60"
                      title="Feature coming soon"
                    >
                      <Icon className="mr-4" />
                      {item.name}
                    </div>
                  ) : hasSubItems ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={`group flex items-center rounded-lg px-4 py-3 font-medium w-full transition-colors ${
                          item.isActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-300 hover:bg-secondary/20 hover:text-white'
                        }`}
                      >
                        <Icon className="mr-4" />
                        {item.name}
                      </button>
                      {isExpanded && (
                        <ul className="ml-8 mt-1 space-y-1">
                          {item.subItems?.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-secondary/20 hover:text-white rounded-lg"
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
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
                  )}
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-green-600">A</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard Overview</h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">Here's what's happening across your store today.</p>
            </div>

            {/* Stats Cards */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">247</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                    <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Products</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/50">
                    <Receipt className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                    <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock Items</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/admin/products">
                  <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <Package className="w-8 h-8 text-purple-500 mb-2" />
                    <p className="font-medium text-purple-600 dark:text-purple-400">Manage Products</p>
                  </div>
                </Link>
                <Link href="/admin/orders">
                  <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <Receipt className="w-8 h-8 text-yellow-500 mb-2" />
                    <p className="font-medium text-yellow-600 dark:text-yellow-400">Manage Orders</p>
                  </div>
                </Link>
                <Link href="/admin/inventory">
                  <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <Archive className="w-8 h-8 text-blue-500 mb-2" />
                    <p className="font-medium text-blue-600 dark:text-blue-400">Adjust Stock</p>
                  </div>
                </Link>
                <Link href="/admin/users">
                  <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <Users className="w-8 h-8 text-green-500 mb-2" />
                    <p className="font-medium text-green-600 dark:text-green-400">View Users</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="mt-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                <Link href="/admin/orders" className="text-sm font-medium text-green-600 hover:underline dark:text-green-400">
                  View all
                </Link>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        #ORD-001
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        John Doe
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        ₱1,250.00
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                          Pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        #ORD-002
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        Jane Smith
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        ₱850.00
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}