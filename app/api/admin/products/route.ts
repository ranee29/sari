import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()

  try {
    const body = await request.json()
    const { name, type, description, cost, price, stock } = body

    // Validate required fields
    if (!name || !type || !cost || !price || stock === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate business rules
    if (price < cost) {
      return NextResponse.json({ error: 'Price must be greater than or equal to cost' }, { status: 400 })
    }

    if (stock < 0) {
      return NextResponse.json({ error: 'Stock cannot be negative' }, { status: 400 })
    }

    // Find or create the product type
    let typeId = null
    const { data: existingType, error: typeError } = await supabase
      .from('product_types')
      .select('id')
      .eq('name', type)
      .single()

    if (typeError && typeError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Error checking product type' }, { status: 500 })
    }

    if (existingType) {
      typeId = existingType.id
    } else {
      // Create new product type
      const { data: newType, error: createTypeError } = await supabase
        .from('product_types')
        .insert({ name: type })
        .select('id')
        .single()

      if (createTypeError) {
        return NextResponse.json({ error: 'Error creating product type' }, { status: 500 })
      }

      typeId = newType.id
    }

    // Create the product
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        type_id: typeId,
        description,
        cost: parseFloat(cost),
        price: parseFloat(price),
        stock: parseInt(stock),
      })
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
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }

    // Transform response data
    const transformedProduct = {
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
    }

    return NextResponse.json({
      success: true,
      product: transformedProduct
    }, { status: 201 })

  } catch (error) {
    console.error('Error in create product API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}