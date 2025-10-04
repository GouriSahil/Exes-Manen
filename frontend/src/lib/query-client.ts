import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status
          if (status >= 400 && status < 500) {
            return false
          }
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
})

// Query keys factory
export const queryKeys = {
  // Auth
  auth: {
    user: ["auth", "user"] as const,
    profile: ["auth", "profile"] as const,
  },
  
  // Users
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  
  // Countries
  countries: {
    all: ["countries"] as const,
    lists: () => [...queryKeys.countries.all, "list"] as const,
    list: (filters: Record<string, any>) => [...queryKeys.countries.lists(), { filters }] as const,
    details: () => [...queryKeys.countries.all, "detail"] as const,
    detail: (code: string) => [...queryKeys.countries.details(), code] as const,
  },
  
  // Currency
  currency: {
    all: ["currency"] as const,
    rates: ["currency", "rates"] as const,
    convert: (from: string, to: string, amount: number) => 
      [...queryKeys.currency.all, "convert", { from, to, amount }] as const,
  },
} as const
