import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Admin dashboard API route handler
export async function GET() {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch platform statistics
    const [
      totalUsers,
      totalBusinesses,
      totalRevenue,
      pendingWithdrawals,
      activeUsers,
      newUsers,
      newBusinesses,
      monthlyRevenue,
      averageTransactionValue,
      userGrowth,
      businessGrowth,
      revenueGrowth
    ] = await Promise.all([
      // Count total users
      prisma.user.count(),
      // Count total businesses
      prisma.business.count(),
      // Calculate total revenue from completed transactions
      prisma.transaction.aggregate({
        where: { status: 'completed' },
        _sum: { amount: true }
      }),
      // Count pending withdrawals
      prisma.withdrawal.aggregate({
        where: { status: 'pending' },
        _sum: { amount: true }
      }),
      // Count active users (active in last 30 days)
      prisma.user.count({
        where: {
          lastActive: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Count new users (created in last 30 days)
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Count new businesses (created in last 30 days)
      prisma.business.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Calculate monthly revenue
      prisma.transaction.aggregate({
        where: {
          status: 'completed',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        _sum: { amount: true }
      }),
      // Calculate average transaction value
      prisma.transaction.aggregate({
        where: { status: 'completed' },
        _avg: { amount: true }
      }),
      // Calculate user growth rate
      calculateGrowthRate(
        await prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
              lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        await prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        })
      ),
      // Calculate business growth rate
      calculateGrowthRate(
        await prisma.business.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
              lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        await prisma.business.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        })
      ),
      // Calculate revenue growth rate
      calculateGrowthRate(
        (await prisma.transaction.aggregate({
          where: {
            status: 'completed',
            createdAt: {
              gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
              lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          },
          _sum: { amount: true }
        }))._sum.amount || 0,
        (await prisma.transaction.aggregate({
          where: {
            status: 'completed',
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          },
          _sum: { amount: true }
        }))._sum.amount || 0
      )
    ]);

    // Fetch recent users
    const users = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        lastActive: true
      }
    });

    // Fetch recent businesses
    const businesses = await prisma.business.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        balance: true,
        createdAt: true,
        lastActive: true
      }
    });

    // Fetch pending withdrawals
    const withdrawals = await prisma.withdrawal.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        businessId: true,
        businessName: true,
        amount: true,
        status: true,
        createdAt: true
      }
    });

    // Fetch recent transactions
    const transactions = await prisma.transaction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        businessId: true,
        businessName: true,
        amount: true,
        type: true,
        status: true,
        createdAt: true
      }
    });

    // Return formatted dashboard data
    return NextResponse.json({
      stats: {
        totalUsers,
        totalBusinesses,
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingWithdrawals: pendingWithdrawals._sum.amount || 0,
        activeUsers,
        newUsers,
        newBusinesses,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        averageTransactionValue: averageTransactionValue._avg.amount || 0,
        userGrowth,
        businessGrowth,
        revenueGrowth
      },
      users,
      businesses,
      withdrawals,
      transactions
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

// Helper function to calculate growth rate between two periods
function calculateGrowthRate(previous: number, current: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
} 