import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  try {
    // Fetch all product types
    const { data: productTypes, error } = await supabase
      .from('product_types')
      .select('id, name')
      .order('name')

    if (error) {
      console.error('Error fetching product types:', error)
      return NextResponse.json({ error: 'Failed to fetch product types' }, { status: 500 })
    }

    return NextResponse.json({ productTypes: productTypes || [] })
  } catch (error) {
    console.error('Error in product types API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}