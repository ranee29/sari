import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, ProductFilters, PaginatedResponse, ProductWithType, InventoryStats } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const type_id = searchParams.get('type_id');
    const stock_status = searchParams.get('stock_status');
    const sort_by = searchParams.get('sort_by') || 'name';
    const sort_order = searchParams.get('sort_order') || 'asc';

    const offset = (page - 1) * limit;

    // Start building query
    let query = supabase
      .from('products')
      .select(`
        *,
        product_types (
          id,
          name
        )
      `);

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply type filter
    if (type_id) {
      query = query.eq('type_id', type_id);
    }

    // Apply stock status filter
    if (stock_status) {
      switch (stock_status) {
        case 'in_stock':
          query = query.gt('stock', 10);
          break;
        case 'low_stock':
          query = query.gte('stock', 1).lte('stock', 10);
          break;
        case 'out_of_stock':
          query = query.eq('stock', 0);
          break;
      }
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

    // Get total count for pagination
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false);

    // Apply pagination
    const { data: products, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to fetch inventory' },
        { status: 500 }
      );
    }

    // Transform data to include product_type
    const transformedProducts: ProductWithType[] = (products || []).map(product => ({
      ...product,
      product_type: product.product_types
    }));

    const response: PaginatedResponse<ProductWithType> = {
      data: transformedProducts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };

    return NextResponse.json<ApiResponse<PaginatedResponse<ProductWithType>>>({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { product_id, quantity_change, transaction_type, notes } = body;

    // Validate required fields
    if (!product_id || !quantity_change || !transaction_type) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields: product_id, quantity_change, transaction_type' },
        { status: 400 }
      );
    }

    // Validate transaction type
    if (!['restock', 'adjustment'].includes(transaction_type)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid transaction type. Must be: restock, adjustment' },
        { status: 400 }
      );
    }

    // Get current product
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', product_id)
      .single();

    if (fetchError || !product) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const newStock = product.stock + quantity_change;

    // Validate new stock is not negative
    if (newStock < 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Stock cannot be negative' },
        { status: 400 }
      );
    }

    // Update product stock
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', product_id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to update product stock' },
        { status: 500 }
      );
    }

    // Create inventory transaction record
    const { error: transactionError } = await supabase
      .from('inventory_transactions')
      .insert({
        product_id,
        transaction_type,
        quantity_change,
        notes: notes || `${transaction_type}: ${quantity_change > 0 ? '+' : ''}${quantity_change} units`
      });

    if (transactionError) {
      console.error('Transaction error:', transactionError);
      // Don't fail the request if transaction logging fails, but log it
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Stock updated successfully',
      data: { newStock }
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Bulk stock adjustment endpoint
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { adjustments } = body;

    if (!Array.isArray(adjustments) || adjustments.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Adjustments array is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Validate all adjustments first
    for (const adjustment of adjustments) {
      if (!adjustment.product_id || !adjustment.quantity_change || !adjustment.transaction_type) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Each adjustment must have product_id, quantity_change, and transaction_type' },
          { status: 400 }
        );
      }
    }

    const results = [];
    const errors = [];

    // Process each adjustment
    for (const adjustment of adjustments) {
      try {
        // Get current product
        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', adjustment.product_id)
          .single();

        if (fetchError || !product) {
          errors.push({ product_id: adjustment.product_id, error: 'Product not found' });
          continue;
        }

        const newStock = product.stock + adjustment.quantity_change;

        if (newStock < 0) {
          errors.push({ product_id: adjustment.product_id, error: 'Stock cannot be negative' });
          continue;
        }

        // Update product stock
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', adjustment.product_id);

        if (updateError) {
          errors.push({ product_id: adjustment.product_id, error: 'Failed to update stock' });
          continue;
        }

        // Create inventory transaction record
        await supabase
          .from('inventory_transactions')
          .insert({
            product_id: adjustment.product_id,
            transaction_type: adjustment.transaction_type,
            quantity_change: adjustment.quantity_change,
            notes: adjustment.notes || `${adjustment.transaction_type}: ${adjustment.quantity_change > 0 ? '+' : ''}${adjustment.quantity_change} units`
          });

        results.push({ product_id: adjustment.product_id, newStock });

      } catch (error) {
        errors.push({ product_id: adjustment.product_id, error: 'Processing failed' });
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Processed ${results.length} adjustments${errors.length > 0 ? ` with ${errors.length} errors` : ''}`,
      data: { results, errors }
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}