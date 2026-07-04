const ports = [3000, 3001, 3002, 3003];
async function test() {
  for (const port of ports) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/admin/promotions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promotion_type: 'test_promo_3',
          duration_days: 30,
          price: 29.99,
          is_active: true
        })
      });
      const data = await res.json();
      console.log(`Port ${port} response:`, data);
      return; // Stop if successful
    } catch (e) {
      console.log(`Port ${port} failed: ${e.message}`);
    }
  }
}
test();
