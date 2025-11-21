-- Product Types Insert Script for Sari Grocery Reservation System
-- This script inserts common grocery categories into the product_types table

-- Insert common grocery product categories
INSERT INTO product_types (name) VALUES
('Vegetables'),
('Fruits'),
('Dairy & Eggs'),
('Meat & Poultry'),
('Seafood'),
('Grains & Rice'),
('Bakery & Bread'),
('Beverages'),
('Snacks & Confectionery'),
('Canned Goods'),
('Frozen Foods'),
('Condiments & Spices'),
('Cooking Oil & Ghee'),
('Breakfast Foods'),
('Pantry Staples'),
('Personal Care'),
('Household Supplies');

-- Additional categories for more specific items
INSERT INTO product_types (name) VALUES
('Fresh Vegetables'),
('Leafy Greens'),
('Root Vegetables'),
('Tropical Fruits'),
('Seasonal Fruits'),
('Imported Fruits'),
('Local Fruits'),
('Organic Products'),
('Herbs & Spices'),
('Sauces & Dressings'),
('Nuts & Seeds'),
('Dried Fruits'),
('Juices & Drinks'),
('Coffee & Tea'),
('Pasta & Noodles'),
('Flour & Sugar'),
('Cleaning Supplies'),
('Paper Products');

-- Verify the insert
SELECT
    id,
    name,
    created_at
FROM product_types
ORDER BY name;

-- Total count of product types
SELECT
    COUNT(*) as total_product_types
FROM product_types;