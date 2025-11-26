import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()

    // Get today's date at midnight
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Fetch today's sales
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('*')
      .gte('sale_date', today.toISOString())
      .order('sale_date', { ascending: false })

    if (salesError) {
      return NextResponse.json({ error: salesError.message }, { status: 500 })
    }

    // Calculate statistics
    const totalSales = sales?.reduce((sum, sale) => sum + sale.subtotal, 0) || 0
    const totalItems = sales?.reduce((sum, sale) => sum + sale.qty, 0) || 0
    const totalTransactions = sales?.length || 0

    // Get top products (this is a simplified version - you could make this more sophisticated)
    const productCounts = sales?.reduce((acc, sale) => {
      const key = sale.product_id
      acc[key] = (acc[key] || 0) + sale.qty
      return acc
    }, {} as Record<string, number>) || {}

    // Get product names for top products
    const productIds = Object.keys(productCounts).slice(0, 5)
    const { data: products, error: productsError } = productIds.length > 0 ?
      await supabase
        .from('products')
        .select('id, name')
        .in('id', productIds) : { data: [], error: null }

    const topProducts = products?.map(product => ({
      name: product.name,
      quantity: productCounts[product.id]
    })) || []

    return NextResponse.json({
      totalSales,
      totalItems,
      totalTransactions,
      topProducts
    })

  } catch (error) {
    console.error('Error fetching today stats:', error)
    return NextResponse.json({
      totalSales: 0,
      totalItems: 0,
      totalTransactions: 0,
      topProducts: []
    })
  }
}