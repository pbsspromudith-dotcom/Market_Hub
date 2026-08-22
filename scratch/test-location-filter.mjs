import { getExpandedKeywordsForCity, isLocationMatch, extractCityName } from '../src/lib/canadianLocations.ts';

const testCases = [
  // 1. Toronto matching
  { ad: 'Toronto, ON', selected: 'Toronto, ON', expected: true, desc: 'Toronto ad matches Toronto selected' },
  { ad: 'Downtown Toronto, ON', selected: 'Toronto, ON', expected: true, desc: 'Downtown Toronto ad matches Toronto selected' },
  { ad: 'North York, ON', selected: 'Toronto, ON', expected: true, desc: 'North York ad matches Toronto selected' },
  { ad: 'Scarborough, ON', selected: 'Toronto, ON', expected: true, desc: 'Scarborough ad matches Toronto selected' },
  { ad: 'Etobicoke, ON', selected: 'Toronto, ON', expected: true, desc: 'Etobicoke ad matches Toronto selected' },
  
  // 2. Non-Toronto ads MUST be hidden when Toronto is selected
  { ad: 'BRAMPTON, ON', selected: 'Toronto, ON', expected: false, desc: 'Brampton ad is hidden when Toronto selected' },
  { ad: 'OAKVILLE, ON', selected: 'Toronto, ON', expected: false, desc: 'Oakville ad is hidden when Toronto selected' },
  { ad: 'MISSISSAUGA, ON', selected: 'Toronto, ON', expected: false, desc: 'Mississauga ad is hidden when Toronto selected' },
  { ad: 'Hamilton, ON', selected: 'Toronto, ON', expected: false, desc: 'Hamilton ad is hidden when Toronto selected' },
  { ad: 'Markham, ON', selected: 'Toronto, ON', expected: false, desc: 'Markham ad is hidden when Toronto selected' },
  { ad: 'Vaughan, ON', selected: 'Toronto, ON', expected: false, desc: 'Vaughan ad is hidden when Toronto selected' },
  
  // 3. Brampton matching
  { ad: 'BRAMPTON, ON', selected: 'Brampton, ON', expected: true, desc: 'Brampton ad matches Brampton selected' },
  { ad: 'Bramalea, ON', selected: 'Brampton, ON', expected: true, desc: 'Bramalea ad matches Brampton selected' },
  { ad: 'Toronto, ON', selected: 'Brampton, ON', expected: false, desc: 'Toronto ad is hidden when Brampton selected' },
  { ad: 'Mississauga, ON', selected: 'Brampton, ON', expected: false, desc: 'Mississauga ad is hidden when Brampton selected' },

  // 4. Mississauga matching
  { ad: 'MISSISSAUGA, ON', selected: 'Mississauga, ON', expected: true, desc: 'Mississauga ad matches Mississauga selected' },
  { ad: 'Port Credit, ON', selected: 'Mississauga, ON', expected: true, desc: 'Port Credit ad matches Mississauga selected' },
  { ad: 'Toronto, ON', selected: 'Mississauga, ON', expected: false, desc: 'Toronto ad is hidden when Mississauga selected' },
  { ad: 'Brampton, ON', selected: 'Mississauga, ON', expected: false, desc: 'Brampton ad is hidden when Mississauga selected' },

  // 5. Nationwide / Clear filter
  { ad: 'Toronto, ON', selected: '', expected: true, desc: 'Empty selected matches all' },
  { ad: 'Brampton, ON', selected: '', expected: true, desc: 'Empty selected matches all' },
  { ad: 'Toronto, ON', selected: 'Canada', expected: true, desc: 'Canada selected matches all' },
  { ad: 'Brampton, ON', selected: 'Canada', expected: true, desc: 'Canada selected matches all' },
  { ad: 'Vancouver, BC', selected: 'Canada', expected: true, desc: 'Canada selected matches Vancouver' },
];

let passed = 0;
let failed = 0;

for (const t of testCases) {
  const result = isLocationMatch(t.ad, t.selected);
  if (result === t.expected) {
    passed++;
    console.log(`✓ PASS: ${t.desc} (result: ${result})`);
  } else {
    failed++;
    console.error(`✗ FAIL: ${t.desc} (expected: ${t.expected}, got: ${result})`);
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
