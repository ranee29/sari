-- Essential Product Types for Sari-Sari Store
-- Quick setup script with the most common categories

-- Core sari-sari store categories
INSERT INTO product_types (name) VALUES
('Rice'),
('Canned Goods'),
('Noodles & Instant Meals'),
('Beverages'),
('Snacks & Confectionery'),
('Condiments & Cooking'),
('Personal Care'),
('Household'),
('Fresh Produce'),
('Dairy & Eggs');

-- Quick verification
SELECT
    id,
    name,
    created_at
FROM product_types
ORDER BY name;

-- Summary
SELECT COUNT(*) as total_product_types FROM product_types;