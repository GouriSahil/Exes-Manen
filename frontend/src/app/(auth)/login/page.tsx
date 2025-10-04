'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Alert,
  useToast,
} from '@/components/ui';
import { useAuthStore } from '@/stores';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { addToast } = useToast();
  const { login, isLoading, error } = useAuthStore();

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

      addToast({
        variant: 'success',
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
      });

      // Redirect to dashboard or home page
      router.push('/');
    } catch (error) {
      addToast({
        variant: 'destructive',
        title: 'Login Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred during login.',
      });
    }
  };

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
        <Card className='w-full shadow-2xl border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-bold'>Sign In</CardTitle>
            <p className='text-muted-foreground'>
              Enter your credentials to access your account
            </p>
          </CardHeader>
          <CardContent>
            <form className='space-y-6' onSubmit={handleSubmit}>
              {/* Email Field */}
              <Input
                label='Email Address'
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Enter your email'
                error={errors.email}
                leftIcon='📧'
                required
              />

              {/* Password Field */}
              <Input
                label='Password'
                type='password'
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                placeholder='Enter your password'
                error={errors.password}
                leftIcon='🔒'
                required
              />

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
                <Alert
                  variant='destructive'
                  title='Error'
                  description={error}
                />
              )}

              {/* Login Button */}
              <Button
                type='submit'
                className='w-full'
                size='lg'
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
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
              className='inline-block font-semibold text-primary-600 hover:text-primary-500 transition-colors hover:underline text-lg'
            >
              Create an account
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
