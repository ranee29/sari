import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, ProductFormData } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        product_types (
          id,
          name
        )
      `)
      .eq('id', id)
            .single();

    if (error) {
      console.error('Database error:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to fetch product' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body: ProductFormData = await request.json();

    // Validate required fields
    if (!body.name || body.cost === undefined || body.price === undefined || body.stock === undefined) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields: name, cost, price, stock' },
        { status: 400 }
      );
    }

    // Validate business rules
    if (body.cost < 0 || body.price < 0 || body.stock < 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Cost, price, and stock must be non-negative' },
        { status: 400 }
      );
    }

    if (body.price < body.cost) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Price must be greater than or equal to cost' },
        { status: 400 }
      );
    }

    // Check if product exists
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('id, stock')
      .eq('id', id)
            .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check for duplicate name (if name is being changed)
    if (body.name) {
      const { data: nameCheck, error: nameCheckError } = await supabase
        .from('products')
        .select('id')
        .eq('name', body.name)
        .neq('id', id)
                .single();

      if (nameCheck && !nameCheckError) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Product with this name already exists' },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: Partial<ProductFormData> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.type_id !== undefined) updateData.type_id = body.type_id || undefined;
    if (body.cost !== undefined) updateData.cost = body.cost;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.stock !== undefined) updateData.stock = body.stock;

    // Update product
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        product_types (
          id,
          name
        )
      `)
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to update product' },
        { status: 500 }
      );
    }

    // Create inventory transaction if stock changed
    if (body.stock !== undefined && body.stock !== existingProduct.stock) {
      const stockChange = body.stock - existingProduct.stock;

      await supabase
        .from('inventory_transactions')
        .insert({
          product_id: id,
          transaction_type: stockChange > 0 ? 'adjustment' : 'adjustment',
          quantity_change: stockChange,
          notes: `Product edit: Stock adjusted from ${existingProduct.stock} to ${body.stock}`
        });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check if product exists
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('id, stock')
      .eq('id', id)
            .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete the product
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    // Create inventory transaction record (if stock > 0)
    if (existingProduct.stock > 0) {
      await supabase
        .from('inventory_transactions')
        .insert({
          product_id: id,
          transaction_type: 'adjustment',
          quantity_change: -existingProduct.stock,
          notes: `Product deleted: ${existingProduct.stock} units removed from inventory`
        });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}