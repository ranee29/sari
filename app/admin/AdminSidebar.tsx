'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, Receipt, Calendar, Archive, Users, Settings, LogOut, Menu, X, ShoppingCart, TrendingUp } from 'lucide-react'
import { signOut } from '@/lib/auth/config'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export default function AdminSidebar() {
  const [loading, setLoading] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const sidebar = document.getElementById('admin-sidebar')
      const menuButton = document.getElementById('mobile-menu-button')

      if (isMobileMenuOpen &&
          sidebar &&
          !sidebar.contains(target) &&
          (!menuButton || !menuButton.contains(target))) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

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
      name: 'Sales',
      href: '/admin/sales',
      icon: ShoppingCart,
      subItems: [
        { name: 'New Sale', href: '/admin/sales/new' },
        { name: 'Sales History', href: '/admin/sales/history' }
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
      name: 'Reports',
      href: '/admin/reports',
      icon: TrendingUp,
      disabled: true
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      disabled: true
    }
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        id="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-3 bg-sidebar-dark text-white rounded-lg shadow-lg hover:bg-sidebar-dark/90 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`fixed flex h-full w-[280px] max-w-[85vw] flex-col bg-sidebar-dark text-white transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:fixed lg:w-[240px] lg:max-w-full`}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
          <h1 className="text-lg font-semibold tracking-wide text-gray-300">Sari Admin</h1>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex h-20 items-center justify-start px-8">
          <h1 className="text-lg font-semibold tracking-wide text-gray-300">Sari Admin</h1>
        </div>
        <nav className="flex-grow p-4 pt-0 overflow-y-auto">
          <ul className="space-y-2">
            {mainNavigation.filter(item => item.name !== 'Orders').map((item) => {
              const Icon = item.icon
              const isExpanded = expandedItems.includes(item.name)
              const hasSubItems = item.subItems && item.subItems.length > 0

              return (
                <li key={item.name}>
                  {item.disabled ? (
                    <div
                      className="group flex items-center rounded-lg px-3 py-3 font-medium w-full transition-colors text-gray-500 cursor-not-allowed opacity-60 lg:px-4"
                      title="Feature coming soon"
                    >
                      <Icon className="mr-3 lg:mr-4 w-5 h-5" />
                      <span className="truncate">{item.name}</span>
                    </div>
                  ) : hasSubItems ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={`group flex items-center rounded-lg px-3 py-3 font-medium w-full transition-colors lg:px-4 ${
                          isActive(item.href)
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-300 hover:bg-secondary/20 hover:text-white'
                        }`}
                      >
                        <Icon className="mr-3 lg:mr-4 w-5 h-5 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </button>
                      {isExpanded && (
                        <ul className="ml-6 lg:ml-8 mt-1 space-y-1">
                          {item.subItems?.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors lg:px-4 ${
                                  pathname === subItem.href
                                    ? 'bg-primary text-white'
                                    : 'text-gray-300 hover:bg-secondary/20 hover:text-white'
                                }`}
                              >
                                <span className="truncate">{subItem.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group flex items-center rounded-lg px-3 py-3 font-medium transition-colors lg:px-4 ${
                        isActive(item.href)
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'text-gray-300 hover:bg-secondary/20 hover:text-white'
                      }`}
                    >
                      <Icon className="mr-3 lg:mr-4 w-5 h-5 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="p-4 pt-0 border-t border-white/10">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="group flex w-full items-center rounded-lg px-3 py-3 font-medium text-gray-300 hover:bg-secondary/20 hover:text-white disabled:opacity-50 lg:px-4"
          >
            <LogOut className="mr-3 lg:mr-4 w-5 h-5 flex-shrink-0" />
            <span className="truncate">{loading ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>
    </>
  )
}