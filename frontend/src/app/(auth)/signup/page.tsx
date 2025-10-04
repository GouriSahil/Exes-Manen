"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCountries } from "@/hooks/useCountries";
import { useAuthStore } from "@/stores";
import CustomSelect from "@/components/ui/CustomSelect";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization_name: "",
    country: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();

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

      router.push("/");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 flex items-center justify-center">
        <div className="w-full max-w-2xl animate-pulse p-8">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="h-4 bg-muted rounded mb-8"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-400/20 dark:bg-primary-500/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary-400/20 dark:bg-secondary-500/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl shadow-lg mb-4">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Create Your Organization
          </h1>
          <p className="text-muted-foreground">
            Set up your workspace and start managing expenses
          </p>
        </div>

        {/* Signup Card */}
        <div
          className="card glass p-8 animate-fadeInUp"
          style={{ animationDelay: "0.1s" }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two Column Layout for Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Full Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full px-4 py-3 border ${
                    errors.name
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  } rounded-lg bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email Address
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full px-4 py-3 border ${
                    errors.email
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  } rounded-lg bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Organization Name */}
            <div>
              <label
                htmlFor="organization_name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Organization Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="organization_name"
                name="organization_name"
                type="text"
                value={formData.organization_name}
                onChange={handleInputChange}
                className={`block w-full px-4 py-3 border ${
                  errors.organization_name
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-border focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                } rounded-lg bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200`}
                placeholder="Acme Corporation"
              />
              {errors.organization_name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.organization_name}
                </p>
              )}
            </div>

            {/* Country Selection */}
            <div>
              <CustomSelect
                label="Country"
                placeholder={
                  countriesLoading
                    ? "Loading countries..."
                    : "Select your country"
                }
                value={formData.country}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, country: value }));
                  if (errors.country) {
                    setErrors((prev) => ({ ...prev, country: "" }));
                  }
                }}
                options={
                  countries?.map((country) => ({
                    value: country.code,
                    label: `${country.flag} ${country.name}`,
                  })) || []
                }
                disabled={countriesLoading}
                error={!!errors.country}
                errorMessage={errors.country}
                required
                searchable
                size="md"
              />
              {formData.country && !countriesLoading && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {(() => {
                    const country = countries?.find(
                      (c) => c.code === formData.country
                    );
                    return country
                      ? `💰 Currency: ${country.currency} (${country.currencySymbol})`
                      : "";
                  })()}
                </p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Password
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full px-4 pr-10 py-3 border ${
                      errors.password
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-border focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    } rounded-lg bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Confirm Password
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`block w-full px-4 pr-10 py-3 border ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-border focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    } rounded-lg bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating organization...
                </>
              ) : (
                <>
                  Create Organization
                  <svg
                    className="ml-2 -mr-1 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Sign In Link */}
            <Link
              href="/login"
              className="btn-secondary w-full flex justify-center items-center"
            >
              Sign in instead
              <svg
                className="ml-2 -mr-1 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </form>
        </div>

        {/* Footer */}
        <p
          className="mt-8 text-center text-sm text-muted-foreground animate-fadeInUp"
          style={{ animationDelay: "0.2s" }}
        >
          © 2025 Exes Manen. All rights reserved.
        </p>
      </div>
    </div>
  );
}
