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

  // Add product to cart
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
      // Update quantity if item already in cart
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      ))
    } else {
      // Add new item to cart
      setCart([...cart, {
        ...product,
        cartId: Date.now().toString(),
        quantity: 1,
        subtotal: product.price
      }])
    }
  }

  // Update item quantity in cart
  const updateQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(cartId)
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

            <Button
              onClick={() => setShowSuccess(false)}
              className="w-full btn-primary"
            >
              New Sale
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Products Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Products</h2>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => {
                  const isInCart = cart.some(item => item.id === product.id)
                  const cartItem = cart.find(item => item.id === product.id)

                  return (
                    <div
                      key={product.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        isInCart ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                        {isInCart && (
                          <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded-full">
                            {cartItem?.quantity || 0}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{product.type}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">₱{product.price.toFixed(2)}</span>
                        <span className={`text-sm ${product.stock <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                          Stock: {product.stock}
                        </span>
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
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart ({cartTotalItems})
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">Click on products to add them</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.cartId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-gray-500">₱{item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              updateQuantity(item.cartId, item.quantity - 1)
                            }}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              updateQuantity(item.cartId, item.quantity + 1)
                            }}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFromCart(item.cartId)
                            }}
                            className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon
                        return (
                          <button
                            key={method.value}
                            onClick={() => setPaymentMethod(method.value)}
                            className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                              paymentMethod === method.value
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${method.color}`} />
                            <span className="text-sm font-medium">{method.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal ({cartTotalItems} items):</span>
                      <span className="font-semibold">₱{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-primary-600">₱{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Process Sale Button */}
                  <Button
                    onClick={processSale}
                    disabled={isProcessing || cart.length === 0}
                    className="w-full btn-primary"
                    size="lg"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Process Sale'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}