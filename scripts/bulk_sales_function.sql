-- Function to process bulk sales in a single transaction
CREATE OR REPLACE FUNCTION process_bulk_sales(
    p_sales JSONB,
    p_payment_method TEXT
)
RETURNS TABLE (
    sale_id UUID,
    product_id UUID,
    product_name TEXT,
    qty INTEGER,
    unit_price DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    payment_method TEXT,
    sale_date TIMESTAMPTZ,
    success BOOLEAN,
    message TEXT
) LANGUAGE plpgsql AS $$
DECLARE
    sale_record JSONB;
    product_record RECORD;
    new_stock INTEGER;
    sale_uuid UUID;
BEGIN
    -- Validate payment method
    IF p_payment_method NOT IN ('cash', 'card', 'mobile', 'other') THEN
        RAISE EXCEPTION 'Invalid payment method: %', p_payment_method;
    END IF;

    -- Process each sale item
    FOR sale_record IN SELECT * FROM jsonb_array_elements(p_sales) LOOP
        -- Extract sale data
        sale_uuid := gen_random_uuid();

        -- Get product and check stock
        SELECT id, name, stock INTO product_record
        FROM products
        WHERE id = (sale_record->>'product_id')::UUID
        FOR UPDATE;

        -- Check if product exists
        IF NOT FOUND THEN
            RETURN NEXT (
                sale_uuid,
                (sale_record->>'product_id')::UUID,
                NULL,
                (sale_record->>'qty')::INTEGER,
                (sale_record->>'unit_price')::DECIMAL(10,2),
                0,
                p_payment_method,
                NOW(),
                FALSE,
                'Product not found'
            );
            CONTINUE;
        END IF;

        -- Check stock availability
        IF product_record.stock < (sale_record->>'qty')::INTEGER THEN
            RETURN NEXT (
                sale_uuid,
                product_record.id,
                product_record.name,
                (sale_record->>'qty')::INTEGER,
                (sale_record->>'unit_price')::DECIMAL(10,2),
                0,
                p_payment_method,
                NOW(),
                FALSE,
                format('Insufficient stock. Available: %s, Requested: %s', product_record.stock, (sale_record->>'qty')::INTEGER)
            );
            CONTINUE;
        END IF;

        -- Calculate new stock
        new_stock := product_record.stock - (sale_record->>'qty')::INTEGER;

        -- Insert sale record
        INSERT INTO sales (
            id,
            product_id,
            qty,
            unit_price,
            payment_method
        ) VALUES (
            sale_uuid,
            product_record.id,
            (sale_record->>'qty')::INTEGER,
            (sale_record->>'unit_price')::DECIMAL(10,2),
            p_payment_method
        );

        -- Update product stock and status
        UPDATE products SET
            stock = new_stock,
            status = CASE
                WHEN new_stock = 0 THEN 'Out of Stock'
                WHEN new_stock <= 10 THEN 'Low Stock'
                ELSE 'In Stock'
            END
        WHERE id = product_record.id;

        -- Return success result
        RETURN NEXT (
            sale_uuid,
            product_record.id,
            product_record.name,
            (sale_record->>'qty')::INTEGER,
            (sale_record->>'unit_price')::DECIMAL(10,2),
            ((sale_record->>'qty')::INTEGER * (sale_record->>'unit_price')::DECIMAL(10,2)),
            p_payment_method,
            NOW(),
            TRUE,
            'Sale processed successfully'
        );

    END LOOP;

END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION process_bulk_sales TO authenticated;
GRANT EXECUTE ON FUNCTION process_bulk_sales TO service_role;