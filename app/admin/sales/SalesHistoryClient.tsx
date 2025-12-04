'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, Download, RefreshCw, DollarSign, CreditCard, Smartphone, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

interface SalesRecord {
  id: string
  product_id: string
  product_name: string
  qty: number
  unit_price: number
  subtotal: number
  payment_method: string
  sale_date: string
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
  type: string
}

export default function SalesHistoryClient() {
  const [sales, setSales] = useState<SalesRecord[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('today')
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch sales and products
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch sales from API
        const salesResponse = await fetch('/api/sales')
        if (!salesResponse.ok) throw new Error('Failed to fetch sales')

        const salesData = await salesResponse.json()
        setSales(salesData.sales || [])

        // Fetch products for product names
        const productsResponse = await fetch('/api/admin/products/list')
        if (!productsResponse.ok) throw new Error('Failed to fetch products')

        const productsData = await productsResponse.json()
        setProducts(productsData.products || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: 'Error',
          description: 'Failed to load sales data',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Get product name by ID
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product?.name || 'Unknown Product'
  }

  // Filter sales
  const filteredSales = sales.filter(sale => {
    const productName = getProductName(sale.product_id)
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPayment = paymentFilter === 'all' || sale.payment_method === paymentFilter

    const saleDate = new Date(sale.sale_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let matchesDate = true
    if (dateFilter === 'today') {
      matchesDate = saleDate >= today
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      matchesDate = saleDate >= weekAgo
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(today)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      matchesDate = saleDate >= monthAgo
    }

    return matchesSearch && matchesPayment && matchesDate
  })

  // Calculate totals
  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.subtotal, 0)
  const totalItems = filteredSales.reduce((sum, sale) => sum + sale.qty, 0)
  const totalTransactions = filteredSales.length
  const averageSale = totalTransactions > 0 ? totalSales / totalTransactions : 0

  // Payment method stats
  const paymentStats = filteredSales.reduce((stats, sale) => {
    stats[sale.payment_method] = (stats[sale.payment_method] || 0) + sale.subtotal
    return stats
  }, {} as Record<string, number>)

  // Export to CSV
  const exportToCSV = () => {
    const csv = [
      ['Date', 'Product', 'Quantity', 'Unit Price', 'Subtotal', 'Payment Method'],
      ...filteredSales.map(sale => [
        new Date(sale.sale_date).toLocaleDateString(),
        getProductName(sale.product_id),
        sale.qty.toString(),
        sale.unit_price.toFixed(2),
        sale.subtotal.toFixed(2),
        sale.payment_method
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Payment method icons
  const paymentIcons = {
    cash: DollarSign,
    card: CreditCard,
    mobile: Smartphone,
    other: Receipt
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
            <span className="ml-2 text-gray-600">Loading sales data...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales History</h1>
            <p className="text-gray-600 mt-1">View and manage your sales records</p>
          </div>
          <Button onClick={exportToCSV} className="mt-4 sm:mt-0">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-xl font-bold text-gray-900">₱{totalSales.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Items Sold</p>
                <p className="text-xl font-bold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Sale</p>
                <p className="text-xl font-bold text-gray-900">
                  ₱{averageSale.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Methods</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mobile">Mobile</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map((sale) => {
                  const Icon = paymentIcons[sale.payment_method as keyof typeof paymentIcons]
                  return (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(sale.sale_date).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {getProductName(sale.product_id)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{sale.qty}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₱{sale.unit_price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">₱{sale.subtotal.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {Icon && <Icon className="w-4 h-4 text-gray-600" />}
                          <span className="text-sm text-gray-900 capitalize">{sale.payment_method}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredSales.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No sales found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}