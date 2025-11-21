'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  type: z.string().min(1, 'Product type is required'),
  description: z.string().optional(),
  cost: z.number().min(0, 'Cost must be greater than 0'),
  price: z.number().min(0, 'Price must be greater than 0'),
  stock: z.number().min(0, 'Stock must be 0 or greater'),
}).refine((data) => data.price >= data.cost, {
  message: 'Price must be greater than or equal to cost',
  path: ['price'],
})

type ProductFormData = z.infer<typeof productSchema>

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (product: any) => void
}

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [loading, setLoading] = useState(false)
  const [productTypes, setProductTypes] = useState<Array<{ id: string; name: string }>>([])
  const [loadingTypes, setLoadingTypes] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      type: '',
      description: '',
      cost: 0,
      price: 0,
      stock: 0,
    },
  })

  // Fetch product types when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchProductTypes()
    }
  }, [isOpen])

  // Fetch product types from API
  const fetchProductTypes = async () => {
    setLoadingTypes(true)
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
      setLoadingTypes(false)
    }
  }

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset()
    }
  }, [isOpen, reset])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true)

    try {
      // Make API call to save the product
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add product')
      }

      toast({
        title: 'Product added successfully',
        description: `${data.name} has been added to your inventory.`,
        variant: 'success',
      })

      onSuccess(result.product)
    } catch (error: any) {
      toast({
        title: 'Error adding product',
        description: error.message || 'Failed to add product. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Modal Content with Scroll */}
        <div className="flex flex-col max-h-full overflow-hidden">
          {/* Sticky Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Product</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Fill in the details below to add a new product to your inventory</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-105 flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('name')}
                placeholder="Enter product name"
                error={errors.name?.message}
                disabled={loading}
                className="text-base"
              />
            </div>

            {/* Product Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('type')}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none text-base disabled:opacity-50"
                defaultValue=""
                disabled={loading || loadingTypes}
              >
                <option value="" disabled>
                  {loadingTypes ? 'Loading product types...' : 'Select product type'}
                </option>
                {productTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
              )}
              {productTypes.length === 0 && !loadingTypes && (
                <p className="text-sm text-yellow-600 mt-1">
                  No product types found. Please add product types to your database first.
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                {...register('description')}
                placeholder="Enter product description (optional)"
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none text-base disabled:opacity-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                disabled={loading}
              />
            </div>

            {/* Cost and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cost (Your Purchase Price) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₱</span>
                  <Input
                    {...register('cost', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-8 text-base"
                    error={errors.cost?.message}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price (Selling Price) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₱</span>
                  <Input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-8 text-base"
                    error={errors.price?.message}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Starting Stock <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('stock', { valueAsNumber: true })}
                type="number"
                min="0"
                placeholder="0"
                error={errors.stock?.message}
                disabled={loading}
                className="text-base"
              />
            </div>

            {/* Form Validation Errors */}
            {errors.price && errors.price.message === 'Price must be greater than or equal to cost' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-yellow-600 dark:text-yellow-400 text-lg">⚠️</span>
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Pricing Validation Error
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      {errors.price.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 pb-2 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 h-11 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-11 font-medium btn-primary"
              >
                {loading ? 'Adding Product...' : 'Save Product'}
              </Button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  )
}