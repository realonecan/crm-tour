const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW1vLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2MTc0MDQwMCwiZXhwIjoxNzYyMzQ1MjAwfQ.o0AQsfZkMCcXEk1ED-QKPQqzqFThUXVlzHQN27R0NyM';

fetch('http://localhost:3000/api/v1/dashboard/stats', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
  .then(async (res) => {
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  })
  .catch((err) => {
    console.error('Error:', err);
  });
