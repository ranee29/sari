import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'PHP') {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100) // Convert from cents to pesos
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  return new Date(date).toLocaleDateString('en-PH', {
    ...defaultOptions,
    ...options,
  })
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  return formatDate(date)
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getStockStatus(stock: number) {
  if (stock === 0) return { status: 'out', color: 'stock-out', text: 'Out of Stock' }
  if (stock <= 5) return { status: 'low', color: 'stock-low', text: `Only ${stock} left` }
  if (stock <= 20) return { status: 'medium', color: 'stock-medium', text: 'In Stock' }
  return { status: 'high', color: 'stock-high', text: 'In Stock' }
}

export function getOrderStatusColor(status: string) {
  const statusMap: Record<string, string> = {
    pending: 'status-pending',
    paid: 'status-paid',
    ready_for_pickup: 'status-ready_for_pickup',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
  }
  return statusMap[status] || 'status-pending'
}

export function getOrderStatusText(status: string) {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    paid: 'Paid',
    ready_for_pickup: 'Ready for Pickup',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return statusMap[status] || status
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string) {
  const phoneRegex = /^09\d{9}$/
  return phoneRegex.test(phone.replace(/[\s-]/g, ''))
}

export function calculateOrderTotal(items: { unit_price: number; qty: number }[]) {
  return items.reduce((total, item) => total + item.unit_price * item.qty, 0)
}

export function calculateTax(amount: number, taxRate = 0.12) {
  return amount * taxRate
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 6)
  return `ORD-${timestamp}-${randomStr}`.toUpperCase()
}