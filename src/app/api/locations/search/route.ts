export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const CANADIAN_CITIES = [
  { city: 'Toronto', state: 'Ontario', lat: '43.6532', lon: '-79.3832' },
  { city: 'Vancouver', state: 'British Columbia', lat: '49.2827', lon: '-123.1207' },
  { city: 'Montreal', state: 'Quebec', lat: '45.5017', lon: '-73.5673' },
  { city: 'Calgary', state: 'Alberta', lat: '51.0447', lon: '-114.0719' },
  { city: 'Ottawa', state: 'Ontario', lat: '45.4215', lon: '-75.6972' },
  { city: 'Edmonton', state: 'Alberta', lat: '53.5461', lon: '-113.4938' },
  { city: 'Mississauga', state: 'Ontario', lat: '43.5890', lon: '-79.6441' },
  { city: 'Winnipeg', state: 'Manitoba', lat: '49.8951', lon: '-97.1384' },
  { city: 'Quebec City', state: 'Quebec', lat: '46.8139', lon: '-71.2080' },
  { city: 'Hamilton', state: 'Ontario', lat: '43.2557', lon: '-79.8711' },
  { city: 'Brampton', state: 'Ontario', lat: '43.7315', lon: '-79.7624' },
  { city: 'Surrey', state: 'British Columbia', lat: '49.1913', lon: '-122.8490' },
  { city: 'Kitchener', state: 'Ontario', lat: '43.4516', lon: '-80.4925' },
  { city: 'Laval', state: 'Quebec', lat: '45.6066', lon: '-73.7124' },
  { city: 'Halifax', state: 'Nova Scotia', lat: '44.6488', lon: '-63.5752' },
  { city: 'London', state: 'Ontario', lat: '42.9849', lon: '-81.2453' },
  { city: 'Victoria', state: 'British Columbia', lat: '48.4284', lon: '-123.3656' },
  { city: 'Markham', state: 'Ontario', lat: '43.8561', lon: '-79.3370' },
  { city: 'Oshawa', state: 'Ontario', lat: '43.8971', lon: '-78.8658' },
  { city: 'Vaughan', state: 'Ontario', lat: '43.8563', lon: '-79.5085' },
  { city: 'Windsor', state: 'Ontario', lat: '42.3149', lon: '-83.0364' },
  { city: 'Saskatoon', state: 'Saskatchewan', lat: '52.1332', lon: '-106.6700' },
  { city: 'St. Catharines', state: 'Ontario', lat: '43.1594', lon: '-79.2469' },
  { city: 'Regina', state: 'Saskatchewan', lat: '50.4452', lon: '-104.6189' },
  { city: 'Richmond Hill', state: 'Ontario', lat: '43.8828', lon: '-79.4403' },
  { city: 'Barrie', state: 'Ontario', lat: '44.3894', lon: '-79.6903' },
  { city: 'Oakville', state: 'Ontario', lat: '43.4675', lon: '-79.6877' },
  { city: 'Burlington', state: 'Ontario', lat: '43.3255', lon: '-79.7990' },
  { city: 'Richmond', state: 'British Columbia', lat: '49.1666', lon: '-123.1336' },
  { city: 'Burnaby', state: 'British Columbia', lat: '49.2488', lon: '-122.9805' },
  { city: 'Scarborough', state: 'Ontario', lat: '43.7764', lon: '-79.2318' },
  { city: 'North York', state: 'Ontario', lat: '43.7615', lon: '-79.4111' },
  { city: 'Etobicoke', state: 'Ontario', lat: '43.6205', lon: '-79.5132' },
  { city: 'Kelowna', state: 'British Columbia', lat: '49.8880', lon: '-119.4960' },
  { city: 'Sudbury', state: 'Ontario', lat: '46.4900', lon: '-80.9900' },
  { city: 'Sherbrooke', state: 'Quebec', lat: '45.4042', lon: '-71.8929' },
  { city: 'Kingston', state: 'Ontario', lat: '44.2312', lon: '-76.4860' },
  { city: 'Guelph', state: 'Ontario', lat: '43.5448', lon: '-80.2482' },
  { city: 'Abbotsford', state: 'British Columbia', lat: '49.0504', lon: '-122.3045' },
  { city: 'Trois-Rivières', state: 'Quebec', lat: '46.3432', lon: '-72.5429' },
  { city: 'Coquitlam', state: 'British Columbia', lat: '49.2838', lon: '-122.7932' },
  { city: 'Pickering', state: 'Ontario', lat: '43.8384', lon: '-79.0868' },
  { city: 'Saint John', state: 'New Brunswick', lat: '45.2733', lon: '-66.0633' },
  { city: 'Moncton', state: 'New Brunswick', lat: '46.0878', lon: '-64.7782' },
  { city: 'Thunder Bay', state: 'Ontario', lat: '48.3809', lon: '-89.2477' },
  { city: 'Waterloo', state: 'Ontario', lat: '43.4643', lon: '-80.5204' },
  { city: 'Terrebonne', state: 'Quebec', lat: '45.6931', lon: '-73.6331' },
  { city: 'Longueuil', state: 'Quebec', lat: '45.5312', lon: '-73.5181' },
  { city: 'Ajax', state: 'Ontario', lat: '43.8509', lon: '-79.0204' },
  { city: 'Whitby', state: 'Ontario', lat: '43.8975', lon: '-78.9429' },
  { city: 'Brossard', state: 'Quebec', lat: '45.4578', lon: '-73.4647' },
  { city: 'Red Deer', state: 'Alberta', lat: '52.2681', lon: '-113.8111' },
  { city: 'Kamloops', state: 'British Columbia', lat: '50.6745', lon: '-120.3273' },
  { city: 'Lethbridge', state: 'Alberta', lat: '49.6956', lon: '-112.8451' },
  { city: 'Milton', state: 'Ontario', lat: '43.5183', lon: '-79.8774' },
  { city: 'St. John\'s', state: 'Newfoundland and Labrador', lat: '47.5615', lon: '-52.7126' },
  { city: 'Peterborough', state: 'Ontario', lat: '44.3091', lon: '-78.3197' },
  { city: 'Chilliwack', state: 'British Columbia', lat: '49.1579', lon: '-121.9514' },
  { city: 'Sarnia', state: 'Ontario', lat: '42.9745', lon: '-82.4066' },
  { city: 'Nanaimo', state: 'British Columbia', lat: '49.1659', lon: '-123.9401' },
  { city: 'Fredericton', state: 'New Brunswick', lat: '45.9636', lon: '-66.6431' },
  { city: 'Belleville', state: 'Ontario', lat: '44.1628', lon: '-77.3832' },
  { city: 'Niagara Falls', state: 'Ontario', lat: '43.0896', lon: '-79.0849' },
  { city: 'Prince George', state: 'British Columbia', lat: '53.9171', lon: '-122.7497' },
  { city: 'Sault Ste. Marie', state: 'Ontario', lat: '46.5136', lon: '-84.3358' },
  { city: 'Charlottetown', state: 'Prince Edward Island', lat: '46.2382', lon: '-63.1311' }
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q || !q.trim()) {
    return NextResponse.json([]);
  }

  const queryLower = q.trim().toLowerCase();

  // 1. Instant local matching for Canadian cities (starts with / contains)
  const startsWithMatches = CANADIAN_CITIES.filter(c => c.city.toLowerCase().startsWith(queryLower));
  const includesMatches = CANADIAN_CITIES.filter(c => !c.city.toLowerCase().startsWith(queryLower) && c.city.toLowerCase().includes(queryLower));
  const localMatches = [...startsWithMatches, ...includesMatches].slice(0, 5).map(c => ({
    display_name: `${c.city}, ${c.state}, Canada`,
    address: { city: c.city, state: c.state, country: 'Canada' },
    lat: c.lat,
    lon: c.lon
  }));

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&countrycodes=ca&format=json&addressdetails=1&limit=5`,
      {
        headers: {
          'User-Agent': 'MarketHub/1.0 (contact: admin@hitads.ca)'
        }
      }
    );

    if (!response.ok) {
      return NextResponse.json(localMatches);
    }

    const remoteData = await response.json();
    
    // Combine local matches and remote Nominatim data, removing duplicates
    const combined = [...localMatches];
    if (Array.isArray(remoteData)) {
      for (const item of remoteData) {
        const itemCity = item.address?.city || item.address?.town || item.address?.village || item.display_name.split(',')[0];
        const isDuplicate = combined.some(c => 
          c.address.city.toLowerCase() === itemCity.toLowerCase() ||
          c.display_name.toLowerCase() === item.display_name.toLowerCase()
        );
        if (!isDuplicate) {
          combined.push(item);
        }
      }
    }

    return NextResponse.json(combined.slice(0, 7));
  } catch (error) {
    console.error('Location search error:', error);
    return NextResponse.json(localMatches);
  }
}
