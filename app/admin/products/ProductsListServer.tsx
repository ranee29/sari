import { createClient } from '@/lib/supabase/server'
import ProductsList from './ProductsList'

// TypeScript interfaces
interface Product {
  id: string
  name: string
  description: string | null
  cost: string
  price: string
  stock: number
  created_at: string
  updated_at: string
  product_types?: {
    id: string
    name: string
  }[]
}

interface TransformedProduct {
  id: string
  name: string
  type: string
  description: string | null
  cost: number
  price: number
  stock: number
  status: string
  created_at: string
  updated_at: string
}

// Server component to fetch data
export default async function ProductsListServer() {
  const supabase = createClient()

  // Fetch products with their types
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      cost,
      price,
      stock,
      created_at,
      updated_at,
      product_types (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error loading products. Please try again.</p>
        </div>
      </div>
    )
  }

  // Transform data to match expected format
  const transformedProducts = products?.map((product: Product): TransformedProduct => ({
    id: product.id,
    name: product.name,
    type: product.product_types?.[0]?.name || 'Uncategorized',
    description: product.description,
    cost: parseFloat(product.cost),
    price: parseFloat(product.price),
    stock: product.stock,
    status: product.stock === 0 ? 'Out of Stock' :
            product.stock <= 10 ? 'Low Stock' : 'In Stock',
    created_at: new Date(product.created_at).toLocaleDateString(),
    updated_at: product.updated_at,
  })) || []

  return <ProductsList initialProducts={transformedProducts} />
}