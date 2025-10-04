'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCountries } from '@/hooks/useCountries';
import { useAuthStore } from '@/stores';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization_name: "",
    country: "",
    currency_code: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();

  // Use the countries hook
  const {
    data: countries,
    isLoading: countriesLoading,
    error: countriesError,
  } = useCountries();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.organization_name.trim()) {
      newErrors.organization_name = "Organization name is required";
    }

    if (!formData.country) {
      newErrors.country = "Please select your country";
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
      // Get currency code from selected country
      const selectedCountry = countries?.find(
        (c) => c.code === formData.country
      );
      const currencyCode = selectedCountry?.currency || "USD";

      await register({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        organization_name: formData.organization_name,
        country: formData.country,
        currency_code: currencyCode,
      });

      // Redirect to dashboard or home page
      router.push("/");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  if (!isMounted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
        <div className='max-w-lg w-full space-y-8 relative'>
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
          <div className='w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl p-6'>
            <div className='animate-pulse'>
              <div className='h-8 bg-muted rounded mb-4'></div>
              <div className='h-4 bg-muted rounded mb-6'></div>
              <div className='space-y-4'>
                <div className='h-12 bg-muted rounded'></div>
                <div className='h-12 bg-muted rounded'></div>
                <div className='h-12 bg-muted rounded'></div>
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="max-w-lg w-full space-y-8 relative">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Create Your Organization
            </h1>
            <p className="text-muted-foreground">
              Set up your organization and become the admin
            </p>
          </div>
        </div>

        {/* Signup Form */}
        <div className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Organization Setup
            </h2>
            <p className="text-muted-foreground">
              Create your organization and admin account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                  👤
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                  📧
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Organization Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Organization Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                  🏢
                </span>
                <input
                  type="text"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleInputChange}
                  placeholder="Enter your organization name"
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              {errors.organization_name && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.organization_name}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                  🔒
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                  🔐
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Country Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Country <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                  🌍
                </span>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={countriesLoading}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                >
                  <option value="" suppressHydrationWarning>
                    {countriesLoading
                      ? "⏳ Loading countries..."
                      : "🌍 Select your country"}
                  </option>
                  {countries?.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.country && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.country}
                </p>
              )}
              {formData.country && !countriesLoading && (
                <p
                  className="text-sm text-muted-foreground"
                  suppressHydrationWarning
                >
                  {(() => {
                    const country = countries?.find(
                      (c) => c.code === formData.country
                    );
                    return country
                      ? `Currency: ${country.currency} (${country.currencySymbol})`
                      : "Currency information not available";
                  })()}
                </p>
              )}
            </div>

            {countriesError && (
              <div
                className="relative w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:bg-red-950 dark:text-red-100 dark:border-red-800"
                suppressHydrationWarning
              >
                <strong>Error:</strong> Failed to load countries. Please refresh
                the page.
              </div>
            )}

            {/* Submit Error */}
            {error && (
              <div
                className="relative w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:bg-red-950 dark:text-red-100 dark:border-red-800"
                suppressHydrationWarning
              >
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 px-6 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading && (
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-neutral-900 text-muted-foreground">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link
              href="/login"
              className="inline-block font-semibold text-primary-600 hover:text-primary-500 transition-colors hover:underline text-lg text-center"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
