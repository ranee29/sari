# Database Setup Scripts

This directory contains SQL scripts for setting up your Sari Grocery Reservation System database.

## Product Types Scripts

### 1. Essential Categories (`insert_product_types_essential.sql`)
**Best for:** Quick setup with basic categories
- 10 core sari-sari store categories
- Fast and simple installation
- Covers most common grocery items

**Categories:**
- Rice
- Canned Goods
- Noodles & Instant Meals
- Beverages
- Snacks & Confectionery
- Condiments & Cooking
- Personal Care
- Household
- Fresh Produce
- Dairy & Eggs

### 2. Filipino-Specific Categories (`insert_product_types_filipino.sql`)
**Best for:** Complete Filipino sari-sari store
- 80+ Filipino-specific categories
- Includes rice varieties, local condiments
- Organized by category groups
- Perfect for Philippine market

**Highlights:**
- Multiple rice varieties
- Filipino condiments (patis, toyo, suka)
- Local snacks (polvoron, pastillas)
- Traditional cooking ingredients

### 3. General Categories (`insert_product_types.sql`)
**Best for:** International/General grocery store
- 30+ common grocery categories
- Western-focused categories
- Good for diverse product range

## How to Use

### Method 1: Using Supabase Dashboard
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste your chosen script
4. Click "Run" to execute

### Method 2: Using Command Line
```bash
# If using psql with your Supabase connection string
psql "postgresql://[connection-string]" -f scripts/insert_product_types_essential.sql
```

### Method 3: Using Database Client
- Import the SQL file into your preferred database client
- Execute the script against your Supabase database

## Recommended Setup

For a Filipino sari-sari store, I recommend:

1. **Start with:** `insert_product_types_essential.sql`
2. **Add later:** Specific categories from `insert_product_types_filipino.sql` as needed

This approach gives you a quick start while allowing you to expand your product categories gradually.

## Verification

After running any script, you can verify the insertion by checking the `product_types` table:

```sql
SELECT * FROM product_types ORDER BY name;
SELECT COUNT(*) as total_categories FROM product_types;
```

## Customization

Feel free to modify these scripts:
- Add your own specific categories
- Remove categories you don't need
- Adjust the organization to match your inventory

## Important Notes

- Scripts are designed to work with the schema.sql structure
- All product type names must be unique
- Categories can be used when adding products via the admin interface
- Consider your local market needs when choosing categories