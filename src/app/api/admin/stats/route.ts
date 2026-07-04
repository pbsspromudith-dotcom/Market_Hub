export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const now = new Date();
    
    const getPastDate = (days: number) => {
      const date = new Date(now);
      date.setDate(date.getDate() - days);
      return date;
    };

    const date24hAgo = getPastDate(1).toISOString();
    const date48hAgo = getPastDate(2).toISOString();
    const date30DaysAgo = getPastDate(30).toISOString();
    const date60DaysAgo = getPastDate(60).toISOString();

    // 1. Core Totals
    const p1 = supabase.from('listings').select('*', { count: 'exact', head: true });
    const p2 = supabase.from('users').select('*', { count: 'exact', head: true });
    const p3 = supabase.from('users').select('*', { count: 'exact', head: true }).gte('join_date', date24hAgo);
    const p4 = supabase.from('listings').select('price'); // for revenue
    const p5 = supabase.from('listings').select('id, title, created_at').order('created_at', { ascending: false }).limit(5);
    
    const [res1, res2, res3, res4, res5] = await Promise.all([p1, p2, p3, p4, p5]);

    const totalListings = res1.count || 0;
    const totalUsers = res2.count || 0;
    const newUsersToday = res3.count || 0;
    const recentActivity = res5.data || [];
    const revenue = (res4.data || []).reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

    // 2. Listing Trends for the last 30 days
    const { data: recentListings } = await supabase
      .from('listings')
      .select('created_at')
      .gte('created_at', date30DaysAgo);

    const rawTrends: Record<string, number> = {};
    if (recentListings) {
      for (const listing of recentListings) {
        if (!listing.created_at) continue;
        const dateStr = listing.created_at.split('T')[0];
        rawTrends[dateStr] = (rawTrends[dateStr] || 0) + 1;
      }
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
    const getListingCountRange = async (start: string, end: string) => {
      const { count } = await supabase.from('listings').select('*', { count: 'exact', head: true }).gte('created_at', start).lt('created_at', end);
      return count || 0;
    };

    const getUserCountRange = async (start: string, end: string) => {
      const { count } = await supabase.from('users').select('*', { count: 'exact', head: true }).gte('join_date', start).lt('join_date', end);
      return count || 0;
    };

    const getRevenueRange = async (start: string, end: string) => {
      const { data } = await supabase.from('listings').select('price').gte('created_at', start).lt('created_at', end);
      return (data || []).reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    };

    const calculatePercentageChange = (current: number, previous: number) => {
      if (previous === 0) {
        return current > 0 ? '+100%' : '0%';
      }
      const diff = ((current - previous) / previous) * 100;
      return (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
    };

    const [
      listingsCurrent, listingsPrevious,
      usersCurrent, usersPrevious,
      revenueCurrent, revenuePrevious,
      newUsersYesterday
    ] = await Promise.all([
      getListingCountRange(date30DaysAgo, now.toISOString()),
      getListingCountRange(date60DaysAgo, date30DaysAgo),
      getUserCountRange(date30DaysAgo, now.toISOString()),
      getUserCountRange(date60DaysAgo, date30DaysAgo),
      getRevenueRange(date30DaysAgo, now.toISOString()),
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
