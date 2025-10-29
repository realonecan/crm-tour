// Test CRUD Operations for TourCRM
const BASE_URL = 'http://localhost:3000/api/v1';
let authToken = '';

async function login() {
  const response = await fetch(`${BASE_URL}/auth/demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'ADMIN' }),
  });
  const data = await response.json();
  authToken = data.data.token;
  return authToken;
}

async function testCreateCustomer() {
  console.log('\n👤 Testing CREATE Customer...');
  const response = await fetch(`${BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName: 'Test Customer',
      phone: '+1-555-9999',
      email: 'test@example.com',
      telegram: '@testuser',
    }),
  });
  const data = await response.json();
  if (data.success) {
    console.log(`✅ Customer created: ${data.data.fullName} (ID: ${data.data.id})`);
    return data.data.id;
  } else {
    console.log('❌ Failed to create customer:', data.error);
    return null;
  }
}

async function testUpdateCustomer(customerId) {
  console.log('\n✏️  Testing UPDATE Customer...');
  const response = await fetch(`${BASE_URL}/customers/${customerId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName: 'Test Customer Updated',
      email: 'updated@example.com',
    }),
  });
  const data = await response.json();
  if (data.success) {
    console.log(`✅ Customer updated: ${data.data.fullName}`);
  } else {
    console.log('❌ Failed to update customer:', data.error);
  }
}

async function testDeleteCustomer(customerId) {
  console.log('\n🗑️  Testing DELETE Customer...');
  const response = await fetch(`${BASE_URL}/customers/${customerId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
  const data = await response.json();
  if (data.success) {
    console.log('✅ Customer deleted successfully');
  } else {
    console.log('❌ Failed to delete customer:', data.error);
  }
}

async function testCreateLead() {
  console.log('\n🎯 Testing CREATE Lead...');
  const response = await fetch(`${BASE_URL}/leads`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test Lead',
      phone: '+1-555-8888',
      email: 'lead@example.com',
      message: 'Interested in tours',
      status: 'OPEN',
    }),
  });
  const data = await response.json();
  if (data.success) {
    console.log(`✅ Lead created: ${data.data.name} (ID: ${data.data.id})`);
    return data.data.id;
  } else {
    console.log('❌ Failed to create lead:', data.error);
    return null;
  }
}

async function testUpdateLead(leadId) {
  console.log('\n✏️  Testing UPDATE Lead...');
  const response = await fetch(`${BASE_URL}/leads/${leadId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'IN_PROGRESS',
      message: 'Following up with customer',
    }),
  });
  const data = await response.json();
  if (data.success) {
    console.log(`✅ Lead updated: Status = ${data.data.status}`);
  } else {
    console.log('❌ Failed to update lead:', data.error);
  }
}

async function testDeleteLead(leadId) {
  console.log('\n🗑️  Testing DELETE Lead...');
  const response = await fetch(`${BASE_URL}/leads/${leadId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
  const data = await response.json();
  if (data.success) {
    console.log('✅ Lead deleted successfully');
  } else {
    console.log('❌ Failed to delete lead:', data.error);
  }
}

async function testCreateTourDate() {
  console.log('\n📅 Testing CREATE Tour Date...');
  const response = await fetch(`${BASE_URL}/dates`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tourId: 1,
      date: '2025-12-15',
      maxGroupSize: 15,
      priceOverride: 1300,
    }),
  });
  const data = await response.json();
  if (data.success) {
    console.log(`✅ Tour date created (ID: ${data.data.id})`);
    return data.data.id;
  } else {
    console.log('❌ Failed to create tour date:', data.error);
    return null;
  }
}

async function testUpdateTourDate(dateId) {
  console.log('\n✏️  Testing UPDATE Tour Date...');
  const response = await fetch(`${BASE_URL}/dates/${dateId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      maxGroupSize: 20,
      priceOverride: 1400,
    }),
  });
  const data = await response.json();
  if (data.success) {
    console.log(`✅ Tour date updated: Max group = ${data.data.maxGroupSize}`);
  } else {
    console.log('❌ Failed to update tour date:', data.error);
  }
}

async function testDeleteTourDate(dateId) {
  console.log('\n🗑️  Testing DELETE Tour Date...');
  const response = await fetch(`${BASE_URL}/dates/${dateId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
  const data = await response.json();
  if (data.success) {
    console.log('✅ Tour date deleted successfully');
  } else {
    console.log('❌ Failed to delete tour date:', data.error);
  }
}

async function testCreateCategory() {
  console.log('\n🏷️  Testing CREATE Category...');
  const response = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Test Category',
      slug: 'test-category-' + Date.now(),
      icon: '🧪',
      color: '#FF5733',
    }),
  });
  const data = await response.json();
  if (data.success) {
    console.log(`✅ Category created: ${data.data.title} (ID: ${data.data.id})`);
    return data.data.id;
  } else {
    console.log('❌ Failed to create category:', data.error);
    return null;
  }
}

async function testDeleteCategory(categoryId) {
  console.log('\n🗑️  Testing DELETE Category...');
  const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
  const data = await response.json();
  if (data.success) {
    console.log('✅ Category deleted successfully');
  } else {
    console.log('❌ Failed to delete category:', data.error);
  }
}

async function runCRUDTests() {
  console.log('═══════════════════════════════════════');
  console.log('🧪 TourCRM CRUD Operations Test');
  console.log('═══════════════════════════════════════');
  
  try {
    await login();
    console.log('✅ Authenticated as ADMIN\n');
    
    // Test Customer CRUD
    const customerId = await testCreateCustomer();
    if (customerId) {
      await testUpdateCustomer(customerId);
      await testDeleteCustomer(customerId);
    }
    
    // Test Lead CRUD
    const leadId = await testCreateLead();
    if (leadId) {
      await testUpdateLead(leadId);
      await testDeleteLead(leadId);
    }
    
    // Test Tour Date CRUD
    const dateId = await testCreateTourDate();
    if (dateId) {
      await testUpdateTourDate(dateId);
      await testDeleteTourDate(dateId);
    }
    
    // Test Category CRUD
    const categoryId = await testCreateCategory();
    if (categoryId) {
      await testDeleteCategory(categoryId);
    }
    
    console.log('\n═══════════════════════════════════════');
    console.log('✅ All CRUD tests completed!');
    console.log('═══════════════════════════════════════\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

runCRUDTests();
