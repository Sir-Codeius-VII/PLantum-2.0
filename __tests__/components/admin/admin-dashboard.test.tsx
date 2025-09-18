import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders, mockApiResponses, testUtils } from '@/lib/test-utils'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

// Mock the useQuery hook
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}))

const mockDashboardData = {
  stats: {
    totalUsers: 150,
    totalBusinesses: 25,
    totalRevenue: 500000,
    pendingWithdrawals: 15000,
  },
  users: [
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      is_admin: false,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      is_admin: true,
      created_at: '2024-01-02T00:00:00Z',
    },
  ],
  businesses: [
    {
      id: 'business-1',
      name: 'Tech Startup',
      email: 'contact@techstartup.com',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
    },
  ],
  withdrawals: [],
  transactions: [
    {
      id: 'tx-1',
      amount: 1000,
      status: 'completed',
      created_at: '2024-01-01T00:00:00Z',
    },
  ],
}

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render loading state initially', () => {
    const { useQuery } = require('@tanstack/react-query')
    useQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    renderWithProviders(<AdminDashboard />)

    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument()
  })

  it('should render dashboard data when loaded', async () => {
    const { useQuery } = require('@tanstack/react-query')
    useQuery.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    })

    renderWithProviders(<AdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
      expect(screen.getByText('150')).toBeInTheDocument() // Total Users
      expect(screen.getByText('25')).toBeInTheDocument() // Total Businesses
      expect(screen.getByText('R500,000')).toBeInTheDocument() // Total Revenue
      expect(screen.getByText('R15,000')).toBeInTheDocument() // Pending Withdrawals
    })
  })

  it('should render error state when API fails', () => {
    const { useQuery } = require('@tanstack/react-query')
    useQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch dashboard data'),
    })

    renderWithProviders(<AdminDashboard />)

    expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('should display users in the users tab', async () => {
    const { useQuery } = require('@tanstack/react-query')
    useQuery.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    })

    renderWithProviders(<AdminDashboard />)

    // Click on Users tab
    const usersTab = screen.getByText('Users')
    usersTab.click()

    await waitFor(() => {
      expect(screen.getByText('Recent Users')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    })
  })

  it('should display businesses in the businesses tab', async () => {
    const { useQuery } = require('@tanstack/react-query')
    useQuery.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    })

    renderWithProviders(<AdminDashboard />)

    // Click on Businesses tab
    const businessesTab = screen.getByText('Businesses')
    businessesTab.click()

    await waitFor(() => {
      expect(screen.getByText('Recent Businesses')).toBeInTheDocument()
      expect(screen.getByText('Tech Startup')).toBeInTheDocument()
      expect(screen.getByText('contact@techstartup.com')).toBeInTheDocument()
    })
  })

  it('should display transactions in the transactions tab', async () => {
    const { useQuery } = require('@tanstack/react-query')
    useQuery.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    })

    renderWithProviders(<AdminDashboard />)

    // Click on Transactions tab
    const transactionsTab = screen.getByText('Transactions')
    transactionsTab.click()

    await waitFor(() => {
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
      expect(screen.getByText('R1,000')).toBeInTheDocument()
      expect(screen.getByText('completed')).toBeInTheDocument()
    })
  })

  it('should handle empty data gracefully', async () => {
    const emptyData = {
      stats: {
        totalUsers: 0,
        totalBusinesses: 0,
        totalRevenue: 0,
        pendingWithdrawals: 0,
      },
      users: [],
      businesses: [],
      withdrawals: [],
      transactions: [],
    }

    const { useQuery } = require('@tanstack/react-query')
    useQuery.mockReturnValue({
      data: emptyData,
      isLoading: false,
      error: null,
    })

    renderWithProviders(<AdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument() // All stats should be 0
      expect(screen.getByText('R0')).toBeInTheDocument() // Revenue should be 0
    })
  })

  it('should refresh data every 30 seconds', () => {
    const { useQuery } = require('@tanstack/react-query')
    useQuery.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    })

    renderWithProviders(<AdminDashboard />)

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['admin-dashboard'],
        refetchInterval: 30000,
      })
    )
  })
})
