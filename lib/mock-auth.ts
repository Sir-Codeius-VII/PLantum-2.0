// Mock authentication for development/testing
// This allows you to test the app without setting up Supabase

export interface MockUser {
  id: string
  email: string
  name: string
  is_admin: boolean
  created_at: string
}

export interface MockSession {
  user: MockUser
  access_token: string
  refresh_token: string
}

// Mock users storage (in real app, this would be in database)
// Using a persistent array that survives between requests
let mockUsers: MockUser[] = [
  {
    id: 'mock-user-1',
    email: 'test@example.com',
    name: 'Test User',
    is_admin: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    is_admin: true,
    created_at: new Date().toISOString(),
  },
]

// Mock session storage
let currentSession: MockSession | null = null

export const mockAuth = {
  // Sign up a new user
  signUp: async (email: string, password: string, name: string): Promise<{ user: MockUser | null; error: string | null }> => {
    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email)
    if (existingUser) {
      return { user: null, error: 'User already exists' }
    }

    // Create new user
    const newUser: MockUser = {
      id: `mock-user-${Date.now()}`,
      email,
      name,
      is_admin: false,
      created_at: new Date().toISOString(),
    }

    mockUsers.push(newUser)

    // Create session
    const session: MockSession = {
      user: newUser,
      access_token: `mock-token-${Date.now()}`,
      refresh_token: `mock-refresh-${Date.now()}`,
    }

    currentSession = session

    return { user: newUser, error: null }
  },

  // Sign in existing user
  signIn: async (email: string, password: string): Promise<{ user: MockUser | null; error: string | null }> => {
    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      return { user: null, error: 'Invalid email or password' }
    }

    // Create session
    const session: MockSession = {
      user,
      access_token: `mock-token-${Date.now()}`,
      refresh_token: `mock-refresh-${Date.now()}`,
    }

    currentSession = session

    return { user, error: null }
  },

  // Sign out
  signOut: async (): Promise<{ error: string | null }> => {
    currentSession = null
    return { error: null }
  },

  // Get current session
  getSession: async (): Promise<{ session: MockSession | null; error: string | null }> => {
    return { session: currentSession, error: null }
  },

  // Get current user
  getUser: async (): Promise<{ user: MockUser | null; error: string | null }> => {
    return { user: currentSession?.user || null, error: null }
  },
}

// Check if we should use mock auth (when Supabase is not configured)
export function shouldUseMockAuth(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || 
         process.env.NEXT_PUBLIC_SUPABASE_URL.includes('example') ||
         process.env.NEXT_PUBLIC_SUPABASE_URL.includes('localhost')
}

