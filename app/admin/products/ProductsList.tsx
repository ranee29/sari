'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Filter, MoreHorizontal, Package, Edit, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AddProductModal from './AddProductModal'

interface Product {
  id: string
  name: string
  type: string
  description: string | null
  price: number
  cost: number
  stock: number
  status: string
  created_at: string
  updated_at?: string
}

interface ProductsListProps {
  initialProducts: Product[]
}

export default function ProductsList({ initialProducts }: ProductsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>(initialProducts)

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueTypes = Array.from(new Set(products.map(p => p.type)))
    return uniqueTypes
  }, [products])

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || product.type === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, filterCategory])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
      case 'Out of Stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400'
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Products Management</h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your product inventory</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
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
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Sort
            </Button>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Cost</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Created</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{product.type}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">₱{product.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">₱{product.cost.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${
                      product.stock === 0 ? 'text-red-600 dark:text-red-400' :
                      product.stock <= 10 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{product.created_at}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="p-1">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No products found</p>
            <Button onClick={() => setIsModalOpen(true)} className="mt-4">
              Add your first product
            </Button>
          </div>
        )}

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={async (newProduct) => {
            setIsModalOpen(false)

            // Refresh products from server
            try {
              const response = await fetch('/api/admin/products/refresh', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              })

              if (response.ok) {
                const { products: refreshedProducts } = await response.json()
                setProducts(refreshedProducts)
              }
            } catch (error) {
              console.error('Error refreshing products:', error)
              // Fallback: refresh the page
              window.location.reload()
            }
          }}
        />
      </div>
    </div>
  )
}