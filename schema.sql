-- Enable UUID generation extension
create extension if not exists pgcrypto;

-- Users table for authentication and customer management
create table users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  password_hash text not null,
  full_name text,
  phone text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product Types / Categories
create table product_types (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamptz default now()
);

-- Products table
create table products (
  id uuid default gen_random_uuid() primary key,
  type_id uuid references product_types(id) on delete set null,
  name text not null,                   -- changed from 'title' to 'name' for consistency
  description text,
  cost decimal(10,2) not null default 0.00,      -- cost price (how much store pays)
  price decimal(10,2) not null default 0.00,     -- selling price
  stock integer not null default 0,     -- current stock count
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint check_stock_nonnegative check (stock >= 0),
  constraint check_cost_nonnegative check (cost >= 0),
  constraint check_price_nonnegative check (price >= 0)
);

-- Orders made by customers (paid orders)
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'ready_for_pickup', 'completed', 'cancelled')),
  total_amount decimal(10,2) not null default 0.00,
  currency text default 'USD',
  paid_at timestamptz,                       -- when payment was confirmed
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sales records (individual items sold - simple and minimal)
create table sales (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id),
  qty integer not null,
  unit_price decimal(10,2) not null,
  subtotal decimal(10,2) generated always as (qty * unit_price) stored,

  -- Basic sale information
  payment_method text default 'cash' check (payment_method in ('cash', 'card', 'mobile', 'other')),

  -- Timestamps
  sale_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Constraints
  constraint check_qty_positive check (qty > 0),
  constraint check_unit_price_positive check (unit_price >= 0)
);

-- Pre-orders (reservations / pickup orders)
create table pre_orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'ready_for_pickup', 'completed', 'cancelled')),
  total_amount decimal(10,2) not null default 0.00,
  currency text default 'USD',
  pickup_time timestamptz,
  paid_at timestamptz,                       -- when payment was confirmed
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Items inside pre-orders
create table pre_order_items (
  id uuid default gen_random_uuid() primary key,
  pre_order_id uuid references pre_orders(id) on delete cascade,
  product_id uuid references products(id),
  qty integer not null,
  unit_price decimal(10,2) not null,
  subtotal decimal(10,2) generated always as (qty * unit_price) stored,
  constraint check_qty_positive check (qty > 0),
  constraint check_unit_price_positive check (unit_price >= 0)
);

-- Inventory transactions table for tracking stock changes
create table inventory_transactions (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  transaction_type text not null check (transaction_type in ('sale', 'restock', 'adjustment', 'pre_order_deduction')),
  quantity_change integer not null,                -- positive for restock, negative for sale
  reference_id uuid,                              -- order_id, pre_order_id, or null for manual adjustments
  reference_type text,                            -- 'order', 'pre_order', or null
  notes text,
  created_at timestamptz default now(),
  constraint check_quantity_change_not_zero check (quantity_change != 0)
);

-- Indexes to speed up lookups
create index on users (email);
create index on orders (user_id);
create index on pre_orders (user_id);
create index on order_items (order_id);
create index on pre_order_items (pre_order_id);
create index on products (type_id);
create index on inventory_transactions (product_id);
create index on inventory_transactions (transaction_type);
create index on inventory_transactions (reference_id, reference_type) where reference_id is not null;

-- Triggers to auto-update updated_at timestamp on products, orders, pre_orders

create or replace function update_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_products_updated_at
before update on products
for each row execute procedure update_timestamp();

create trigger update_orders_updated_at
before update on orders
for each row execute procedure update_timestamp();

create trigger update_pre_orders_updated_at
before update on pre_orders
for each row execute procedure update_timestamp();

create trigger update_users_updated_at
before update on users
for each row execute procedure update_timestamp();

-- Function to automatically create inventory transactions when stock changes
create or replace function log_inventory_transaction()
returns trigger as $$
begin
  -- Only log if stock actually changed
  if old.stock != new.stock then
    insert into inventory_transactions (
      product_id,
      transaction_type,
      quantity_change,
      notes
    ) values (
      new.id,
      case
        when new.stock > old.stock then 'restock'
        else 'sale'
      end,
      new.stock - old.stock,
      'Automatic stock change from ' || old.stock || ' to ' || new.stock
    );
  end if;
  return new;
end;
$$ language plpgsql;

create trigger log_products_inventory_changes
after update on products
for each row execute procedure log_inventory_transaction();

-- Function to deduct stock when order is paid
create or replace function deduct_stock_on_paid_order()
returns trigger as $$
declare
  item record;
begin
  if new.status = 'paid' and old.status != 'paid' then
    -- Deduct stock for each item in the order
    for item in select product_id, qty from order_items where order_id = new.id loop
      update products
      set stock = stock - item.qty
      where id = item.product_id;

      insert into inventory_transactions (
        product_id,
        transaction_type,
        quantity_change,
        reference_id,
        reference_type,
        notes
      ) values (
        item.product_id,
        'sale',
        -item.qty,
        new.id,
        'order',
        'Stock deduction for paid order ' || new.id
      );
    end loop;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger deduct_stock_when_order_paid
after update on orders
for each row execute procedure deduct_stock_on_paid_order();

-- Function to deduct stock when pre-order is paid
create or replace function deduct_stock_on_paid_pre_order()
returns trigger as $$
declare
  item record;
begin
  if new.status = 'approved' and old.status != 'approved' then
    -- For pre-orders, stock is deducted when approved (after payment)
    for item in select product_id, qty from pre_order_items where pre_order_id = new.id loop
      update products
      set stock = stock - item.qty
      where id = item.product_id;

      insert into inventory_transactions (
        product_id,
        transaction_type,
        quantity_change,
        reference_id,
        reference_type,
        notes
      ) values (
        item.product_id,
        'pre_order_deduction',
        -item.qty,
        new.id,
        'pre_order',
        'Stock deduction for approved pre-order ' || new.id
      );
    end loop;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger deduct_stock_when_pre_order_approved
after update on pre_orders
for each row execute procedure deduct_stock_on_paid_pre_order();
