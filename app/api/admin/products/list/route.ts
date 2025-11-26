import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        stock,
        type_id,
        product_types (id, name)
      `)
      .gte('stock', 1)  // Only show products with stock
      .order('name')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the data to include type name
    const products = data?.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      type: product.product_types?.name || 'Uncategorized',
      type_id: product.type_id
    })) || []

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}