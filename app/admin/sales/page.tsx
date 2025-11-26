'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, BarChart3, Clock, DollarSign, TrendingUp, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function SalesPage() {
  const [todayStats, setTodayStats] = useState({
    totalSales: 0,
    totalItems: 0,
    totalTransactions: 0,
    topProducts: [] as Array<{name: string, quantity: number}>
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch today's sales statistics
  useEffect(() => {
    const fetchTodayStats = async () => {
      try {
        const response = await fetch('/api/sales/today-stats')
        if (!response.ok) throw new Error('Failed to fetch stats')

        const data = await response.json()
        setTodayStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Don't show error toast on page load, just log it
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodayStats()
  }, [])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
            <p className="mt-2 text-gray-600">Manage walk-in sales and view analytics</p>
          </div>
          <Link href="/admin/sales/new">
            <Button className="mt-4 sm:mt-0 btn-primary">
              <ShoppingCart className="w-4 h-4 mr-2" />
              New Sale
            </Button>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/sales/new" className="group">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">New Sale</h3>
              </div>
              <p className="text-gray-600">Process a new walk-in sale quickly and easily</p>
            </div>
          </Link>

          <Link href="/admin/sales/history" className="group">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Sales History</h3>
              </div>
              <p className="text-gray-600">View detailed sales records and analytics</p>
            </div>
          </Link>

          <Link href="/admin/products" className="group">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Products</h3>
              </div>
              <p className="text-gray-600">Add, edit, and manage product inventory</p>
            </div>
          </Link>
        </div>

        {/* Today's Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Today's Overview</h2>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading today's stats...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">₱{todayStats.totalSales.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Sales</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{todayStats.totalItems}</p>
                <p className="text-sm text-gray-600">Items Sold</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{todayStats.totalTransactions}</p>
                <p className="text-sm text-gray-600">Transactions</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ₱{todayStats.totalTransactions > 0 ? (todayStats.totalSales / todayStats.totalTransactions).toFixed(2) : '0.00'}
                </p>
                <p className="text-sm text-gray-600">Average Sale</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Start Guide */}
        <div className="mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Guide</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
              <div>
                <h4 className="font-medium text-gray-900">Add Products</h4>
                <p className="text-sm text-gray-600">Stock your inventory with products and prices</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
              <div>
                <h4 className="font-medium text-gray-900">Process Sales</h4>
                <p className="text-sm text-gray-600">Quickly add items to cart and complete transactions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
              <div>
                <h4 className="font-medium text-gray-900">Track Analytics</h4>
                <p className="text-sm text-gray-600">Monitor sales performance and inventory levels</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
              <div>
                <h4 className="font-medium text-gray-900">Export Reports</h4>
                <p className="text-sm text-gray-600">Download sales data for accounting and analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}