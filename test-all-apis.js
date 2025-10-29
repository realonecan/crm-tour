// Comprehensive API Test Suite for TourCRM
const BASE_URL = 'http://localhost:3000/api/v1';
let authToken = '';

async function login() {
  console.log('\n🔐 Testing Authentication...');
  const response = await fetch(`${BASE_URL}/auth/demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'ADMIN' }),
  });
  const data = await response.json();
  authToken = data.data.token;
  console.log('✅ Login successful');
  return authToken;
}

async function testTours() {
  console.log('\n📍 Testing Tours API...');
  
  // Get all tours
  const toursRes = await fetch(`${BASE_URL}/tours`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
  });
  const tours = await toursRes.json();
  console.log(`✅ Found ${tours.data.length} tours`);
  
  // Get single tour
  if (tours.data.length > 0) {
    const tourId = tours.data[0].id;
    const tourRes = await fetch(`${BASE_URL}/tours/${tourId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    const tour = await tourRes.json();
    console.log(`✅ Retrieved tour: ${tour.data.title}`);
  }
}

async function testBookings() {
  console.log('\n📋 Testing Bookings API...');
  
  const response = await fetch(`${BASE_URL}/bookings`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
  });
  const data = await response.json();
  console.log(`✅ Found ${data.data.length} bookings`);
  
  // Count by status
  const statusCounts = data.data.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});
  console.log('   Status breakdown:', statusCounts);
}

async function testLeads() {
  console.log('\n🎯 Testing Leads API...');
  
  const response = await fetch(`${BASE_URL}/leads`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
  });
  const data = await response.json();
  console.log(`✅ Found ${data.data.length} leads`);
  
  // Count by status
  const statusCounts = data.data.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});
  console.log('   Status breakdown:', statusCounts);
}

async function testCustomers() {
  console.log('\n👥 Testing Customers API...');
  
  const response = await fetch(`${BASE_URL}/customers`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
  });
  const data = await response.json();
  console.log(`✅ Found ${data.data.length} customers`);
}

async function testCategories() {
  console.log('\n🏷️  Testing Categories API...');
  
  const response = await fetch(`${BASE_URL}/categories`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
  });
  const data = await response.json();
  console.log(`✅ Found ${data.data.length} categories`);
  data.data.forEach(cat => {
    console.log(`   ${cat.icon} ${cat.title}`);
  });
}

async function testUsers() {
  console.log('\n👤 Testing Users API...');
  
  const response = await fetch(`${BASE_URL}/users`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
  });
  const data = await response.json();
  console.log(`✅ Found ${data.data.length} users`);
  data.data.forEach(user => {
    console.log(`   ${user.name} (${user.role})`);
  });
}

async function testDashboard() {
  console.log('\n📊 Testing Dashboard API...');
  
  const response = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
  });
  const data = await response.json();
  console.log('✅ Dashboard stats retrieved:');
  console.log(`   Orders Today: ${data.data.ordersToday}`);
  console.log(`   Weekly Revenue: $${data.data.weeklyRevenue}`);
  console.log(`   Active Tours: ${data.data.activeTours}`);
  console.log(`   New Leads: ${data.data.newLeads}`);
  console.log(`   Upcoming Tours: ${data.data.upcomingTours.length}`);
}

async function testTourDates() {
  console.log('\n📅 Testing Tour Dates API...');
  
  const response = await fetch(`${BASE_URL}/dates`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
  });
  const data = await response.json();
  console.log(`✅ Found ${data.data.length} tour dates`);
}

async function runAllTests() {
  console.log('═══════════════════════════════════════');
  console.log('🧪 TourCRM API Test Suite');
  console.log('═══════════════════════════════════════');
  
  try {
    await login();
    await testDashboard();
    await testTours();
    await testTourDates();
    await testBookings();
    await testLeads();
    await testCustomers();
    await testCategories();
    await testUsers();
    
    console.log('\n═══════════════════════════════════════');
    console.log('✅ All tests passed successfully!');
    console.log('═══════════════════════════════════════\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  }
}

runAllTests();
