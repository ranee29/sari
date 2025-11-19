'use client'

import { useState } from 'react'
import { Search, Filter, ShoppingCart, Package, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency, getStockStatus } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  product_types: {
    name: string
  } | null
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Mock data - replace with actual API call
  const products: Product[] = [
    {
      id: '1',
      name: 'Fresh Tomatoes',
      description: 'Locally grown organic tomatoes',
      price: 8500, // 85.00 in cents
      stock: 50,
      product_types: { name: 'Vegetables' },
    },
    {
      id: '2',
      name: 'Premium Rice',
      description: 'High-quality imported rice',
      price: 12000, // 120.00 in cents
      stock: 30,
      product_types: { name: 'Grains' },
    },
    {
      id: '3',
      name: 'Fresh Milk',
      description: 'Farm-fresh whole milk',
      price: 6500, // 65.00 in cents
      stock: 0,
      product_types: { name: 'Dairy' },
    },
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.product_types?.name === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat']

  const handleAddToCart = (product: Product) => {
    const stockStatus = getStockStatus(product.stock)
    if (stockStatus.status === 'out') {
      toast({
        title: 'Out of Stock',
        description: `${product.name} is currently out of stock.`,
        variant: 'destructive',
      })
      return
    }

    // Add to cart logic here
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
      variant: 'success',
    })
  }

  return (
    <div className="min-h-screen bg-bg-300">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-bg-200">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <h1 className="heading-3">Products</h1>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-bg-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Category filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-bg-100 text-text-secondary hover:bg-bg-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No products found
            </h3>
            <p className="text-text-secondary">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-product gap-4">
            {filteredProducts.map(product => {
              const stockStatus = getStockStatus(product.stock)
              return (
                <div key={product.id} className="card card-hover">
                  <div className="p-4">
                    {/* Product Image Placeholder */}
                    <div className="w-full h-40 bg-bg-100 rounded-lg mb-4 flex items-center justify-center">
                      <Package className="w-12 h-12 text-text-muted" />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2 mb-4">
                      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                        {product.product_types?.name}
                      </span>
                      <h3 className="font-semibold text-text-primary line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-caption text-text-secondary line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-bold text-text-primary">
                          {formatCurrency(product.price)}
                        </p>
                        <p className={`text-sm ${stockStatus.color}`}>
                          {stockStatus.text}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-warning-400 fill-current" />
                        <span className="text-sm text-text-secondary ml-1">4.5</span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full"
                      disabled={stockStatus.status === 'out'}
                      variant={stockStatus.status === 'out' ? 'secondary' : 'primary'}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {stockStatus.status === 'out' ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}