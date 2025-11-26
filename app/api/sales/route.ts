import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        products (id, name, price, stock, product_types (id, name))
      `)
      .order('sale_date', { ascending: false })
      .limit(1000)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sales: data })
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, qty, unit_price, payment_method } = body

    // Validate required fields
    if (!product_id || !qty || !unit_price || !payment_method) {
      return NextResponse.json(
        { error: 'Missing required fields: product_id, qty, unit_price, payment_method' },
        { status: 400 }
      )
    }

    // Validate numeric fields
    if (isNaN(qty) || isNaN(unit_price)) {
      return NextResponse.json(
        { error: 'qty and unit_price must be numbers' },
        { status: 400 }
      )
    }

    // Validate positive values
    if (qty <= 0 || unit_price < 0) {
      return NextResponse.json(
        { error: 'qty must be > 0, unit_price must be >= 0' },
        { status: 400 }
      )
    }

    // Validate payment method
    const validPaymentMethods = ['cash', 'card', 'mobile', 'other']
    if (!validPaymentMethods.includes(payment_method)) {
      return NextResponse.json(
        { error: `payment_method must be one of: ${validPaymentMethods.join(', ')}` },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Check if product exists and has sufficient stock
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, stock')
      .eq('id', product_id)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.stock < qty) {
      return NextResponse.json(
        { error: `Insufficient stock. Available: ${product.stock}, Requested: ${qty}` },
        { status: 400 }
      )
    }

    // Create sale record (subtotal is auto-calculated)
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({
        product_id,
        qty: parseInt(qty),
        unit_price: parseFloat(unit_price),
        payment_method
      })
      .select()
      .single()

    if (saleError) {
      return NextResponse.json({ error: saleError.message }, { status: 500 })
    }

    // Update product stock
    const newStock = product.stock - parseInt(qty)
    const { error: stockError } = await supabase
      .from('products')
      .update({
        stock: newStock,
        status: newStock === 0 ? 'Out of Stock' :
                newStock <= 10 ? 'Low Stock' : 'In Stock'
      })
      .eq('id', product_id)

    if (stockError) {
      console.error('Error updating stock:', stockError)
      // Note: We don't return an error here since the sale was created successfully
      // But we should probably implement a compensation mechanism or retry logic
    }

    // Calculate subtotal for response
    const calculatedSubtotal = parseInt(qty) * parseFloat(unit_price)

    return NextResponse.json({
      sale: {
        ...sale,
        product_name: product.name,
        subtotal: calculatedSubtotal
      }
    })

  } catch (error) {
    console.error('Error creating sale:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}