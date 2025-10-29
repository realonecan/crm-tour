// First login to get a fresh token
fetch('http://localhost:3000/api/v1/auth/demo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ role: 'ADMIN' }),
})
  .then(async (res) => {
    const data = await res.json();
    const token = data.data.token;
    
    // Now fetch dashboard stats
    return fetch('http://localhost:3000/api/v1/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  })
  .then(async (res) => {
    console.log('Dashboard Status:', res.status);
    const data = await res.json();
    console.log('Dashboard Data:', JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.error('Error:', err);
  });
