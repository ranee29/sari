'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

export default function AddProductForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true)

    try {
      // Here you would make an API call to save the product
      console.log('Creating product:', data)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: 'Product added successfully',
        description: `${data.name} has been added to your inventory.`,
        variant: 'success',
      })

      router.push('/admin/products')
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

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Information</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Add a new product to your inventory</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Product Name */}
            <div className="form-field">
              <label className="form-label">Product Name *</label>
              <Input
                {...register('name')}
                placeholder="Enter product name"
                error={errors.name?.message}
              />
            </div>

            {/* Product Type */}
            <div className="form-field">
              <label className="form-label">Product Type *</label>
              <select
                {...register('type')}
                className="select"
                defaultValue=""
              >
                <option value="" disabled>Select product type</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Dairy">Dairy</option>
                <option value="Meat">Meat</option>
                <option value="Seafood">Seafood</option>
                <option value="Grains">Grains</option>
                <option value="Beverages">Beverages</option>
                <option value="Snacks">Snacks</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="form-field">
              <label className="form-label">Description</label>
              <textarea
                {...register('description')}
                placeholder="Enter product description (optional)"
                rows={4}
                className="textarea"
              />
            </div>

            {/* Cost and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-field">
                <label className="form-label">Cost (Your Purchase Price) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                  <Input
                    {...register('cost', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-8"
                    error={errors.cost?.message}
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Price (Selling Price) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                  <Input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-8"
                    error={errors.price?.message}
                  />
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="form-field">
              <label className="form-label">Starting Stock *</label>
              <Input
                {...register('stock', { valueAsNumber: true })}
                type="number"
                min="0"
                placeholder="0"
                error={errors.stock?.message}
              />
            </div>

            {/* Form Validation Errors */}
            {errors.price && errors.price.message === 'Price must be greater than or equal to cost' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ {errors.price.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary"
              >
                {loading ? 'Adding Product...' : 'Save Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}