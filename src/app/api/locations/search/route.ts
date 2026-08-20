export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { searchCanadianLocations } from '@/lib/canadianLocations';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const matches = searchCanadianLocations(q, limit);

    // Format into standardized place response
    const formatted = matches.map((item) => ({
      display_name: `${item.name}, ${item.province}, Canada`,
      address: {
        city: item.name,
        town: item.name,
        state: item.province,
        state_code: item.provinceCode,
        region: item.regionName,
        country: 'Canada',
      },
      lat: item.lat,
      lon: item.lon,
      isMainCity: item.isMainCity,
      parentCity: item.parentCity,
      fullAddress: item.fullAddress,
      displayTitle: item.displayTitle,
      displaySubtitle: item.displaySubtitle,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Location search API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
