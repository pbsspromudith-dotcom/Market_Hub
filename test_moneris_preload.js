const payload = {
  store_id: 'monca14426',
  api_token: 'xj2ILKq1pTli31Qf4gSi',
  checkout_id: 'chktJNZ3X14426',
  action: 'preload',
  environment: 'qa',
  txn_total: '1.00',
  order_no: `test-${Date.now()}`,
  cust_id: 'user-1',
  dynamic_descriptor: 'TEST PROMO'
};

fetch('https://gatewayt.moneris.com/chkt/request/request.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(data => {
  console.log(data);
})
.catch(console.error);
