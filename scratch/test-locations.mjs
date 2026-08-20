import { searchCanadianLocations, getExpandedKeywordsForCity, ALL_CANADIAN_LOCATIONS, POPULAR_CANADIAN_CITIES } from '../src/lib/canadianLocations.ts';

console.log('--- CANADIAN LOCATIONS ENGINE TEST ---');
console.log('Total indexed locations:', ALL_CANADIAN_LOCATIONS.length);
console.log('Popular Canadian cities count:', POPULAR_CANADIAN_CITIES.length);

const testQueries = [
  'tor',
  'scar',
  'air',
  'metr',
  'stein',
  'diep',
  'torb',
  'dart',
  'char',
  'rose',
  'warm',
  'van',
  'cal',
  'mont',
  'edmon',
  'reg',
  'sask',
  'fred',
  'st john',
];

console.log('\n--- INSTANT SEARCH RESULTS ---');
for (const q of testQueries) {
  const start = performance.now();
  const results = searchCanadianLocations(q, 3);
  const elapsed = (performance.now() - start).toFixed(2);
  console.log(`Query: "${q}" (${elapsed}ms) -> ${results.map(r => `${r.name}, ${r.provinceCode}`).join(' | ')}`);
}

console.log('\n--- EXPANDED KEYWORDS TEST ---');
console.log('Expanded "Calgary":', getExpandedKeywordsForCity('Calgary'));
console.log('Expanded "Scarborough":', getExpandedKeywordsForCity('Scarborough'));
console.log('Expanded "Burnaby":', getExpandedKeywordsForCity('Burnaby'));
console.log('Expanded "Winnipeg":', getExpandedKeywordsForCity('Winnipeg'));
