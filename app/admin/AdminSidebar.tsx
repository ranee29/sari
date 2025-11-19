'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, Receipt, Calendar, Archive, Users, Settings, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth/config'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export default function AdminSidebar() {
  const [loading, setLoading] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const router = useRouter()
  const pathname = usePathname()
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
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
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
        { name: 'Stock Management', href: '/admin/inventory' },
        { name: 'Stock Adjustment Log', href: '/admin/inventory/log' }
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

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
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
                        isActive(item.href)
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
                              className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                                pathname === subItem.href
                                  ? 'bg-primary text-white'
                                  : 'text-gray-300 hover:bg-secondary/20 hover:text-white'
                              }`}
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
                      isActive(item.href)
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
  )
}