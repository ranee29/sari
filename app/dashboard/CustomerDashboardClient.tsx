'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function CustomerDashboardContent() {
  return (
    <>
      {/* Header */}
      <header className="flex h-16 lg:h-20 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600">C</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-gray-800 dark:text-white">Customer</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back</p>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">Welcome back!</h2>
            <p className="mt-1 text-sm lg:text-base text-gray-600 dark:text-gray-400">Here's what's happening with your orders and reservations.</p>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="rounded-xl bg-white p-4 lg:p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">12</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-4 lg:p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/50">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">3</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-4 lg:p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/50">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Completed</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">8</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-4 lg:p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Jan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 lg:mt-10">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
              <a href="/products" className="group">
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 lg:p-6 text-center transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="font-medium text-green-600 dark:text-green-400 text-sm lg:text-base">Browse Products</p>
                </div>
              </a>
              <a href="/dashboard/orders" className="group">
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 lg:p-6 text-center transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <p className="font-medium text-yellow-600 dark:text-yellow-400 text-sm lg:text-base">View Orders</p>
                </div>
              </a>
              <a href="/dashboard/settings" className="group">
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 lg:p-6 text-center transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8 text-purple-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="font-medium text-purple-600 dark:text-purple-400 text-sm lg:text-base">Update Profile</p>
                </div>
              </a>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mt-8 lg:mt-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
              <a href="/dashboard/orders" className="text-sm font-medium text-green-600 hover:underline dark:text-green-400">
                View all
              </a>
            </div>
            <div className="mt-4 flex items-center justify-center rounded-xl bg-white p-8 lg:p-16 text-center dark:bg-gray-800">
              <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400">No recent orders. Start shopping to see your order history here.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}