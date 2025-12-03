import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, InventoryStats } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get total products count
    const { count: totalProducts, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to fetch product count' },
        { status: 500 }
      );
    }

    // Get stock value calculation
    const { data: stockData, error: stockError } = await supabase
      .from('products')
      .select('stock, cost')
      .gte('stock', 0);

    if (stockError) {
      console.error('Stock value error:', stockError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to fetch stock value data' },
        { status: 500 }
      );
    }

    // Calculate total stock value
    const totalStockValue = (stockData || []).reduce((total, product) => {
      return total + (product.stock * product.cost);
    }, 0);

    // Get low stock products (stock <= 10 and stock > 0)
    const { count: lowStockProducts, error: lowStockError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .gt('stock', 0)
      .lte('stock', 10);

    if (lowStockError) {
      console.error('Low stock error:', lowStockError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to fetch low stock count' },
        { status: 500 }
      );
    }

    // Get out of stock products (stock = 0)
    const { count: outOfStockProducts, error: outOfStockError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('stock', 0);

    if (outOfStockError) {
      console.error('Out of stock error:', outOfStockError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to fetch out of stock count' },
        { status: 500 }
      );
    }

    const stats: InventoryStats = {
      totalProducts: totalProducts || 0,
      totalStockValue: Math.round(totalStockValue * 100) / 100, // Round to 2 decimal places
      lowStockProducts: lowStockProducts || 0,
      outOfStockProducts: outOfStockProducts || 0
    };

    return NextResponse.json<ApiResponse<InventoryStats>>({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}