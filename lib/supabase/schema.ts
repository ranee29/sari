import { z } from 'zod'

// Database schema types
export const productTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  created_at: z.string(),
})

export const productSchema = z.object({
  id: z.string().uuid(),
  type_id: z.string().uuid().nullable(),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().nullable(),
  cost: z.number().min(0, 'Cost must be positive'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().min(0, 'Stock must be non-negative'),
  created_at: z.string(),
  product_types: productTypeSchema.optional(),
})

export const orderSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: z.enum(['pending', 'paid', 'ready_for_pickup', 'completed', 'cancelled']),
  total_amount: z.number().min(0),
  currency: z.string().default('USD'),
  created_at: z.string(),
})

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  product_id: z.string().uuid(),
  qty: z.number().min(1),
  unit_price: z.number().min(0),
  products: productSchema.optional(),
})

export const preOrderSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: z.enum(['pending', 'approved', 'ready_for_pickup', 'completed', 'cancelled']),
  total_amount: z.number().min(0),
  currency: z.string().default('USD'),
  pickup_time: z.string().datetime().nullable(),
  created_at: z.string(),
})

export const preOrderItemSchema = z.object({
  id: z.string().uuid(),
  pre_order_id: z.string().uuid(),
  product_id: z.string().uuid(),
  qty: z.number().min(1),
  unit_price: z.number().min(0),
  products: productSchema.optional(),
})

// Form validation schemas
export const createProductSchema = z.object({
  type_id: z.string().uuid().nullable(),
  name: z.string().min(1, 'Product name is required').max(100),
  description: z.string().max(500).optional(),
  cost: z.number().min(0, 'Cost must be positive'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().min(0, 'Stock must be non-negative'),
})

export const updateProductSchema = createProductSchema.partial()

export const updateStockSchema = z.object({
  stock: z.number().min(0, 'Stock must be non-negative'),
})

export const createOrderSchema = z.object({
  items: z.array(z.object({
    product_id: z.string().uuid(),
    qty: z.number().min(1),
    unit_price: z.number().min(0),
  })),
})

export const updateOrderSchema = z.object({
  status: z.enum(['pending', 'paid', 'ready_for_pickup', 'completed', 'cancelled']),
})

export const updatePreOrderSchema = z.object({
  status: z.enum(['pending', 'approved', 'ready_for_pickup', 'completed', 'cancelled']),
  pickup_time: z.string().datetime().optional(),
})

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(1, 'Full name is required').max(100),
  phone: z.string().optional(),
})

export const updateProfileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(100).optional(),
  phone: z.string().optional(),
})

// Export types
export type ProductType = z.infer<typeof productTypeSchema>
export type Product = z.infer<typeof productSchema>
export type Order = z.infer<typeof orderSchema>
export type OrderItem = z.infer<typeof orderItemSchema>
export type PreOrder = z.infer<typeof preOrderSchema>
export type PreOrderItem = z.infer<typeof preOrderItemSchema>

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type UpdateStockInput = z.infer<typeof updateStockSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>
export type UpdatePreOrderInput = z.infer<typeof updatePreOrderSchema>

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>