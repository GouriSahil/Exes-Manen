"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Skeleton for navbar while loading */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-muted rounded-2xl animate-pulse" />
              <div>
                <div className="h-6 w-32 bg-muted rounded animate-pulse mb-1" />
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-8">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              <div className="h-10 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <div>
      <Navbar />
    </div>
  );
}
