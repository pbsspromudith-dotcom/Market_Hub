export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in miles
  return distance;
};

export const extractCityName = (locationStr: string): string => {
  if (!locationStr) return '';
  const trimmed = locationStr.trim();
  if (!trimmed || trimmed.toLowerCase() === 'all' || trimmed.toLowerCase() === 'canada') return '';
  
  const parts = trimmed.split(',').map(p => p.trim());
  if (parts.length > 1) {
    // If first part contains house/street numbers e.g. "123 Yonge St, Toronto, ON", city is second part
    if (/\d/.test(parts[0]) && parts[1]) {
      return parts[1].replace(/^city of\s+/i, '');
    }
    return parts[0].replace(/^city of\s+/i, '');
  }
  return trimmed.replace(/^city of\s+/i, '');
};
