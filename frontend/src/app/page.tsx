"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (prefersDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const features = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Multi-Level Approvals",
      description:
        "Configure complex approval workflows with conditional rules, percentage thresholds, and role-based routing.",
      color: "from-primary-500 to-primary-600",
      bgColor: "bg-primary-50 dark:bg-primary-900/20",
      iconColor: "text-primary-600 dark:text-primary-400",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Global Currency Support",
      description:
        "Automatic real-time currency conversion with support for 150+ currencies. Perfect for international teams.",
      color: "from-secondary-500 to-secondary-600",
      bgColor: "bg-secondary-50 dark:bg-secondary-900/20",
      iconColor: "text-secondary-600 dark:text-secondary-400",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "AI Receipt Scanning",
      description:
        "Upload receipt images and our AI extracts all details instantly. No more manual data entry.",
      color: "from-accent-success to-accent-success",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-accent-success",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Real-Time Updates",
      description:
        "Get instant notifications and live status updates. Know exactly where every expense stands.",
      color: "from-accent-warning to-accent-warning",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-accent-warning",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Role-Based Security",
      description:
        "Enterprise-grade security with granular permissions for Admins, Managers, and Employees.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "Advanced Analytics",
      description:
        "Comprehensive reports and insights to track spending patterns and optimize your budget.",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "$50M+", label: "Processed" },
    { value: "150+", label: "Countries" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-xl">EM</span>
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Exes Manen
                </span>
                <p className="text-xs text-muted-foreground">
                  Expense Management
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-foreground/80 hover:text-foreground transition-colors font-medium"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-foreground/80 hover:text-foreground transition-colors font-medium"
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="text-foreground/80 hover:text-foreground transition-colors font-medium"
              >
                Pricing
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  )}
                </button>
              )}

              <Link
                href="/login"
                className="hidden sm:block text-foreground hover:text-primary-600 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="max-w-7xl mx-auto relative flex-1 flex items-center">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-block mb-6 px-4">
              <span className="px-4 sm:px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full text-xs sm:text-sm font-semibold shadow-glow">
                🚀 Trusted by 10,000+ Companies
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 sm:mb-8 leading-tight">
              <span className="text-foreground">Expense Management</span>
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-base sm:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Streamline approvals, automate currency conversion, and scan
              receipts with AI. The modern way to manage expenses for growing
              teams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 w-full px-4 sm:px-0">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-6 py-3 sm:px-10 sm:py-5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold shadow-glow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg text-center"
              >
                Start Free Trial
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2 inline"
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
              <Link
                href="#demo"
                className="w-full sm:w-auto px-6 py-3 sm:px-10 sm:py-5 bg-white dark:bg-card text-foreground border-2 border-border rounded-xl font-semibold hover:border-primary-500 transition-all duration-300 text-base sm:text-lg group text-center"
              >
                Watch Demo
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2 inline group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto px-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 animate-scroll-bounce">
          <a
            href="#features"
            className="flex flex-col items-center text-muted-foreground hover:text-primary-600 transition-colors group cursor-pointer"
            aria-label="Scroll to features"
          >
            <span className="text-xs sm:text-sm font-medium mb-2 opacity-75 group-hover:opacity-100 transition-opacity">
              Scroll to explore
            </span>
            <div className="w-8 h-12 border-2 border-current rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
            </div>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="min-h-screen flex items-center py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-neutral-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
              Powerful Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 px-4">
              Everything You Need,{" "}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                All in One Place
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Built for modern teams who demand efficiency, security, and
              simplicity in their expense management workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-8 cursor-pointer group"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div
                  className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.iconColor}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform">
                  Learn More
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="min-h-screen flex items-center py-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 px-4">
              Get Started in{" "}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Three Easy Steps
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Sign Up & Configure",
                description:
                  "Create your account, set your company currency, and configure your approval workflows in minutes.",
                icon: (
                  <svg
                    className="w-12 h-12"
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
                ),
              },
              {
                step: "02",
                title: "Submit Expenses",
                description:
                  "Employees snap photos of receipts, AI extracts the data, and expenses are submitted instantly.",
                icon: (
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Approve & Track",
                description:
                  "Managers review and approve with one click. Track everything in real-time with complete visibility.",
                icon: (
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl text-white mb-8 shadow-glow">
                    {step.icon}
                  </div>
                  <div className="text-6xl sm:text-7xl font-black bg-gradient-to-br from-primary-600/20 to-secondary-600/20 dark:from-primary-400/20 dark:to-secondary-400/20 bg-clip-text text-transparent mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-1 bg-gradient-to-r from-primary-600/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen flex items-center py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="max-w-5xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
            Ready to Transform Your Expense Management?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-primary-50 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Join thousands of companies using Exes Manen to save time, reduce
            errors, and gain complete visibility into their spending.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full px-4 sm:px-0">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 py-3 sm:px-10 sm:py-5 bg-white text-primary-600 rounded-xl font-bold text-base sm:text-lg hover:scale-105 transition-transform shadow-2xl text-center"
            >
              <span className="hidden sm:inline">
                Start Free Trial - No Credit Card Required
              </span>
              <span className="sm:hidden">Start Free Trial</span>
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-3 sm:px-10 sm:py-5 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all text-center"
            >
              Talk to Sales
            </Link>
          </div>
          <p className="text-primary-100 text-sm mt-8">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 dark:bg-neutral-950 text-neutral-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-lg">EM</span>
                </div>
                <span className="text-xl font-bold text-white">Exes Manen</span>
              </div>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Modern expense management for modern teams. Streamline your
                workflow with intelligent automation and powerful insights.
              </p>
              <div className="flex space-x-4">
                {["twitter", "linkedin", "github"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-3">
                {["Features", "Pricing", "Demo", "Integrations", "Updates"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="hover:text-primary-400 transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {["About", "Blog", "Careers", "Contact", "Partners"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="hover:text-primary-400 transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-3">
                {["Privacy", "Terms", "Security", "Compliance", "Cookies"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="hover:text-primary-400 transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-neutral-500 text-sm">
                © 2025 Exes Manen. All rights reserved.
              </p>
              <p className="text-neutral-500 text-sm mt-4 md:mt-0">
                Made with ❤️ for modern teams
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
