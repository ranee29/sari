'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Search, ShoppingCart, Receipt, CreditCard, Smartphone, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  type: string
}

interface CartItem extends Product {
  cartId: string
  quantity: number
  subtotal: number
}

interface SaleRecord {
  id: string
  product_id: string
  product_name: string
  qty: number
  unit_price: number
  subtotal: number
  payment_method: string
  sale_date: string
}

export default function NewSaleClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [recentSale, setRecentSale] = useState<SaleRecord | null>(null)
  const { toast } = useToast()

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products/list')
        if (!response.ok) throw new Error('Failed to fetch products')

        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
        toast({
          title: 'Error',
          description: 'Failed to load products',
          variant: 'destructive',
        })
      }
    }

    fetchProducts()
  }, [toast])

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Add product to cart with stock validation
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
      // Check if adding one more would exceed stock
      const newQuantity = existingItem.quantity + 1
      if (newQuantity > product.stock) {
        toast({
          title: 'Insufficient Stock',
          description: `Only ${product.stock} ${product.name} available in stock`,
          variant: 'destructive',
        })
        return
      }

      // Update quantity if item already in cart
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
          : item
      ))
    } else {
      // Check if product is in stock
      if (product.stock < 1) {
        toast({
          title: 'Out of Stock',
          description: `${product.name} is currently out of stock`,
          variant: 'destructive',
        })
        return
      }

      // Add new item to cart
      setCart([...cart, {
        ...product,
        cartId: Date.now().toString(),
        quantity: 1,
        subtotal: product.price
      }])
    }
  }

  // Update item quantity in cart with stock validation
  const updateQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(cartId)
      return
    }

    const cartItem = cart.find(item => item.cartId === cartId)
    if (!cartItem) return

    // Check if new quantity exceeds available stock
    if (newQuantity > cartItem.stock) {
      toast({
        title: 'Insufficient Stock',
        description: `Only ${cartItem.stock} ${cartItem.name} available in stock`,
        variant: 'destructive',
      })
      return
    }

    setCart(cart.map(item =>
      item.cartId === cartId
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
        : item
    ))
  }

  // Remove item from cart
  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId))
  }

  // Calculate totals
  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Process sale
  const processSale = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Please add items to the cart before processing sale',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)

    try {
      // Final stock validation before processing
      const stockValidation = cart.filter(item => item.quantity > item.stock)
      if (stockValidation.length > 0) {
        const invalidItems = stockValidation.map(item =>
          `${item.name} (requested: ${item.quantity}, available: ${item.stock})`
        ).join(', ')

        toast({
          title: 'Stock Availability Changed',
          description: `Some items no longer have sufficient stock: ${invalidItems}`,
          variant: 'destructive',
        })
        return
      }

      // Prepare bulk sales data
      const salesData = cart.map(item => ({
        product_id: item.id,
        qty: item.quantity,
        unit_price: item.price
      }))

      // Process all sales in a single request
      const response = await fetch('/api/sales/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sales: salesData,
          payment_method: paymentMethod
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process sale')
      }

      const result = await response.json()

      // Check if the bulk operation was successful
      if (!result.success) {
        throw new Error(result.error || 'Failed to process sale')
      }

      // Show success message
      toast({
        title: 'Sale completed successfully',
        description: `Total: ₱${cartTotal.toFixed(2)} - ${cartTotalItems} items sold`,
      })

      // Store recent sale for receipt display
      setRecentSale({
        id: Date.now().toString(),
        product_id: '',
        product_name: `${cartTotalItems} items`,
        qty: cartTotalItems,
        unit_price: cartTotal / cartTotalItems,
        subtotal: cartTotal,
        payment_method: paymentMethod,
        sale_date: new Date().toISOString()
      })

      // Clear cart and show success
      setCart([])
      setShowSuccess(true)

      // Refresh products
      try {
        const response = await fetch('/api/admin/products/list')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
        }
      } catch (refreshError) {
        console.error('Error refreshing products:', refreshError)
      }

    } catch (error) {
      console.error('Error processing sale:', error)
      toast({
        title: 'Error processing sale',
        description: 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Payment method icons
  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: DollarSign, color: 'text-green-600' },
    { value: 'card', label: 'Card', icon: CreditCard, color: 'text-blue-600' },
    { value: 'mobile', label: 'Mobile', icon: Smartphone, color: 'text-purple-600' },
    { value: 'other', label: 'Other', icon: Receipt, color: 'text-gray-600' }
  ]

  if (showSuccess && recentSale) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sale Complete!</h2>
            <p className="text-gray-600 mb-4">Transaction processed successfully</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Items Sold:</span>
                <span className="font-semibold">{recentSale.qty}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold">₱{recentSale.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-semibold capitalize">{recentSale.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold">{new Date(recentSale.sale_date).toLocaleTimeString()}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSuccess(false)}
              className="w-full rounded-lg bg-green-500 py-2 font-semibold text-white transition hover:bg-green-600"
            >
              New Sale
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 lg:p-8 bg-background-light dark:bg-background-dark">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Products Section */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Products</h2>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const isInCart = cart.some(item => item.id === product.id)
                  const cartItem = cart.find(item => item.id === product.id)

                  return (
                    <div
                      key={product.id}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                        isInCart
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 bg-white hover:border-green-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-green-500'
                      }`}
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{product.name}</h3>
                        {isInCart && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                            {cartItem?.quantity || 0}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{product.type}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="font-bold text-gray-900 dark:text-gray-100">₱{product.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Stock: {product.stock}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No products found</p>
                </div>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
              <div className="mb-6 flex items-center gap-2">
                <ShoppingCart className="text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Cart ({cartTotalItems})</h2>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">Click on products to add them</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.cartId} className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.quantity} x ₱{item.price.toFixed(2)}</p>
                          <p className={`text-xs ${item.stock <= item.quantity ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                            Stock: {item.stock} {item.stock <= item.quantity ? '(At Limit)' : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-gray-900">₱{item.subtotal.toFixed(2)}</p>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                updateQuantity(item.cartId, item.quantity - 1)
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                            >
                              -
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                updateQuantity(item.cartId, item.quantity + 1)
                              }}
                              disabled={item.quantity >= item.stock}
                              className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
                                item.quantity >= item.stock
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              +
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeFromCart(item.cartId)
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-md bg-red-100 text-red-500 transition hover:bg-red-200"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <h3 className="mb-3 text-sm font-medium text-gray-600">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon
                        return (
                          <button
                            key={method.value}
                            onClick={() => setPaymentMethod(method.value)}
                            className={`flex items-center justify-center gap-2 rounded-md border-2 p-3 text-sm font-semibold transition ${
                              paymentMethod === method.value
                                ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800'
                            }`}
                          >
                            <Icon className="!text-xl" />
                            {method.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="my-6 border-t border-gray-200"></div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-500">
                      <p>Subtotal ({cartTotalItems} items):</p>
                      <p className="font-medium text-gray-700">₱{cartTotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between font-bold text-gray-800">
                      <p>Total:</p>
                      <p className="text-green-500">₱{cartTotal.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Process Sale Button */}
                  <button
                    onClick={processSale}
                    disabled={isProcessing || cart.length === 0}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isProcessing ? 'Processing...' : 'Process Sale'}
                  </button>
                </>
              )}
            </div>
          </div>
      </div>
    </div>
  )
}