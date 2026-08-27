import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getExpandedLocationKeywords } from '@/utils';

export const dynamic = 'force-dynamic';

interface ChatItem {
  id: number;
  title: string;
  price: number;
  price_type?: string;
  location: string;
  category: string;
  image: string | null;
  url: string;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ 
        text: "Hi there! I'm the HitAds Assistant. How can I help you today?",
        suggestions: ["🚗 Find Cars", "🏠 Browse Real Estate", "➕ How to Post an Ad", "💎 Pricing Plans"]
      });
    }

    const trimmed = message.trim();
    const lower = trimmed.toLowerCase();

    // ── 1. Pricing / Plans / Promotion Questions ──
    if (
      lower.includes('pricing') ||
      lower.includes('price') ||
      lower.includes('plan') ||
      lower.includes('cost') ||
      lower.includes('boost') ||
      lower.includes('premium') ||
      lower.includes('top ad') ||
      lower.includes('promotion') ||
      lower.includes('how much')
    ) {
      return NextResponse.json({
        text: `Here are the **HitAds Visibility Plans** available for your ads:

• **FREE ($0)**:
  ✓ Up to 10 photos
  ✓ Standard listing in your selected city
  ✓ Direct buyer messaging & contact

• **BOOST ($9.99 / 30 days)** — *Most Popular*:
  ✓ Up to 20 photos
  ✓ Automatic refresh every 7 days
  ✓ Priority placement in search results
  ✓ Website link & contact

• **PREMIUM ($24.99 / 30 days)** — *Maximum Exposure*:
  ✓ Up to 20 photos
  ✓ Automatic refresh every 3 days
  ✓ Priority in search results
  ✓ **Multi-City Posting in up to 5 cities**
  ✓ Website, Facebook & YouTube links

Would you like to [Post an Ad](/post-ad) now or learn more about multi-city posting?`,
        suggestions: ["➕ Post an Ad", "📍 Multi-City Posting", "🚗 Search Items", "🛡️ Safety Tips"]
      });
    }

    // ── 2. How to Post an Ad / Sell ──
    if (
      lower.includes('how to post') ||
      lower.includes('post ad') ||
      lower.includes('post an ad') ||
      lower.includes('sell') ||
      lower.includes('create listing') ||
      lower.includes('create ad') ||
      lower.includes('publish')
    ) {
      return NextResponse.json({
        text: `Posting an ad on **HitAds.ca** is quick, easy, and free! Here is how:

1. Click the **[Post Ad](/post-ad)** button in the top navigation bar.
2. **Choose your Category** (e.g. Vehicles, Real Estate, Buy & Sell, Jobs, etc.).
3. **Fill in Details**: Add your title, price, description, and upload up to 20 photos.
4. **Choose Location**: Select your main city, sub-city, or choose up to 5 cities with the Premium plan.
5. **Pick Your Plan**: Choose **FREE**, **BOOST ($9.99)**, or **PREMIUM ($24.99)**, and your ad will be live!

👉 Click here to **[Create Your Ad Now](/post-ad)**.`,
        suggestions: ["💎 View Plans", "📍 Multi-City Posting", "🔍 Search Listings"]
      });
    }

    // ── 3. Multi-City Posting ──
    if (
      lower.includes('multi-city') ||
      lower.includes('multi city') ||
      lower.includes('multiple cities') ||
      lower.includes('5 cities') ||
      lower.includes('different cities')
    ) {
      return NextResponse.json({
        text: `**HitAds Premium Multi-City Posting** allows your listing to appear simultaneously in up to **5 different cities** across Canada!

• Your ad is created as a separate local listing in each chosen city.
• You reach buyers across entire provinces and metro regions without posting duplicate ads manually.
• Available on the **PREMIUM Plan ($24.99 / 30 days)**.

Ready to reach more buyers? **[Post a Multi-City Ad](/post-ad)**.`,
        suggestions: ["💎 View Pricing Plans", "➕ Post an Ad", "📍 Canadian Cities Covered"]
      });
    }

    // ── 4. Safety & Scam Prevention ──
    if (
      lower.includes('safe') ||
      lower.includes('safety') ||
      lower.includes('scam') ||
      lower.includes('fraud') ||
      lower.includes('trust') ||
      lower.includes('secure')
    ) {
      return NextResponse.json({
        text: `Here are essential safety tips for buying and selling safely on **HitAds.ca**:

🛡️ **Meet in Person**: Always meet in a public, well-lit place (like a busy shopping center or safe exchange zone).
🔍 **Inspect Before Paying**: Check the condition of the item thoroughly before handing over payment.
🚫 **Never Wire Money**: Avoid wire transfers, gift cards, or sending money to people you haven't met.
💬 **Use In-App Chat**: Keep communication within the HitAds messaging system for your security.

Read our full **[Safety Tips & Guidelines](/safety-tips)**.`,
        suggestions: ["🔍 Search Listings", "➕ How to Post an Ad", "💬 How Messaging Works"]
      });
    }

    // ── 5. Messaging / Contacting Sellers ──
    if (
      lower.includes('message') ||
      lower.includes('contact seller') ||
      lower.includes('chat with seller') ||
      lower.includes('inbox') ||
      lower.includes('talk to seller')
    ) {
      return NextResponse.json({
        text: `To contact a seller on HitAds:

1. Click on any listing you're interested in.
2. Use the **"Contact Seller"** or **"Send Message"** box on the item page to send a direct message.
3. The seller will be notified immediately, and you can view all your active conversations in your **[User Profile Chats](/profile)**.

If the seller has provided a phone number or website link, you will also see those direct contact options on the listing!`,
        suggestions: ["👤 Go to My Profile", "🔍 Search Items", "🚗 Browse Cars"]
      });
    }

    // ── 6. Account, Profile, My Ads ──
    if (
      lower.includes('profile') ||
      lower.includes('my ad') ||
      lower.includes('my ads') ||
      lower.includes('my listing') ||
      lower.includes('dashboard') ||
      lower.includes('login') ||
      lower.includes('sign in') ||
      lower.includes('register') ||
      lower.includes('password')
    ) {
      return NextResponse.json({
        text: `You can manage your listings, chat history, and account settings from your **[User Profile](/profile)**:

• **My Ads**: View, edit, or delete your active listings.
• **Chats**: Read and reply to buyer inquiries.
• **Promotions**: Upgrade listings to Boost or Premium.
• **Account**: Update your email, phone, and password.

Not signed in yet? **[Log In Here](/login)** or **[Create a Free Account](/login)**.`,
        suggestions: ["👤 My Profile", "🔑 Log In", "➕ Post an Ad"]
      });
    }

    // ── 7. Canadian Locations & Cities Covered ──
    if (
      lower.includes('location') ||
      lower.includes('city') ||
      lower.includes('cities') ||
      lower.includes('province') ||
      lower.includes('canada') ||
      lower.includes('toronto') ||
      lower.includes('vancouver') ||
      lower.includes('calgary') ||
      lower.includes('montreal') ||
      lower.includes('edmonton') ||
      lower.includes('ottawa') ||
      lower.includes('winnipeg') ||
      lower.includes('halifax')
    ) {
      // Check if they are asking about database listings in that city first
      const hasSpecificSearch = lower.includes('car') || lower.includes('house') || lower.includes('rent') || lower.includes('buy') || lower.includes('find') || lower.includes('job') || lower.includes('item');
      
      if (!hasSpecificSearch && (lower.includes('where') || lower.includes('coverage') || lower.includes('support') || lower.includes('available'))) {
        return NextResponse.json({
          text: `**HitAds.ca** covers all **10 Provinces across Canada** with instant searching across over **1,295 cities, towns, and sub-cities**:

• **Ontario (ON)**: Toronto, Mississauga, Brampton, Ottawa, Hamilton, Kitchener, etc.
• **British Columbia (BC)**: Vancouver, Surrey, Burnaby, Richmond, Victoria, Kelowna, etc.
• **Alberta (AB)**: Calgary, Edmonton, Red Deer, Lethbridge, Airdrie, etc.
• **Quebec (QC)**: Montreal, Quebec City, Laval, Gatineau, Longueuil, etc.
• **Manitoba (MB)**: Winnipeg, Brandon, Steinbach, etc.
• **Saskatchewan (SK)**: Saskatoon, Regina, Prince Albert, etc.
• **Nova Scotia (NS)**: Halifax, Dartmouth, Sydney, etc.
• **New Brunswick (NB)**: Moncton, Saint John, Fredericton, etc.
• **Newfoundland & Labrador (NL)**: St. John's, Mount Pearl, Corner Brook, etc.
• **Prince Edward Island (PE)**: Charlottetown, Summerside, etc.

You can select any city instantly in the top search bar!`,
          suggestions: ["🔍 Search by City", "➕ Post an Ad", "💎 Pricing Plans"]
        });
      }
    }

    // ── 8. Greetings / Casual conversation ──
    if (
      lower === 'hi' ||
      lower === 'hello' ||
      lower === 'hey' ||
      lower === 'good morning' ||
      lower === 'good afternoon' ||
      lower === 'good evening' ||
      lower.startsWith('hi ') ||
      lower.startsWith('hello ')
    ) {
      return NextResponse.json({
        text: `Hello! 👋 Welcome to **HitAds.ca** — Canada's fast and easy classifieds marketplace.

I can help you:
• 🔍 **Search items** (e.g. *"Find Honda Civic in Toronto"* or *"Townhouses in Kitchener"*)
• ➕ **Post a free ad**
• 💎 **Learn about Visibility Plans** (Boost & Premium)
• 🛡️ **Get safety and buying advice**

What would you like to explore?`,
        suggestions: ["🚗 Find Cars", "🏠 Real Estate", "➕ How to Post an Ad", "💎 View Plans"]
      });
    }

    // ── 9. Live Listing Database Search ──
    // 1. Remove emojis and clean input
    const stripped = trimmed.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, ' ');
    const searchLower = stripped.toLowerCase().trim();

    // 2. Remove conversational stopwords & action verbs
    const stopWords = [
      'do you have', 'can you find', 'can you show', 'find me', 'show me', 'search for',
      'look for', 'looking for', 'is there', 'are there', 'i want to find', 'i want',
      'i need', 'help me find', 'how about', 'tell me about', 'how to', 'browse all',
      'browse', 'find', 'search', 'show', 'look', 'view', 'list', 'get', 'see', 'please',
      'any', 'all', 'some', 'for sale', 'available', 'active', 'near', 'around', 'in canada',
      'in', 'at', 'items', 'item', 'listings', 'listing', 'ads', 'ad'
    ];

    let cleaned = searchLower;
    for (const sw of stopWords) {
      const regex = new RegExp(`\\b${sw}\\b`, 'gi');
      cleaned = cleaned.replace(regex, ' ');
    }
    cleaned = cleaned.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();

    // 3. Detect category intention
    let categoryIntent: string | null = null;
    let remainingTerms = cleaned;

    if (/\b(car|cars|vehicle|vehicles|auto|autos|automobile|automobiles|truck|trucks|suv|suvs|van|vans|sedan|coupe)\b/i.test(cleaned)) {
      categoryIntent = 'Vehicles';
      remainingTerms = remainingTerms.replace(/\b(car|cars|vehicle|vehicles|auto|autos|automobile|automobiles|truck|trucks|suv|suvs|van|vans|sedan|coupe)\b/gi, ' ').trim();
    } else if (/\b(real estate|property|properties|house|houses|home|homes|apartment|apartments|condo|condos|room|rooms|basement|basements|townhouse|townhouses|rent|rentals|rental)\b/i.test(cleaned)) {
      categoryIntent = 'Real Estate';
      remainingTerms = remainingTerms.replace(/\b(real estate|property|properties)\b/gi, ' ').trim();
    } else if (/\b(job|jobs|hiring|employment|career|careers|work|vacancy|vacancies)\b/i.test(cleaned)) {
      categoryIntent = 'Jobs';
      remainingTerms = remainingTerms.replace(/\b(job|jobs|hiring|employment|career|careers|work)\b/gi, ' ').trim();
    } else if (/\b(service|services|contractor|contractors|moving|cleaning|plumber|electrician|repair)\b/i.test(cleaned)) {
      categoryIntent = 'Local Services';
      remainingTerms = remainingTerms.replace(/\b(service|services)\b/gi, ' ').trim();
    } else if (/\b(buy and sell|buy & sell|furniture|electronics|phone|phones|iphone|laptop|laptops)\b/i.test(cleaned)) {
      categoryIntent = 'Buy & Sell';
      remainingTerms = remainingTerms.replace(/\b(buy and sell|buy & sell)\b/gi, ' ').trim();
    }

    remainingTerms = remainingTerms.replace(/\s+/g, ' ').trim();
    const searchWords = remainingTerms.split(' ').filter(w => w.length >= 2);

    let matchedListings: any[] = [];

    // Query active listings
    let query = supabase
      .from('listings')
      .select('id, title, price, price_type, location, category, image, is_top_ad, is_highlighted')
      .or('status.eq.active,status.is.null');

    if (categoryIntent) {
      query = query.ilike('category', `%${categoryIntent}%`);
    }

    if (searchWords.length > 0) {
      for (const word of searchWords) {
        query = query.or(`title.ilike.%${word}%,description.ilike.%${word}%,category.ilike.%${word}%,location.ilike.%${word}%`);
      }
    }

    const { data: results } = await query
      .order('is_top_ad', { ascending: false })
      .order('id', { ascending: false })
      .limit(4);

    if (results && results.length > 0) {
      matchedListings = results;
    } else if (categoryIntent) {
      // Fallback: If no results with strict words, but category was detected, show latest listings in that category
      const { data: catResults } = await supabase
        .from('listings')
        .select('id, title, price, price_type, location, category, image, is_top_ad, is_highlighted')
        .or('status.eq.active,status.is.null')
        .ilike('category', `%${categoryIntent}%`)
        .order('is_top_ad', { ascending: false })
        .order('id', { ascending: false })
        .limit(4);

      if (catResults && catResults.length > 0) {
        matchedListings = catResults;
      }
    } else if (cleaned.length >= 2) {
      // Fallback: Generic search on all fields
      const { data: genResults } = await supabase
        .from('listings')
        .select('id, title, price, price_type, location, category, image, is_top_ad, is_highlighted')
        .or('status.eq.active,status.is.null')
        .or(`title.ilike.%${cleaned}%,description.ilike.%${cleaned}%,category.ilike.%${cleaned}%,location.ilike.%${cleaned}%`)
        .order('is_top_ad', { ascending: false })
        .order('id', { ascending: false })
        .limit(4);

      if (genResults && genResults.length > 0) {
        matchedListings = genResults;
      }
    }

    if (matchedListings.length > 0) {
      const items: ChatItem[] = matchedListings.map((item) => {
        let firstImg: string | null = null;
        if (item.image) {
          try {
            const parsed = typeof item.image === 'string' ? JSON.parse(item.image) : item.image;
            if (Array.isArray(parsed) && parsed.length > 0) firstImg = parsed[0];
          } catch {
            firstImg = typeof item.image === 'string' ? item.image : null;
          }
        }
        return {
          id: item.id,
          title: item.title,
          price: Number(item.price) || 0,
          price_type: item.price_type || 'amount',
          location: item.location || 'Canada',
          category: item.category || 'Classifieds',
          image: firstImg,
          url: `/item/${item.id}`,
        };
      });

      const listSummary = items
        .map(it => `• **[${it.title}](${it.url})** — **$${it.price.toLocaleString()}** in *${it.location}*`)
        .join('\n');

      return NextResponse.json({
        text: `Here are matching listings found on HitAds for **"${trimmed}"**:\n\n${listSummary}\n\n👉 Click any item above to view full photos and contact the seller, or [browse all results in Search](/search?q=${encodeURIComponent(cleaned || trimmed)}).`,
        items: items,
        suggestions: ["🔍 Search More Items", "➕ Post Similar Ad", "💎 Pricing Plans"]
      });
    }

    // ── 10. Fallback / General Helpful Guidance ──
    // If no direct database match, provide general guidance and category links
    return NextResponse.json({
      text: `I searched HitAds for **"${trimmed}"**, but couldn't find an exact active listing right now.

Here are helpful things you can do:
• 🔍 Try searching with different keywords in the **[Search Menu](/search?q=${encodeURIComponent(trimmed)})**.
• ➕ **[Post a Free Ad](/post-ad)** if you have an item to sell or request.
• 📁 Browse popular categories like **Vehicles**, **Real Estate**, **Electronics**, or **Jobs**.

Would you like help with anything else?`,
      suggestions: ["🔍 Browse All Listings", "➕ Post an Ad", "💎 View Plans", "🛡️ Safety Tips"]
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ 
      text: "I'm currently having a moment, but I'm back up! How can I assist you with HitAds today?",
      suggestions: ["🚗 Find Cars", "🏠 Real Estate", "➕ Post an Ad", "💎 Pricing Plans"]
    }, { status: 200 });
  }
}
