
# ✅ **FULL SYSTEM FEATURES (UPDATED)**

Mini-Grocery Ordering & Pickup System
Customer → places order → picks up → admin updates status.

---

# **1) User / Customer Features**

## **1.1 Account System**

* Customer can **create an account**
* Login / Logout
* Update profile information
* View order history
* View pre-order history
* Recover/Reset password (optional future feature)

---

# **2) Product Management (Admin)**

## **2.1 Product Types / Categories**

Admin can create product types such as:

* Beverages
* Snacks
* Meat
* Frozen
* Household
* Etc.

## **2.2 Product Management**

Admin can:

* Add new product
* Edit product details
* Delete products
* Update stock
* Update cost & selling price

## **Product Fields**

| Field           | Description             |
| --------------- | ----------------------- |
| product_type_id | Category (FK)           |
| name            | Product name            |
| description     | Optional                |
| cost            | How much the store pays |
| price           | Selling price           |
| stock           | Live inventory count    |
| created_at      | Timestamp               |
| updated_at      | Timestamp               |

**No product images** (your request)

---

# **3) Inventory System**

✔ Stocks automatically deducted **AFTER payment only**
✔ Real-time stock levels
✔ Admin can restock items
✔ Low-stock threshold alert (future feature)

---

# **4) Order Processing (Paid Orders)**

## **4.1 Creating Orders (Customer)**

Customer can:

* View products and stock availability
* Add items to cart
* Checkout (pay later or pay immediately depending on your payments)
* Order is created
* Stock is deducted **after payment**

## **4.2 Order States**

Order status workflow:

1. **pending** → customer submits order
2. **paid** → payment confirmed
3. **ready_for_pickup** → admin marks it
4. **completed** → customer picked up order
5. **cancelled** → if needed

---

# **5) Order Items**

Each order has multiple items:

* product_id
* quantity
* unit_price
* subtotal

---

# **6) Pre-Orders / Reservations (Pickup System)**

Pre-orders behave like orders but:

✔ **Do NOT deduct stock until payment**
✔ Acts like “reservation” or “pickup list”
✔ Admin manages them separately

### Pre-Order flow:

1. Customer creates pre-order (no stock deducted yet)
2. Admin reviews
3. Customer pays
4. Stock deducted only AFTER payment
5. Admin marks **ready for pickup**
6. Customer picks up → admin marks **completed**

**Pre-Order tables match Orders and Order_Items 1:1**

---

# **7) Admin Dashboard**

## **7.1 Order Management**

Admin can:

* View all orders
* Filter by status
* Mark as **Ready for Pickup**
* Mark as **Completed**
* Cancel orders
* Edit order items (optional future feature)

## **7.2 Pre-Order Management**

Admin can:

* View all pre-orders
* Approve or Cancel
* Mark as ready for pickup
* Move to “Completed”

---

# **8) Security / Access Control**

* Admin panel locked behind admin role
* Customers cannot access admin endpoints
* RLS (Row Level Security) for supabase (optional next step)

---

# **9) Reports (Future Feature)**

* Sales report
* Expenses vs Revenue (cost vs price)
* Top selling products
* Low stock alerts

---

# **10) Future Expandable Features**

The system is designed to allow adding:

* Discount coupons
* Delivery option
* Payment gateway integration (GCash, PayMaya, Stripe, etc.)
* Barcode scanning
* Product images
* Multi-branch setup


