import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/validation';

// Admin dashboard API route handler
export async function GET() {
  try {
    // Verify admin authentication using Supabase service role if needed
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED')
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    if (!profile?.is_admin) {
      return createErrorResponse('Forbidden', 403, 'FORBIDDEN')
    }

    // Fetch platform statistics from Supabase
    const [totalUsersRes, totalBusinessesRes, revenueRes, pendingWithdrawalsRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('businesses').select('id', { count: 'exact', head: true }),
      supabase.from('transactions').select('amount').eq('status', 'completed'),
      supabase.from('withdrawals').select('amount').eq('status', 'pending'),
    ])

    const totalUsers = totalUsersRes.count || 0
    const totalBusinesses = totalBusinessesRes.count || 0
    const totalRevenue = (revenueRes.data || []).reduce((sum, r: any) => sum + (r.amount || 0), 0)
    const pendingWithdrawals = (pendingWithdrawalsRes.data || []).reduce((sum, r: any) => sum + (r.amount || 0), 0)

    // Fetch recent users
    const { data: users } = await supabase
      .from('profiles')
      .select('id, name, email, is_admin, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    // Fetch recent businesses
    const { data: businesses } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    // Fetch pending withdrawals
    const { data: withdrawals } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    // Fetch recent transactions
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    // Return formatted dashboard data
    return createSuccessResponse({
      stats: {
        totalUsers,
        totalBusinesses,
        totalRevenue,
        pendingWithdrawals,
      },
      users,
      businesses,
      withdrawals,
      transactions
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    return createErrorResponse('Failed to fetch dashboard data', 500, 'DATABASE_ERROR');
  }
}

// Helper function to calculate growth rate between two periods
function calculateGrowthRate(previous: number, current: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
} 