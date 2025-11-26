import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sales, payment_method } = body

    // Validate required fields
    if (!sales || !Array.isArray(sales) || sales.length === 0) {
      return NextResponse.json(
        { error: 'Sales array is required and cannot be empty' },
        { status: 400 }
      )
    }

    if (!payment_method) {
      return NextResponse.json(
        { error: 'Payment method is required' },
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

    // Validate each sale item
    for (const sale of sales) {
      const { product_id, qty, unit_price } = sale

      if (!product_id || !qty || !unit_price) {
        return NextResponse.json(
          { error: 'Each sale must have product_id, qty, and unit_price' },
          { status: 400 }
        )
      }

      if (isNaN(qty) || isNaN(unit_price)) {
        return NextResponse.json(
          { error: 'qty and unit_price must be numbers' },
          { status: 400 }
        )
      }

      if (qty <= 0 || unit_price < 0) {
        return NextResponse.json(
          { error: 'qty must be > 0, unit_price must be >= 0' },
          { status: 400 }
        )
      }
    }

    // Start a transaction
    const { data: transactionResult, error: transactionError } = await supabase.rpc(
      'process_bulk_sales',
      {
        p_sales: sales,
        p_payment_method: payment_method
      }
    )

    if (transactionError) {
      console.error('Transaction error:', transactionError)

      // Fallback to manual processing if RPC doesn't exist
      console.log('Falling back to manual processing...')
      return await processManualSales(supabase, sales, payment_method)
    }

    return NextResponse.json({
      success: true,
      sales: transactionResult,
      message: `${sales.length} items processed successfully`
    })

  } catch (error) {
    console.error('Error creating bulk sale:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Fallback manual processing function
async function processManualSales(supabase: any, sales: any[], payment_method: string) {
  try {
    // Get all product IDs to check stock
    const productIds = sales.map(s => s.product_id)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, stock')
      .in('id', productIds)

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 })
    }

    // Check stock availability
    const stockMap = new Map(products?.map((p: any) => [p.id, p]) || [])
    const stockErrors: string[] = []

    for (const sale of sales) {
      const product = stockMap.get(sale.product_id) as any
      if (!product) {
        stockErrors.push(`Product ${sale.product_id} not found`)
      } else if (product.stock < sale.qty) {
        stockErrors.push(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${sale.qty}`)
      }
    }

    if (stockErrors.length > 0) {
      return NextResponse.json(
        { error: stockErrors.join('; ') },
        { status: 400 }
      )
    }

    // Process sales and update stock
    const processedSales: any[] = []
    for (const sale of sales) {
      const product = stockMap.get(sale.product_id) as any
      const newStock = product.stock - parseInt(sale.qty)

      // Create sale record
      const { data: saleRecord, error: saleError } = await supabase
        .from('sales')
        .insert({
          product_id: sale.product_id,
          qty: parseInt(sale.qty),
          unit_price: parseFloat(sale.unit_price),
          payment_method
        })
        .select()
        .single()

      if (saleError) {
        return NextResponse.json({ error: saleError.message }, { status: 500 })
      }

      // Update product stock
      const { error: stockError } = await supabase
        .from('products')
        .update({
          stock: newStock
        })
        .eq('id', sale.product_id)

      if (stockError) {
        console.error('Error updating stock:', stockError)
        return NextResponse.json({ error: stockError.message }, { status: 500 })
      }

      processedSales.push({
        ...saleRecord,
        product_name: product.name,
        subtotal: parseInt(sale.qty) * parseFloat(sale.unit_price)
      })
    }

    return NextResponse.json({
      success: true,
      sales: processedSales,
      message: `${sales.length} items processed successfully`
    })

  } catch (error) {
    console.error('Error in manual processing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}