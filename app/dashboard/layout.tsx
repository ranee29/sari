'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, ShoppingCart, Receipt, User, Settings, HelpCircle, LogOut, Menu, X } from 'lucide-react'
import { signOut } from '@/lib/auth/config'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home, isActive: pathname === '/dashboard' },
    { name: 'Products', href: '/products', icon: Package, isActive: pathname === '/products' },
    { name: 'My Cart / Reservation', href: '/dashboard/cart', icon: ShoppingCart, isActive: pathname.startsWith('/dashboard/cart') },
    { name: 'My Orders', href: '/dashboard/orders', icon: Receipt, isActive: pathname.startsWith('/dashboard/orders') },
    { name: 'Account Settings', href: '/dashboard/settings', icon: User, isActive: pathname.startsWith('/dashboard/settings') },
    { name: 'Help / Support', href: '/dashboard/help', icon: HelpCircle, isActive: pathname.startsWith('/dashboard/help') },
  ]

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const sidebar = document.getElementById('customer-sidebar')
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

  return (
    <div className="flex h-screen bg-background-light">
      {/* Mobile Menu Button */}
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

      {/* Customer Sidebar */}
      <aside
        id="customer-sidebar"
        className={`fixed flex h-full w-[280px] max-w-[85vw] flex-col bg-sidebar-dark text-white transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:fixed lg:w-[240px] lg:max-w-full`}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
          <h1 className="text-lg font-semibold tracking-wide text-gray-300">Sari</h1>
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
          <h1 className="text-lg font-semibold tracking-wide text-gray-300">Sari</h1>
        </div>

        <nav className="flex-grow p-4 pt-0 overflow-y-auto">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex items-center rounded-lg px-3 py-3 font-medium transition-colors lg:px-4 ${
                      item.isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-gray-300 hover:bg-secondary/20 hover:text-white'
                    }`}
                  >
                    <Icon className="mr-3 lg:mr-4 w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
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

      {/* Main Content Area */}
      <main className="ml-0 lg:ml-[240px] flex-1 bg-background-light dark:bg-background-dark">
        {children}
      </main>
    </div>
  )
}