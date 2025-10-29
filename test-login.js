fetch('http://localhost:3000/api/v1/auth/demo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ role: 'ADMIN' }),
})
  .then(async (res) => {
    console.log('status', res.status);
    const text = await res.text();
    console.log('body', text);
  })
  .catch((err) => {
    console.error('error', err);
  });
