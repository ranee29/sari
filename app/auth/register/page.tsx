'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerSchema, type RegisterInput } from '@/lib/supabase/schema'
import { signUp } from '@/lib/auth/config'
import { useToast } from '@/components/ui/use-toast'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      full_name: '',
      phone: '',
    },
  })

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true)

    try {
      await signUp(data.email, data.password, data.full_name)
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
        variant: 'success',
      })
      router.push('/auth/login')
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Unable to create your account.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading-3 text-center">Create your account</h2>
        <p className="mt-2 text-center text-text-secondary">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-primary-500 hover:text-primary-600"
          >
            Sign in
          </Link>
        </p>
      </div>

      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Input
          label="Full name"
          type="text"
          placeholder="Enter your full name"
          {...form.register('full_name')}
          error={form.formState.errors.full_name?.message}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="Enter your email"
          {...form.register('email')}
          error={form.formState.errors.email?.message}
        />

        <Input
          label="Phone number"
          type="tel"
          placeholder="09XXXXXXXXX"
          helperText="Optional - for order notifications"
          {...form.register('phone')}
          error={form.formState.errors.phone?.message}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          helperText="Must be at least 6 characters long"
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />

        <div className="flex items-center">
          <input
            id="agree-terms"
            name="agree-terms"
            type="checkbox"
            required
            className="h-4 w-4 rounded border-bg-300 text-primary-500 focus:ring-primary-500"
          />
          <label htmlFor="agree-terms" className="ml-2 block text-sm text-text-secondary">
            I agree to the{' '}
            <Link href="/terms" className="text-primary-500 hover:text-primary-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-500 hover:text-primary-600">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-bg-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-text-muted">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" type="button" disabled>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 1.86-4.907 1.86-3.613 0-6.827-2.4-7.933-5.787l-3.093 1.067c1.387 4.32 5.573 7.333 10.267 7.333 3.173 0 5.867-1.12 7.827-3.013.96-.96 1.68-2.213 2.133-3.653h-7.84z" />
            </svg>
            Google
          </Button>

          <Button variant="outline" type="button" disabled>
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </Button>
        </div>
      </div>
    </div>
  )
}