export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const now = new Date();
    
    const getPastDate = (days: number) => {
      const date = new Date(now);
      date.setDate(date.getDate() - days);
      return date;
    };

    const date24hAgo = getPastDate(1);
    const date48hAgo = getPastDate(2);
    const date30DaysAgo = getPastDate(30);
    const date60DaysAgo = getPastDate(60);

    // 1. Core Totals
    const [
      totalListings,
      totalUsers,
      newUsersToday,
      revenueResult,
      recentActivity
    ] = await Promise.all([
      prisma.listings.count(),
      prisma.users.count(),
      prisma.users.count({ where: { join_date: { gte: date24hAgo } } }),
      prisma.listings.aggregate({ _sum: { price: true } }),
      prisma.listings.findMany({
        select: { id: true, title: true, created_at: true },
        orderBy: { created_at: 'desc' },
        take: 5
      })
    ]);

    const revenue = revenueResult._sum.price ? Number(revenueResult._sum.price) : 0;

    // 2. Listing Trends for the last 30 days
    const recentListings = await prisma.listings.findMany({
      where: { created_at: { gte: date30DaysAgo } },
      select: { created_at: true }
    });

    const rawTrends: Record<string, number> = {};
    for (const listing of recentListings) {
      if (!listing.created_at) continue;
      // Format as YYYY-MM-DD
      const dateStr = listing.created_at.toISOString().split('T')[0];
      rawTrends[dateStr] = (rawTrends[dateStr] || 0) + 1;
    }

    const listingTrends = [];
    for (let i = 30; i >= 0; i--) {
      const d = getPastDate(i);
      const dateStr = d.toISOString().split('T')[0];
      const month = d.toLocaleString('en-US', { month: 'short' });
      const day = String(d.getDate()).padStart(2, '0');
      
      listingTrends.push({
        name: `${month} ${day}`,
        value: rawTrends[dateStr] || 0
      });
    }

    // 3. Dynamic percentage changes
    const getListingCountRange = async (start: Date, end: Date) => {
      return prisma.listings.count({
        where: { created_at: { gte: start, lt: end } }
      });
    };

    const getUserCountRange = async (start: Date, end: Date) => {
      return prisma.users.count({
        where: { join_date: { gte: start, lt: end } }
      });
    };

    const getRevenueRange = async (start: Date, end: Date) => {
      const res = await prisma.listings.aggregate({
        where: { created_at: { gte: start, lt: end } },
        _sum: { price: true }
      });
      return res._sum.price ? Number(res._sum.price) : 0;
    };

    const calculatePercentageChange = (current: number, previous: number) => {
      if (previous === 0) {
        return current > 0 ? '+100%' : '0%';
      }
      const diff = ((current - previous) / previous) * 100;
      return (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
    };

    // Calculations
    const [
      listingsCurrent, listingsPrevious,
      usersCurrent, usersPrevious,
      revenueCurrent, revenuePrevious,
      newUsersYesterday
    ] = await Promise.all([
      getListingCountRange(date30DaysAgo, now),
      getListingCountRange(date60DaysAgo, date30DaysAgo),
      getUserCountRange(date30DaysAgo, now),
      getUserCountRange(date60DaysAgo, date30DaysAgo),
      getRevenueRange(date30DaysAgo, now),
      getRevenueRange(date60DaysAgo, date30DaysAgo),
      getUserCountRange(date48hAgo, date24hAgo)
    ]);

    const listingsChange = calculatePercentageChange(listingsCurrent, listingsPrevious);
    const usersChange = calculatePercentageChange(usersCurrent, usersPrevious);
    const revenueChange = calculatePercentageChange(revenueCurrent, revenuePrevious);
    const newUsersTodayChange = calculatePercentageChange(newUsersToday, newUsersYesterday);

    return NextResponse.json({
      success: true,
      stats: {
        totalListings,
        totalUsers,
        newUsersToday,
        revenue,
        recentActivity,
        listingTrends,
        listingsChange,
        usersChange,
        newUsersTodayChange,
        revenueChange
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
