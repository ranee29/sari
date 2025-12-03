// Database entity types based on schema.sql

export interface Product {
  id: string;
  type_id: string | null;
  name: string;
  description: string | null;
  cost: number;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface ProductType {
  id: string;
  name: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  phone: string | null;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  status: 'pending' | 'paid' | 'ready_for_pickup' | 'completed' | 'cancelled';
  total_amount: number;
  currency: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  product_id: string;
  qty: number;
  unit_price: number;
  subtotal: number;
  payment_method: 'cash' | 'card' | 'mobile' | 'other';
  sale_date: string;
  created_at: string;
  updated_at: string;
}

export interface PreOrder {
  id: string;
  user_id: string | null;
  status: 'pending' | 'approved' | 'ready_for_pickup' | 'completed' | 'cancelled';
  total_amount: number;
  currency: string;
  pickup_time: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PreOrderItem {
  id: string;
  pre_order_id: string;
  product_id: string;
  qty: number;
  unit_price: number;
  subtotal: number;
}

export interface InventoryTransaction {
  id: string;
  product_id: string;
  transaction_type: 'sale' | 'restock' | 'adjustment' | 'pre_order_deduction';
  quantity_change: number;
  reference_id: string | null;
  reference_type: string | null;
  notes: string | null;
  created_at: string;
}

// Extended types for UI
export interface ProductWithType extends Product {
  product_type?: ProductType | null;
}

export interface InventoryStats {
  totalProducts: number;
  totalStockValue: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface ProductFormData {
  name: string;
  description?: string;
  type_id?: string;
  cost: number;
  price: number;
  stock: number;
}

export interface StockAdjustmentData {
  product_id: string;
  quantity_change: number;
  transaction_type: 'restock' | 'adjustment';
  notes?: string;
}

export interface BulkStockAdjustmentData {
  adjustments: StockAdjustmentData[];
}

// Filter and search types
export interface ProductFilters {
  search?: string;
  type_id?: string;
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  sort_by?: 'name' | 'stock' | 'price' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}