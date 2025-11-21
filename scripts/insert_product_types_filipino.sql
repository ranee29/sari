-- Filipino/Southeast Asian Product Types Insert Script
-- Optimized for Sari-Sari Store and Filipino grocery items

-- Core categories for Filipino grocery stores
INSERT INTO product_types (name) VALUES
('Rice'),
('Noodles & Pasta'),
('Canned Goods'),
('Beverages'),
('Snacks'),
('Condiments'),
('Personal Care'),
('Household');

-- Rice varieties (staple food in Philippines)
INSERT INTO product_types (name) VALUES
('Premium Rice'),
('Regular Rice'),
('Special Rice'),
('Imported Rice'),
('Brown Rice');

-- Filipino noodles and instant meals
INSERT INTO product_types (name) VALUES
('Instant Noodles'),
('Egg Noodles'),
('Pancit Canton'),
('Mami Noodles'),
('Sotanghon'),
('Bihon'),
('Canton');

-- Canned goods and preserved foods
INSERT INTO product_types (name) VALUES
('Sardines'),
('Corned Beef'),
('Spam & Luncheon Meat'),
('Mackerel'),
('Tuna'),
('Milk Powder'),
('Evaporated Milk'),
('Condensed Milk'),
('Tomato Sauce'),
('Pasta Sauce'),
('Coconut Milk');

-- Filipino beverages
INSERT INTO product_types (name) VALUES
('Soft Drinks'),
('Juices'),
('Energy Drinks'),
('Coffee'),
('Tea'),
('Chocolate Drinks'),
('Soy Milk'),
('Bottled Water');

-- Filipino snacks and confectionery
INSERT INTO product_types (name) VALUES
('Chips'),
('Candies'),
('Biscuits'),
('Crackers'),
('Local Snacks'),
('Polvoron'),
 pastillas'),
('Ice Candy');

-- Essential condiments for Filipino cooking
INSERT INTO product_types (name) VALUES
('Soy Sauce'),
('Vinegar'),
('Fish Sauce'),
('Patis'),
'Coconut Vinegar'),
('Sugar'),
'Salt'),
'Cooking Oil'),
('Garlic'),
('Onions'),
('Ginger'),
('Chili'),
('Black Pepper'),
('Seasoning Mixes');

-- Fresh produce categories
INSERT INTO product_types (name) VALUES
('Vegetables'),
('Leafy Greens'),
('Root Crops'),
('Fruits'),
('Herbs'),
('Spices');

-- Meat and seafood
INSERT INTO product_types (name) VALUES
('Pork'),
('Beef'),
('Chicken'),
'Fish'),
'Shrimp'),
'Processed Meat');

-- Dairy and eggs
INSERT INTO product_types (name) VALUES
('Eggs'),
'Cheese'),
'Butter'),
'Margarine',
'Yogurt');

-- Personal care items
INSERT INTO product_types (name) VALUES
('Soap'),
'Shampoo'),
'Toothpaste',
'Toothbrushes',
'Deodorant',
'Sanitary Napkins',
'Tissues');

-- Household supplies
INSERT INTO product_types (name) VALUES
('Laundry Detergent'),
'Dishwashing Soap'),
'Cleaning Agents'),
'Plastic Bags'),
'Paper Products'),
'Batteries');

-- School and office supplies
INSERT INTO product_types (name) VALUES
('Pens'),
'Papers'),
'Notebooks'),
'Envelopes'),
'Scissors'),
'Tape');

-- Verify the insert
SELECT
    id,
    name,
    created_at,
    CASE
        WHEN name IN ('Rice', 'Premium Rice', 'Regular Rice') THEN '⭐ Staple Food'
        WHEN name LIKE '%Noodles%' OR name LIKE '%Pasta%' THEN '🍜 Quick Meals'
        WHEN name IN ('Sardines', 'Corned Beef', 'Spam', 'Canned Goods') THEN '🥫 Canned Goods'
        WHEN name IN ('Soft Drinks', 'Juices', 'Coffee') THEN '🥤 Beverages'
        WHEN name LIKE '%Snacks%' OR name LIKE '%Candy%' THEN '🍪 Snacks'
        WHEN name IN ('Soy Sauce', 'Vinegar', 'Fish Sauce') THEN '🧂 Condiments'
        WHEN name IN ('Pork', 'Beef', 'Chicken') THEN '🥩 Meat'
        WHEN name IN ('Eggs', 'Cheese', 'Butter') THEN '🥛 Dairy'
        WHEN name IN ('Soap', 'Shampoo', 'Toothpaste') THEN '🧼 Personal Care'
        ELSE '📦 Other'
    END as category_group
FROM product_types
ORDER BY
    CASE
        WHEN name IN ('Rice', 'Premium Rice', 'Regular Rice') THEN 1
        WHEN name LIKE '%Noodles%' OR name LIKE '%Pasta%' THEN 2
        WHEN name IN ('Sardines', 'Corned Beef', 'Spam', 'Canned Goods') THEN 3
        WHEN name IN ('Soft Drinks', 'Juices', 'Coffee') THEN 4
        WHEN name LIKE '%Snacks%' OR name LIKE '%Candy%' THEN 5
        WHEN name IN ('Soy Sauce', 'Vinegar', 'Fish Sauce') THEN 6
        ELSE 7
    END,
    name;

-- Summary statistics
SELECT
    'Total Product Types' as metric,
    COUNT(*) as count
FROM product_types

UNION ALL

SELECT
    'Core Categories' as metric,
    COUNT(CASE WHEN name IN ('Rice', 'Noodles & Pasta', 'Canned Goods', 'Beverages', 'Snacks', 'Condiments', 'Personal Care', 'Household') THEN 1 END) as count
FROM product_types

UNION ALL

SELECT
    'Rice Varieties' as metric,
    COUNT(CASE WHEN name LIKE '%Rice%' THEN 1 END) as count
FROM product_types

UNION ALL

SELECT
    'Filipino Condiments' as metric,
    COUNT(CASE WHEN name IN ('Soy Sauce', 'Vinegar', 'Fish Sauce', 'Patis', 'Coconut Vinegar') THEN 1 END) as count
FROM product_types;