"use client";

import React, { useState, useEffect } from "react";
import { X, Tag, DollarSign, TrendingUp, Save, Plus, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  cost: number;
  price: number;
  stock_quantity: number;
  category: string;
  supplier: string;
  updated_at: string;
}

interface PricingManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdatePricing: (productId: string, cost: number, price: number) => Promise<void>;
}

export default function PricingManagementModal({
  isOpen,
  onClose,
  products,
  onUpdatePricing
}: PricingManagementModalProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "category" | "price" | "margin">("name");
  const [bulkCost, setBulkCost] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter and sort products
  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "category":
          return a.category.localeCompare(b.category);
        case "price":
          return b.price - a.price;
        case "margin":
          const marginA = ((a.price - a.cost) / a.price) * 100;
          const marginB = ((b.price - b.cost) / b.price) * 100;
          return marginB - marginA;
        default:
          return 0;
      }
    });

  const calculateMargin = (cost: number, price: number) => {
    if (price <= 0) return 0;
    return ((price - cost) / price) * 100;
  };

  const calculateProfit = (cost: number, price: number) => {
    return price - cost;
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProducts(prev =>
      prev.find(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts);
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedProducts.length === 0 || !bulkCost || !bulkPrice) {
      alert("Please select products and enter both cost and price values");
      return;
    }

    setIsUpdating(true);
    try {
      const cost = parseFloat(bulkCost);
      const price = parseFloat(bulkPrice);

      if (isNaN(cost) || isNaN(price) || cost < 0 || price < 0) {
        throw new Error("Please enter valid positive numbers");
      }

      if (price <= cost) {
        throw new Error("Price must be greater than cost");
      }

      // Update all selected products
      await Promise.all(
        selectedProducts.map(product =>
          onUpdatePricing(product.id, cost, price)
        )
      );

      // Clear selection and inputs
      setSelectedProducts([]);
      setBulkCost("");
      setBulkPrice("");

      alert(`Successfully updated pricing for ${selectedProducts.length} products`);
    } catch (error) {
      console.error("Bulk pricing update failed:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to update pricing"}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 40) return "text-green-600 bg-green-50";
    if (margin >= 20) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Pricing Management</h2>
                <p className="text-green-100 text-sm">
                  Update product costs and prices with margin analysis
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/20 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <Tag className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Selected</p>
                  <p className="text-2xl font-bold">{selectedProducts.length}</p>
                </div>
                <Plus className="w-8 h-8 text-green-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avg Margin</p>
                  <p className="text-2xl font-bold">
                    {products.length > 0
                      ? (products.reduce((sum, p) => sum + calculateMargin(p.cost, p.price), 0) / products.length).toFixed(1)
                      : "0"}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Value</p>
                  <p className="text-2xl font-bold">
                    ₱{products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-500 opacity-20" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 border-b bg-white">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, SKU, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="name">Sort by Name</option>
                <option value="category">Sort by Category</option>
                <option value="price">Sort by Price</option>
                <option value="margin">Sort by Margin</option>
              </select>

              {/* Select All */}
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {selectedProducts.length === filteredProducts.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            {/* Bulk Update Controls */}
            {selectedProducts.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">Bulk Update {selectedProducts.length} Selected Products</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="number"
                    placeholder="New Cost (₱)"
                    value={bulkCost}
                    onChange={(e) => setBulkCost(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="New Price (₱)"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                    min="0"
                  />
                  <button
                    onClick={handleBulkUpdate}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isUpdating ? "Updating..." : "Update Pricing"}
                  </button>
                </div>
                {bulkCost && bulkPrice && (
                  <div className="mt-2 text-sm text-blue-700">
                    New Margin: {calculateMargin(parseFloat(bulkCost), parseFloat(bulkPrice)).toFixed(1)}% |
                    Profit per Unit: ₱{calculateProfit(parseFloat(bulkCost), parseFloat(bulkPrice)).toFixed(2)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Products Table */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Tag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                  <p className="text-gray-500">Try adjusting your search terms</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                              onChange={handleSelectAll}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Current Cost
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Current Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Margin
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => {
                          const margin = calculateMargin(product.cost, product.price);
                          const profit = calculateProfit(product.cost, product.price);
                          const isSelected = selectedProducts.find(p => p.id === product.id);

                          return (
                            <tr
                              key={product.id}
                              className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                                isSelected ? "bg-green-50" : ""
                              }`}
                              onClick={() => handleProductSelect(product)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={isSelected ? true : false}
                                  onChange={() => handleProductSelect(product)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {product.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      SKU: {product.sku}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                  {product.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₱{product.cost.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ₱{product.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className={`text-sm font-medium px-2 py-1 rounded-full inline-flex items-center justify-center ${getMarginColor(margin)}`}>
                                    {margin.toFixed(1)}%
                                  </span>
                                  <span className="text-xs text-gray-500 mt-1">
                                    ₱{profit.toFixed(2)} profit
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`text-sm ${
                                  product.stock_quantity > 10 ? 'text-green-600' :
                                  product.stock_quantity > 0 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {product.stock_quantity}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {selectedProducts.length > 0 && (
              <span>{selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected for bulk update</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}