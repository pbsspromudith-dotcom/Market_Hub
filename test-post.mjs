fetch('http://localhost:3000/api/admin/promotions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    promotion_type: 'test_promo',
    duration_days: 10,
    price: 19.99,
    is_active: true
  })
}).then(res => res.json()).then(console.log).catch(console.error);
