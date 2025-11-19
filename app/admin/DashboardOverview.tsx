import { Package, ShoppingCart, Receipt, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardOverview() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome back!</h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Here's what's happening across your store today.</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/50">
                <ShoppingCart className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                <Receipt className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₱12,450</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/50">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock Count</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">7</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Latest Orders */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Orders</h3>
              <Link href="/admin/orders" className="text-sm font-medium text-green-600 hover:underline dark:text-green-400">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { id: '#ORD-001', customer: 'John Doe', total: '₱1,250', status: 'Pending', time: '2 mins ago' },
                { id: '#ORD-002', customer: 'Jane Smith', total: '₱850', status: 'Processing', time: '15 mins ago' },
                { id: '#ORD-003', customer: 'Mike Johnson', total: '₱2,100', status: 'Pending', time: '1 hour ago' },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">{order.total}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                    <Link
                      href={`/admin/orders/${order.id.substring(1)}`}
                      className="text-sm font-medium text-green-600 hover:underline dark:text-green-400"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Low Stock Alerts</h3>
              <Link href="/admin/inventory" className="text-sm font-medium text-green-600 hover:underline dark:text-green-400">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Fresh Tomatoes', current: 5, minimum: 10 },
                { name: 'Organic Lettuce', current: 3, minimum: 8 },
                { name: 'Free-Range Eggs', current: 12, minimum: 15 },
              ].map((product) => (
                <div key={product.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Current: {product.current} | Minimum: {product.minimum}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400">
                      Low Stock
                    </span>
                    <Link
                      href="/admin/inventory"
                      className="text-sm font-medium text-green-600 hover:underline dark:text-green-400"
                    >
                      Adjust Stock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Last 7 Days Revenue</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Sales chart would go here</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Integration with charting library needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}