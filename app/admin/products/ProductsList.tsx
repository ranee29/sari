'use client'

import { useState, useMemo, useEffect } from 'react'
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

interface ProductType {
  id: string
  name: string
}

export default function ProductsList({ initialProducts }: ProductsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [productTypes, setProductTypes] = useState<ProductType[]>([])
  const [isLoadingTypes, setIsLoadingTypes] = useState(true)

  // Fetch product types from API
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await fetch('/api/admin/product-types')
        if (response.ok) {
          const data = await response.json()
          setProductTypes(data.productTypes || [])
        } else {
          console.error('Failed to fetch product types')
        }
      } catch (error) {
        console.error('Error fetching product types:', error)
      } finally {
        setIsLoadingTypes(false)
      }
    }

    fetchProductTypes()
  }, [])

  // Get unique categories from product types
  const categories = useMemo(() => {
    return productTypes.map(type => type.name)
  }, [productTypes])

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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Products Management</h2>
            <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your product inventory</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
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
              disabled={isLoadingTypes}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 text-sm disabled:opacity-50"
            >
              <option value="all">All Categories</option>
              {isLoadingTypes ? (
                <option value="">Loading categories...</option>
              ) : (
                categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))
              )}
            </select>
            <Button variant="outline" className="flex items-center gap-2 px-3 py-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Sort</span>
            </Button>
          </div>
        </div>

        {/* Mobile Product Cards */}
        <div className="block sm:hidden space-y-4 mb-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">{product.name}</h3>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)} ml-2 flex-shrink-0`}>
                  {product.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{product.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Stock</p>
                  <p className={`text-sm font-medium ${
                    product.stock === 0 ? 'text-red-600 dark:text-red-400' :
                    product.stock <= 10 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>
                    {product.stock}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">₱{product.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cost</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">₱{product.cost.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">{product.created_at}</p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Products Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Cost</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Created</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Actions</th>
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
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">{product.type}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white text-sm">₱{product.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white text-sm">₱{product.cost.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`font-medium text-sm ${
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
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">{product.created_at}</td>
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
          <div className="text-center py-8 sm:py-12">
            <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No products found</p>
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
              const [productsResponse, typesResponse] = await Promise.all([
                fetch('/api/admin/products/refresh', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }),
                fetch('/api/admin/product-types')
              ])

              if (productsResponse.ok) {
                const { products: refreshedProducts } = await productsResponse.json()
                setProducts(refreshedProducts)
              }

              if (typesResponse.ok) {
                const data = await typesResponse.json()
                setProductTypes(data.productTypes || [])
              }
            } catch (error) {
              console.error('Error refreshing data:', error)
              // Fallback: refresh the page
              window.location.reload()
            }
          }}
        />
      </div>
    </div>
  )
}