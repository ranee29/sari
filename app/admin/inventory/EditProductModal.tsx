'use client';

import { useState, useEffect } from 'react';
import { X, Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { ProductWithType, ProductFormData, ApiResponse } from '@/lib/types';

interface EditProductModalProps {
  product: ProductWithType;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProductModal({ product, onClose, onSuccess }: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: product.name,
    description: product.description || '',
    type_id: product.type_id || '',
    cost: product.cost,
    price: product.price,
    stock: product.stock
  });
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    try {
      const response = await fetch('/api/admin/product-types');
      const result: ApiResponse<any[]> = await response.json();

      if (result.success && result.data) {
        setProductTypes(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch product types:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (formData.cost < 0) {
      newErrors.cost = 'Cost cannot be negative';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (formData.price < formData.cost) {
      newErrors.price = 'Price must be greater than or equal to cost';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        alert('Product updated successfully');
        onSuccess();
        onClose();
      } else {
        alert(result.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const formatCurrency = (value: number) => {
    return `₱${value.toFixed(2)}`;
  };

  const calculateMargin = (cost: number, price: number) => {
    if (price <= 0) return 0;
    return ((price - cost) / price) * 100;
  };

  const calculateProfit = (cost: number, price: number) => {
    return price - cost;
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 40) return "text-green-600 bg-green-50 border-green-200";
    if (margin >= 20) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const suggestedPrice = formData.cost > 0 ? formData.cost * 1.25 : formData.price; // 25% margin suggestion

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block w-full max-w-2xl p-8 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Edit Product</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Info */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product description (optional)"
                />
              </div>

              <div>
                <label htmlFor="type_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="type_id"
                  value={formData.type_id}
                  onChange={(e) => handleChange('type_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {productTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock *
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    id="stock"
                    value={formData.stock}
                    onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                  />
                </div>
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                )}
              </div>

              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    id="cost"
                    value={formData.cost}
                    onChange={(e) => handleChange('cost', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.cost ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    min="0"
                  />
                </div>
                {errors.cost && (
                  <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">What you pay for this item</p>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    min="0"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">What customers pay for this item</p>
                {formData.cost > 0 && (
                  <button
                    type="button"
                    onClick={() => handleChange('price', suggestedPrice)}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Suggest price for 25% margin ({formatCurrency(suggestedPrice)})
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Profit Margin Analysis */}
            {formData.cost > 0 && formData.price > 0 && (
              <div className={`p-4 border rounded-lg ${getMarginColor(calculateMargin(formData.cost, formData.price))}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <h4 className="text-sm font-semibold">Profit Analysis</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    calculateMargin(formData.cost, formData.price) >= 40 ? 'bg-white text-green-600' :
                    calculateMargin(formData.cost, formData.price) >= 20 ? 'bg-white text-yellow-600' :
                    'bg-white text-red-600'
                  }`}>
                    {calculateMargin(formData.cost, formData.price).toFixed(1)}% margin
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white/50 p-3 rounded-lg">
                    <p className="text-xs opacity-75">Profit per Unit</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(calculateProfit(formData.cost, formData.price))}
                    </p>
                  </div>
                  <div className="bg-white/50 p-3 rounded-lg">
                    <p className="text-xs opacity-75">Total Profit Potential</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(calculateProfit(formData.cost, formData.price) * formData.stock)}
                    </p>
                  </div>
                  <div className="bg-white/50 p-3 rounded-lg">
                    <p className="text-xs opacity-75">Markup</p>
                    <p className="text-lg font-bold">
                      {((calculateProfit(formData.cost, formData.price) / formData.cost) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Margin Recommendation */}
                {calculateMargin(formData.cost, formData.price) < 20 && (
                  <div className="mt-3 p-2 bg-white/70 rounded-lg">
                    <p className="text-xs font-medium">
                      💡 <strong>Recommendation:</strong> Consider increasing your price to achieve at least a 20% profit margin.
                      {formData.cost > 0 && (
                        <span> Suggested price: {formatCurrency(formData.cost * 1.25)} for 25% margin.</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Warning for price < cost */}
            {formData.price < formData.cost && formData.price > 0 && formData.cost > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900">Price Warning</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      The selling price is lower than the cost price. This will result in a loss of{' '}
                      {formatCurrency(formData.cost - formData.price)} per unit.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Stock Status</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Current: {product.stock} units → New: {formData.stock} units
                  </p>
                </div>
                <div>
                  {formData.stock === 0 ? (
                    <span className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                      Out of Stock
                    </span>
                  ) : formData.stock <= 10 ? (
                    <span className="px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
                      Low Stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                      In Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}