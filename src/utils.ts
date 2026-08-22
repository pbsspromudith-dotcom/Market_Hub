import { 
  CANADA_FULL_METRO_MAPPINGS, 
  getExpandedKeywordsForCity, 
  normalizeString, 
  extractCityName as extractCityNameLib, 
  isLocationMatch as isLocationMatchLib 
} from './lib/canadianLocations';

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
  return extractCityNameLib(locationStr);
};

export const isLocationMatch = (
  adLocation: string | null | undefined, 
  targetLocation: string | null | undefined
): boolean => {
  return isLocationMatchLib(adLocation, targetLocation);
};

// Comprehensive Canadian major cities and their sub-cities / boroughs / regions across all 10 provinces
export const CANADA_METRO_MAPPINGS: Record<string, string[]> = CANADA_FULL_METRO_MAPPINGS;

export const getExpandedLocationKeywords = (locationStr: string): string[] => {
  if (!locationStr) return [];
  return getExpandedKeywordsForCity(locationStr);
};

