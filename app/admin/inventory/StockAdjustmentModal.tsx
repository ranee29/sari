'use client';

import { useState, useEffect } from 'react';
import { X, Package, Plus, Minus, Search, Info, ShoppingCart, ArrowRight, Filter, Grid3X3, List } from 'lucide-react';
import { ProductWithType, ApiResponse } from '@/lib/types';

interface StockAdjustmentModalProps {
  product: ProductWithType | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface CartItem {
  product_id: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  current_stock: number;
  quantity_change: number;
  transaction_type: 'restock' | 'adjustment';
  cost: number;
  price: number;
}

export default function StockAdjustmentModal({ product, onClose, onSuccess }: StockAdjustmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductWithType[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    if (!product) {
      fetchProducts();
    } else {
      setCart([{
        product_id: product.id,
        name: product.name,
        sku: 'N/A',
        category: product.product_type?.name || 'Uncategorized',
        supplier: 'Unknown',
        current_stock: product.stock,
        quantity_change: 0,
        transaction_type: 'restock',
        cost: product.cost,
        price: product.price
      }]);
      setShowCart(true);
    }
  }, [product]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/inventory?limit=100');
      const result: ApiResponse<{ data: ProductWithType[] }> = await response.json();

      if (result.success && result.data?.data) {
        setProducts(result.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      alert('Failed to load products for adjustment');
    }
  };

  const addToCart = (product: ProductWithType) => {
    const existsInCart = cart.find(item => item.product_id === product.id);

    if (existsInCart) {
      alert('This product is already in your cart');
      return;
    }

    const cartItem: CartItem = {
      product_id: product.id,
      name: product.name,
      sku: 'N/A',
      category: product.product_type?.name || 'Uncategorized',
      supplier: 'Unknown',
      current_stock: product.stock,
      quantity_change: 0,
      transaction_type: 'restock',
      cost: product.cost,
      price: product.price
    };

    setCart([...cart, cartItem]);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(cart.map(item =>
      item.product_id === productId
        ? { ...item, quantity_change: Math.max(-item.current_stock, quantity) }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => cart.length;
  const getTotalChanges = () => cart.filter(item => item.quantity_change !== 0).length;

  const calculateNewStock = (current: number, change: number) => {
    return Math.max(0, current + change);
  };

  const getFilteredProducts = () => {
    let filtered = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.product_type?.name.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.product_type?.name === selectedCategory);
    }

    return filtered;
  };

  const getCategories = () => {
    const categories = new Set(products.map(p => p.product_type?.name || 'Uncategorized'));
    return Array.from(categories);
  };

  const isMobile = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024; // lg breakpoint
    }
    return false;
  };

  useEffect(() => {
    const handleResize = () => {
      if (isMobile() && showCart) {
        setShowCart(false); // Auto-hide cart on mobile when switching to product list
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showCart]);

  const validateCart = () => {
    if (cart.length === 0) {
      alert('Please add products to your cart first');
      return false;
    }

    const hasChanges = cart.some(item => item.quantity_change !== 0);
    if (!hasChanges) {
      alert('Please make stock adjustments for products in your cart');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCart()) {
      return;
    }

    setLoading(true);
    try {
      const validAdjustments = cart.filter(item => item.quantity_change !== 0);

      const stockAdjustments = validAdjustments.map(item => ({
        product_id: item.product_id,
        quantity_change: item.quantity_change,
        transaction_type: item.quantity_change >= 0 ? 'restock' : 'adjustment' as const,
        notes: 'Stock adjustment: ' + (item.quantity_change > 0 ? '+' : '') + item.quantity_change + ' units',
        adjustment_date: new Date().toISOString().split('T')[0]
      }));

      if (stockAdjustments.length > 0) {
        const response = await fetch('/api/admin/inventory', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adjustments: stockAdjustments }),
        });

        const result = await response.json();

        if (result.success) {
          alert('Stock updated successfully for ' + stockAdjustments.length + ' product(s)');
          onSuccess();
          onClose();
        } else {
          alert(result.error || 'Failed to update stock');
        }
      } else {
        alert('No stock changes to apply');
      }
    } catch (error) {
      console.error('Error processing updates:', error);
      alert('Failed to process stock adjustments');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatusBadge = (currentStock: number, quantityChange: number) => {
    const newStock = calculateNewStock(currentStock, quantityChange);
    if (newStock === 0) {
      return <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full font-medium">Out of Stock</span>;
    } else if (newStock <= 10) {
      return <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full font-medium">Low Stock</span>;
    } else {
      return <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">In Stock</span>;
    }
  };

  const filteredProducts = getFilteredProducts();
  const categories = getCategories();
  const isInCart = (productId: string) => cart.some(item => item.product_id === productId);

  if (!product && products.length === 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading Products
            </h3>
            <p className="text-gray-600">
              Please wait while we load your inventory...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-6 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Package className="w-6 h-6 text-card-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">
                {product ? 'Product Stock Adjustment' : 'Bulk Stock Adjustment'}
              </h1>
              <p className="text-card-foreground text-sm font-medium drop-shadow-lg">
                Select products and adjust inventory quantities
              </p>
            </div>
          </div>

          {/* Cart Badge */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative flex items-center gap-2 bg-card hover:bg-muted text-card-foreground border border-border px-4 py-2 rounded-lg transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium text-card-foreground">{getTotalItems()}</span>
              {getTotalChanges() > 0 && (
                <span className="absolute -top-2 -right-2 bg-foreground text-card text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {getTotalChanges()}
                </span>
              )}
            </button>
            <button
              onClick={onClose}
              className="text-card-foreground hover:text-muted-foreground transition-colors p-2 hover:bg-white/20 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Product Selection Area */}
            <div className={`${showCart && !isMobile() ? 'w-2/3' : 'w-full'} flex flex-col overflow-hidden border-r border-gray-200 ${isMobile() && showCart ? 'hidden' : ''} min-h-0`}>
              {/* Mobile Cart Toggle Button */}
              {cart.length > 0 && isMobile() && !showCart && (
                <div className="fixed bottom-4 right-4 z-50 lg:hidden">
                  <button
                    onClick={() => setShowCart(!showCart)}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="font-bold">{getTotalItems()}</span>
                    {getTotalChanges() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                        {getTotalChanges()}
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* Search and Filters */}
              {!product && (
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search by name, SKU, or category..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                        >
                          <Grid3X3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                        >
                          <List className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <button
                        onClick={() => setSelectedCategory('')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === ''
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === category
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Product Grid/List */}
              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                    <p className="text-gray-500">
                      {searchQuery ? 'Try adjusting your search terms' : 'No products available'}
                    </p>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
                    {filteredProducts.map((product) => {
                      const inCart = isInCart(product.id);
                      const cartItem = cart.find(item => item.product_id === product.id);

                      return viewMode === 'grid' ? (
                        <div
                          key={product.id}
                          className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                            inCart
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                                {product.name}
                              </h3>
                              <p className="text-xs text-gray-500 mb-2">
                                Type: {product.product_type?.name || 'Uncategorized'}
                              </p>
                            </div>
                            {getStockStatusBadge(product.stock, cartItem?.quantity_change || 0)}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div className="bg-gray-50 rounded p-2">
                              <span className="text-gray-600 text-xs block">Current Stock</span>
                              <span className="font-semibold text-gray-900">{product.stock}</span>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                              <span className="text-gray-600 text-xs block">Price</span>
                              <span className="font-semibold text-gray-900 text-xs truncate">
                                ₱{product.price.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {cartItem && (
                            <div className="bg-blue-50 rounded p-2 mb-3">
                              <span className="text-blue-700 text-xs block">New Stock</span>
                              <span className="font-bold text-blue-900">
                                {calculateNewStock(product.stock, cartItem.quantity_change)}
                              </span>
                            </div>
                          )}

                          <button
                            onClick={() => inCart ? removeFromCart(product.id) : addToCart(product)}
                            className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                              inCart
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {inCart ? 'Remove from Cart' : (
                              <>
                                <ShoppingCart className="w-4 h-4 inline mr-2" />
                                Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div
                          key={product.id}
                          className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                            inCart
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                  {getStockStatusBadge(product.stock, cartItem?.quantity_change || 0)}
                                </div>
                                <p className="text-sm text-gray-500 mb-2">
                                  Type: {product.product_type?.name || 'Uncategorized'} | Price: ₱{product.price.toFixed(2)}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-gray-600">Current Stock: <strong>{product.stock}</strong></span>
                                  {cartItem && (
                                    <span className="text-blue-600">New Stock: <strong>{calculateNewStock(product.stock, cartItem.quantity_change)}</strong></span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => inCart ? removeFromCart(product.id) : addToCart(product)}
                              className={`py-2 px-4 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                                inCart
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {inCart ? 'Remove' : (
                                <>
                                  <ShoppingCart className="w-4 h-4 inline mr-2" />
                                  Add
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Cart Sidebar */}
            {showCart && (
              <div className={`${isMobile() ? 'fixed inset-0 z-50 bg-white flex flex-col' : 'w-1/3 flex flex-col bg-muted border-l border-border'}`}>
                {/* Cart Header */}
                <div className="p-4 sm:p-6 border-b border-border bg-card flex justify-between items-center shadow-sm flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <ShoppingCart className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-card-foreground">
                        Adjustment Cart
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                  {isMobile() && (
                    <button
                      onClick={() => setShowCart(false)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Changes Summary */}
                {getTotalChanges() > 0 && (
                  <div className="px-4 sm:px-6 py-3 bg-success-50 border-b border-success-200 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                      <p className="text-sm font-medium text-success-600">
                        {getTotalChanges()} {getTotalChanges() === 1 ? 'product' : 'products'} ready for adjustment
                      </p>
                    </div>
                  </div>
                )}

                {/* Cart Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 sm:p-6">
                    {cart.length === 0 ? (
                      <div className="text-center py-8 sm:py-12">
                        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-base font-semibold text-card-foreground mb-2">Your cart is empty</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                          Browse products and add them to your cart to make stock adjustments
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => {
                          const newStock = calculateNewStock(item.current_stock, item.quantity_change);
                          const hasChange = item.quantity_change !== 0;
                          const isIncrease = item.quantity_change > 0;
                          const isDecrease = item.quantity_change < 0;

                          return (
                            <div key={item.product_id} className={`card card-hover p-4 ${hasChange ? 'ring-2 ring-primary-200 bg-primary-50/30' : ''}`}>
                              {/* Product Header */}
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1 pr-2">
                                  <h4 className="font-semibold text-card-foreground text-sm leading-tight mb-1">
                                    {item.name}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">SKU: {item.sku || 'N/A'}</span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">{item.category}</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.product_id)}
                                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                                >
                                  <X className="w-4 h-4 text-muted-foreground group-hover:text-red-500" />
                                </button>
                              </div>

                              {/* Stock Status */}
                              <div className="grid grid-cols-3 gap-3 mb-3">
                                <div className="text-center p-2 bg-muted rounded-lg">
                                  <div className="text-xs text-muted-foreground mb-1">Current</div>
                                  <div className="font-semibold text-card-foreground">{item.current_stock}</div>
                                </div>
                                <div className={`text-center p-2 rounded-lg ${hasChange ? (isIncrease ? 'bg-success-100' : 'bg-warning-100') : 'bg-muted'}`}>
                                  <div className="text-xs text-muted-foreground mb-1">Change</div>
                                  <div className={`font-semibold ${hasChange ? (isIncrease ? 'text-success-600' : 'text-warning-600') : 'text-card-foreground'}`}>
                                    {item.quantity_change > 0 ? '+' : ''}{item.quantity_change}
                                  </div>
                                </div>
                                <div className={`text-center p-2 rounded-lg ${newStock === 0 ? 'bg-error-100' : newStock <= 10 ? 'bg-warning-100' : 'bg-success-100'}`}>
                                  <div className="text-xs text-muted-foreground mb-1">New Stock</div>
                                  <div className={`font-semibold ${newStock === 0 ? 'text-error-600' : newStock <= 10 ? 'text-warning-600' : 'text-success-600'}`}>
                                    {newStock}
                                  </div>
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(item.product_id, item.quantity_change - 1)}
                                  disabled={newStock <= 0}
                                  className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Minus className="w-4 h-4 text-card-foreground" />
                                </button>
                                <div className="flex-1 relative">
                                  <input
                                    type="number"
                                    value={item.quantity_change}
                                    onChange={(e) => updateCartQuantity(item.product_id, parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 text-center border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    min={-item.current_stock}
                                  />
                                  {hasChange && (
                                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isIncrease ? 'bg-success-500' : 'bg-warning-500'} animate-pulse`}></div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(item.product_id, item.quantity_change + 1)}
                                  className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"
                                >
                                  <Plus className="w-4 h-4 text-card-foreground" />
                                </button>
                              </div>

                              {/* Change Type Badge */}
                              {hasChange && (
                                <div className="mt-3 flex justify-center">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isIncrease ? 'bg-success-100 text-success-600' : isDecrease ? 'bg-warning-100 text-warning-600' : 'bg-primary-100 text-primary-600'}`}>
                                    {isIncrease ? 'Restock' : isDecrease ? 'Adjustment' : 'No Change'}: {Math.abs(item.quantity_change)} units
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cart Footer */}
                {cart.length > 0 && (
                  <div className="p-4 sm:p-6 border-t border-border bg-card shadow-lg flex-shrink-0">
                    <form onSubmit={handleSubmit} className="space-y-3">
                      {/* Summary Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 bg-muted rounded-lg text-center">
                          <div className="text-xs text-muted-foreground mb-1">Total Items</div>
                          <div className="text-lg font-bold text-card-foreground">{getTotalItems()}</div>
                        </div>
                        <div className="p-3 bg-primary-100 rounded-lg text-center">
                          <div className="text-xs text-primary-600 mb-1">With Changes</div>
                          <div className="text-lg font-bold text-primary-600">{getTotalChanges()}</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={clearCart}
                          className="flex-1 btn-secondary"
                        >
                          Clear Cart
                        </button>
                        <button
                          type="submit"
                          disabled={loading || getTotalChanges() === 0}
                          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              Apply Changes
                              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                                {getTotalChanges()}
                              </span>
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}