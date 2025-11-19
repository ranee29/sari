'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminHeader({ title }: { title: string }) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8 dark:border-gray-700 dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-green-600">A</span>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Admin</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  )
}