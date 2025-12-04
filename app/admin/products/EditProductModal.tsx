'use client'

import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

interface ProductType {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  type: string  // This likely contains the product type ID as a string
  description: string | null
  price: number
  cost: number
  stock: number
  status: string
  created_at: string
  updated_at?: string
  product_types?: ProductType  // This might be populated in some API responses
}

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  productTypes: ProductType[]
  onSuccess: (updatedProduct: Product) => void
}

export default function EditProductModal({
  isOpen,
  onClose,
  product,
  productTypes,
  onSuccess
}: EditProductModalProps) {
  // Ensure productTypes is always an array
  const safeProductTypes = Array.isArray(productTypes) ? productTypes : []
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    product_type_id: '',
    description: '',
    price: '',
    cost: '',
    stock: ''
  })
  const { toast } = useToast()

  // Reset form when product changes
  useEffect(() => {
    if (product && product.id) {
      // Debug logging to see the actual product structure
      console.log('Product data:', product)
      console.log('Product type field:', product.type)
      console.log('Product product_types field:', product.product_types)

      // Find the product type ID by matching the name
      const productType = safeProductTypes.find(pt => pt.name === product.type)
      console.log('Found product type:', productType)
      console.log('Safe product types:', safeProductTypes)

      setFormData({
        name: product.name || '',
        // Use the found product type ID or fallback to the raw type value
        product_type_id: product.product_types?.id || productType?.id || product.type || '',
        description: product.description || '',
        price: (product.price || 0).toFixed(2),
        cost: (product.cost || 0).toFixed(2),
        stock: (product.stock || 0).toString()
      })
    } else {
      setFormData({
        name: '',
        product_type_id: '',
        description: '',
        price: '',
        cost: '',
        stock: ''
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!product || !product.id) return

    // Validate required form data
    if (!formData.name || !formData.price || !formData.cost || !formData.stock) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          product_type_id: formData.product_type_id || null,
          description: formData.description || null,
          price: parseFloat(formData.price),
          cost: parseFloat(formData.cost),
          stock: parseInt(formData.stock)
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update product')
      }

      const apiResponse = await response.json()

      // Handle different API response structures
      let updatedProduct
      if (apiResponse.data) {
        // API returns data in "data" field
        updatedProduct = apiResponse.data
      } else if (apiResponse.updatedProduct) {
        // API returns data in "updatedProduct" field
        updatedProduct = apiResponse.updatedProduct
      } else {
        // API returns the product data directly
        updatedProduct = apiResponse
      }

      // Transform the API response to match the frontend Product interface
      const transformedProduct = {
        id: updatedProduct.id,
        name: updatedProduct.name,
        type: updatedProduct.product_types?.name || updatedProduct.type || '',
        description: updatedProduct.description,
        price: updatedProduct.price,
        cost: updatedProduct.cost,
        stock: updatedProduct.stock,
        status: updatedProduct.status || 'In Stock',
        created_at: updatedProduct.created_at,
        updated_at: updatedProduct.updated_at,
        product_types: updatedProduct.product_types
      }

      console.log('Updated product from API:', updatedProduct)
      console.log('Transformed product:', transformedProduct)

      onSuccess(transformedProduct)
      onClose()

      toast({
        title: 'Success',
        description: 'Product updated successfully',
      })
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update product',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Product
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Name *
            </label>
            <Input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Enter product name"
            />
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Type
            </label>
            <select
              name="product_type_id"
              value={formData.product_type_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a category</option>
              {safeProductTypes.filter(type => type && type.id && type.name).map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Enter product description (optional)"
            />
          </div>

          {/* Price and Cost */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price (₱) *
              </label>
              <Input
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={handleInputChange}
                className="w-full"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cost (₱) *
              </label>
              <Input
                name="cost"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.cost}
                onChange={handleInputChange}
                className="w-full"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stock *
            </label>
            <Input
              name="stock"
              type="number"
              min="0"
              required
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full"
              placeholder="0"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}