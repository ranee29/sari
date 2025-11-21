import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()

  try {
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
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    // Transform data to match expected format
    const transformedProducts = products?.map(product => ({
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

    return NextResponse.json({ products: transformedProducts })
  } catch (error) {
    console.error('Error in refresh API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}