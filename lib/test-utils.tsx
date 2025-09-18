import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
        order: jest.fn(() => ({
          limit: jest.fn(),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(),
      })),
    })),
  })),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

// Create a test query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
})

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  }
}

// Mock API responses
export const mockApiResponses = {
  success: (data: any) => ({
    ok: true,
    status: 200,
    json: async () => data,
  }),
  
  error: (status: number = 500, message: string = 'Internal Server Error') => ({
    ok: false,
    status,
    json: async () => ({ error: message }),
  }),
  
  validationError: (errors: string[]) => ({
    ok: false,
    status: 400,
    json: async () => ({ 
      error: 'Validation failed',
      details: errors.join(', ')
    }),
  }),
}

// Mock user data
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  is_admin: false,
  created_at: '2024-01-01T00:00:00Z',
}

export const mockAdminUser = {
  ...mockUser,
  is_admin: true,
}

// Mock startup data
export const mockStartup = {
  id: 'test-startup-id',
  name: 'Test Startup',
  description: 'A test startup for testing purposes',
  industry: 'Technology',
  stage: 'Seed',
  funding_goal: 100000,
  current_funding: 25000,
  created_at: '2024-01-01T00:00:00Z',
  user_id: 'test-user-id',
}

// Mock investor data
export const mockInvestor = {
  id: 'test-investor-id',
  name: 'Test Investor',
  company: 'Test VC',
  investment_focus: 'Technology',
  min_investment: 10000,
  max_investment: 100000,
  created_at: '2024-01-01T00:00:00Z',
  user_id: 'test-investor-user-id',
}

// Mock payment data
export const mockPayment = {
  id: 'test-payment-id',
  amount: 1000,
  currency: 'ZAR',
  status: 'pending',
  provider: 'payfast',
  user_id: 'test-user-id',
  created_at: '2024-01-01T00:00:00Z',
}

// Test utilities
export const testUtils = {
  // Wait for async operations
  waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Mock fetch
  mockFetch: (response: any) => {
    global.fetch = jest.fn(() => Promise.resolve(response)) as jest.Mock
  },
  
  // Mock localStorage
  mockLocalStorage: () => {
    const store: Record<string, string> = {}
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key]
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach(key => delete store[key])
      }),
    }
  },
  
  // Mock sessionStorage
  mockSessionStorage: () => {
    const store: Record<string, string> = {}
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key]
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach(key => delete store[key])
      }),
    }
  },
}

// Custom matchers
export const customMatchers = {
  toBeInTheDocument: (received: any) => {
    const pass = received && received.ownerDocument && received.ownerDocument.body.contains(received)
    return {
      pass,
      message: () => `Expected element ${pass ? 'not ' : ''}to be in the document`,
    }
  },
  
  toHaveTextContent: (received: any, expected: string) => {
    const pass = received.textContent === expected
    return {
      pass,
      message: () => `Expected element to have text content "${expected}", but got "${received.textContent}"`,
    }
  },
}

// Export everything
export * from '@testing-library/react'
export { renderWithProviders as render }
