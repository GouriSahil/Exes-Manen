'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCountries } from '@/hooks/useCountries';
import {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Alert,
  useToast,
} from '@/components/ui';
import { useAuthStore } from '@/stores';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { addToast } = useToast();
  const { register, isLoading, error } = useAuthStore();

  // Use the countries hook
  const {
    data: countries,
    isLoading: countriesLoading,
    error: countriesError,
  } = useCountries();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.country) {
      newErrors.country = 'Please select your country';
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
      await register(formData.email, formData.password, formData.name);

      addToast({
        variant: 'success',
        title: 'Account Created!',
        description: 'Your account has been created successfully. Welcome!',
      });

      // Redirect to dashboard or home page
      router.push('/');
    } catch (error) {
      addToast({
        variant: 'destructive',
        title: 'Signup Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred during signup.',
      });
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
      {/* Animated Background Elements */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float' />
      <div
        className='absolute bottom-20 right-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-float'
        style={{ animationDelay: '2s' }}
      />

      <div className='max-w-lg w-full space-y-8 relative'>
        {/* Header Section */}
        <div className='text-center space-y-4'>
          <div className='flex justify-center'>
            <div className='w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
                />
              </svg>
            </div>
          </div>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent'>
              Join Us Today
            </h1>
            <p className='text-muted-foreground'>
              Create your account and start your journey
            </p>
          </div>
        </div>

        {/* Signup Form */}
        <Card className='w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-bold'>Create Account</CardTitle>
            <p className='text-muted-foreground'>
              Create your account and start your journey
            </p>
          </CardHeader>
          <CardContent>
            <form className='space-y-6' onSubmit={handleSubmit}>
              {/* Name Field */}
              <Input
                label='Full Name'
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                placeholder='Enter your full name'
                error={errors.name}
                leftIcon='👤'
                required
              />

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
                placeholder='Create a password'
                error={errors.password}
                leftIcon='🔒'
                required
              />

              {/* Confirm Password Field */}
              <Input
                label='Confirm Password'
                type='password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder='Confirm your password'
                error={errors.confirmPassword}
                leftIcon='🔐'
                required
              />

              {/* Country Selection */}
              <Select
                label='Country'
                name='country'
                value={formData.country}
                onChange={handleInputChange}
                placeholder={
                  countriesLoading
                    ? '⏳ Loading countries...'
                    : '🌍 Select your country'
                }
                options={
                  countries?.map((country) => ({
                    value: country.code,
                    label: `${country.flag} ${country.name}`,
                  })) || []
                }
                error={errors.country}
                leftIcon='🌍'
                disabled={countriesLoading}
                helperText={
                  formData.country && !countriesLoading
                    ? (() => {
                        const country = countries?.find(
                          (c) => c.code === formData.country
                        );
                        return country
                          ? `Currency: ${country.currency} (${country.currencySymbol})`
                          : 'Currency information not available';
                      })()
                    : undefined
                }
              />

              {countriesError && (
                <Alert
                  variant='destructive'
                  title='Error'
                  description='Failed to load countries. Please refresh the page.'
                />
              )}

              {/* Submit Error */}
              {error && (
                <Alert
                  variant='destructive'
                  title='Error'
                  description={error}
                />
              )}

              {/* Signup Button */}
              <Button
                type='submit'
                className='w-full'
                size='lg'
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
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
                  Already have an account?
                </span>
              </div>
            </div>

            <Link
              href='/login'
              className='inline-block font-semibold text-primary-600 hover:text-primary-500 transition-colors hover:underline text-lg'
            >
              Sign in here
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
