import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sari Grocery Reservation',
  description: 'Order groceries online for easy pickup at your local store',
  keywords: ['grocery', 'reservation', 'pickup', 'local store'],
  authors: [{ name: 'Sari Grocery' }],
  openGraph: {
    title: 'Sari Grocery Reservation',
    description: 'Order groceries online for easy pickup at your local store',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sari Grocery Reservation',
    description: 'Order groceries online for easy pickup at your local store',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#23CE6B',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={inter.className + ' h-full bg-bg-300'}>
        <div className="min-h-full flex flex-col">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}