'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginInput } from '@/lib/supabase/schema'
import { signIn } from '@/lib/auth/config'
import { useToast } from '@/components/ui/use-toast'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)

    try {
      const authData = await signIn(data.email, data.password)

      if (authData.user) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
          variant: 'success',
        })

        // Small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 500))

        // Use Next.js router for proper navigation
        // All users go to dashboard first, server will redirect admins to /admin
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid email or password.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading-3 text-center">Sign in to your account</h2>
        <p className="mt-2 text-center text-text-secondary">
          Or{' '}
          <Link
            href="/auth/register"
            className="font-medium text-primary-500 hover:text-primary-600"
          >
            create a new account
          </Link>
        </p>
      </div>

      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Input
          label="Email address"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          {...form.register('email')}
          error={form.formState.errors.email?.message}
        />

        <div className="form-field">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={cn(
                'input pr-10',
                form.formState.errors.password?.message && 'border-error-500 focus:ring-error-500'
              )}
              {...form.register('password')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {form.formState.errors.password?.message && (
            <p className="form-error">{form.formState.errors.password?.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-bg-300 text-primary-500 focus:ring-primary-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-primary-500 hover:text-primary-600"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}