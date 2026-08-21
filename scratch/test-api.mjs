async function test() {
  const queries = [
    '',
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
    'calgary',
    'vancouver',
    'montreal',
    'st john'
  ];

  console.log('--- TESTING LIVE API: http://localhost:3000/api/locations/search ---');

  for (const q of queries) {
    const start = performance.now();
    const res = await fetch(`http://localhost:3000/api/locations/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    const elapsed = (performance.now() - start).toFixed(2);
    console.log(`\nQuery: "${q}" (${elapsed}ms, Status: ${res.status}, Results: ${data.length})`);
    for (const item of data.slice(0, 3)) {
      console.log(`  • ${item.displayTitle} [${item.address?.state_code}] — ${item.displaySubtitle}`);
    }
  }
}

test().catch(console.error);
