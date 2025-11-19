import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Database types based on schema
export interface Database {
  public: {
    Tables: {
      product_types: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          type_id: string | null
          name: string
          description: string | null
          cost: number
          price: number
          stock: number
          created_at: string
        }
        Insert: {
          id?: string
          type_id?: string | null
          name: string
          description?: string | null
          cost: number
          price: number
          stock?: number
          created_at?: string
        }
        Update: {
          id?: string
          type_id?: string | null
          name?: string
          description?: string | null
          cost?: number
          price?: number
          stock?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: 'pending' | 'paid' | 'ready_for_pickup' | 'completed' | 'cancelled'
          total_amount: number
          currency: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'pending' | 'paid' | 'ready_for_pickup' | 'completed' | 'cancelled'
          total_amount?: number
          currency?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'pending' | 'paid' | 'ready_for_pickup' | 'completed' | 'cancelled'
          total_amount?: number
          currency?: string
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          qty: number
          unit_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          qty: number
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          qty?: number
          unit_price?: number
        }
      }
      pre_orders: {
        Row: {
          id: string
          user_id: string
          status: 'pending' | 'approved' | 'ready_for_pickup' | 'completed' | 'cancelled'
          total_amount: number
          currency: string
          pickup_time: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'pending' | 'approved' | 'ready_for_pickup' | 'completed' | 'cancelled'
          total_amount?: number
          currency?: string
          pickup_time?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'pending' | 'approved' | 'ready_for_pickup' | 'completed' | 'cancelled'
          total_amount?: number
          currency?: string
          pickup_time?: string | null
          created_at?: string
        }
      }
      pre_order_items: {
        Row: {
          id: string
          pre_order_id: string
          product_id: string
          qty: number
          unit_price: number
        }
        Insert: {
          id?: string
          pre_order_id: string
          product_id: string
          qty: number
          unit_price: number
        }
        Update: {
          id?: string
          pre_order_id?: string
          product_id?: string
          qty?: number
          unit_price?: number
        }
      }
    }
  }
}
