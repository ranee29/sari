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
  }[] | {
    id: string
    name: string
  } | null
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
  const transformedProducts = products?.map((product: any): TransformedProduct => {
    // Handle different formats of product_types relationship
    let typeName = 'Uncategorized'
    if (product.product_types) {
      const productTypes = product.product_types as any
      if (Array.isArray(productTypes)) {
        // If it's an array, take the first item
        typeName = productTypes[0]?.name || 'Uncategorized'
      } else if (productTypes && typeof productTypes === 'object' && 'name' in productTypes) {
        // If it's a single object, use it directly
        typeName = productTypes.name || 'Uncategorized'
      }
    }

    return {
      id: product.id,
      name: product.name,
      type: typeName,
      description: product.description,
      cost: parseFloat(product.cost),
      price: parseFloat(product.price),
      stock: product.stock,
      status: product.stock === 0 ? 'Out of Stock' :
              product.stock <= 10 ? 'Low Stock' : 'In Stock',
      created_at: new Date(product.created_at).toLocaleDateString(),
      updated_at: product.updated_at,
    }
  }) || []

  return <ProductsList initialProducts={transformedProducts} />
}