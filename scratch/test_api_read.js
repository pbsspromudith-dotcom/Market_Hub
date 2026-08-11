const http = require('http');

http.get('http://localhost:3000/api/listings/read', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const listings = JSON.parse(data);
      console.log('Total returned listings from API:', listings.length);
      const l33 = listings.find(l => l.id === 33);
      console.log('Listing 33 in API response:', l33 ? {
        id: l33.id,
        title: l33.title,
        is_home_gallery: l33.is_home_gallery,
        is_featured: l33.is_featured,
        location: l33.location,
        promotion_expires_at: l33.promotion_expires_at
      } : 'Not found');
    } catch (e) {
      console.error('Parse error:', e, data);
    }
  });
}).on('error', err => console.error('Request error:', err));
