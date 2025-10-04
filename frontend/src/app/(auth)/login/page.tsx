'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      // Redirect to dashboard or home page
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (!isMounted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
        <div className='max-w-md w-full space-y-8 relative'>
          <div className='text-center'>
            <h1 className='text-4xl font-black text-foreground mb-2'>
              Welcome Back
            </h1>
            <p className='text-muted-foreground'>
              Sign in to your account to continue
            </p>
          </div>
          <div className='w-full shadow-2xl border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl p-6'>
            <div className='animate-pulse'>
              <div className='h-8 bg-muted rounded mb-4'></div>
              <div className='h-4 bg-muted rounded mb-6'></div>
              <div className='space-y-4'>
                <div className='h-12 bg-muted rounded'></div>
                <div className='h-12 bg-muted rounded'></div>
                <div className='h-12 bg-muted rounded'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
      {/* Animated Background Elements */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float' />
      <div
        className='absolute top-40 right-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-float'
        style={{ animationDelay: '2s' }}
      />

      <div className='max-w-md w-full space-y-8 relative'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-4xl font-black text-foreground mb-2'>
            Welcome Back
          </h1>
          <p className='text-muted-foreground'>
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <div className='w-full shadow-2xl border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl p-6'>
          {/* Header */}
          <div className='text-center mb-6'>
            <h2 className='text-2xl font-bold text-foreground mb-2'>Sign In</h2>
            <p className='text-muted-foreground'>
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form className='space-y-6' onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-foreground'>
                Email Address <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg'>
                  📧
                </span>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='Enter your email'
                  className='w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors'
                  required
                />
              </div>
              {errors.email && (
                <p className='text-sm text-red-600 dark:text-red-400'>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-foreground'>
                Password <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg'>
                  🔒
                </span>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder='Enter your password'
                  className='w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors'
                  required
                />
              </div>
              {errors.password && (
                <p className='text-sm text-red-600 dark:text-red-400'>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className='flex items-center justify-end'>
              <Link
                href='/forgot-password'
                className='text-sm text-primary-600 hover:text-primary-500 transition-colors hover:underline'
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Error */}
            {error && (
              <div
                className='relative w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:bg-red-950 dark:text-red-100 dark:border-red-800'
                suppressHydrationWarning
              >
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full h-12 px-6 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center'
            >
              {isLoading && (
                <svg
                  className='mr-2 h-4 w-4 animate-spin'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
              )}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className='mt-6 flex flex-col space-y-4'>
            <div className='relative w-full'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-border' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white dark:bg-neutral-900 text-muted-foreground'>
                  Don&apos;t have an account?
                </span>
              </div>
            </div>

            <Link
              href='/signup'
              className='inline-block font-semibold text-primary-600 hover:text-primary-500 transition-colors hover:underline text-lg text-center'
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
