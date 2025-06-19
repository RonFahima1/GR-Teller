const BASE_URL = 'http://localhost:3000';

async function testAdminUI() {
  try {
    console.log('🧪 Testing Admin UI Endpoints...');
    console.log('='.repeat(80));
    
    // Test 1: Check if admin users endpoint exists
    console.log('\n1️⃣ Testing Admin Users API...');
    const usersResponse = await fetch(`${BASE_URL}/api/admin/users`);
    console.log(`✅ Admin Users API Status: ${usersResponse.status}`);
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log(`   Found ${usersData.users?.length || 0} users`);
    } else {
      console.log('   Response:', await usersResponse.text());
    }
    
    // Test 2: Check if admin invitations endpoint exists
    console.log('\n2️⃣ Testing Admin Invitations API...');
    const invitationsResponse = await fetch(`${BASE_URL}/api/admin/invitations`);
    console.log(`✅ Admin Invitations API Status: ${invitationsResponse.status}`);
    
    if (invitationsResponse.ok) {
      const invitationsData = await invitationsResponse.json();
      console.log(`   Found ${invitationsData.invitations?.length || 0} invitations`);
    } else {
      console.log('   Response:', await invitationsResponse.text());
    }
    
    // Test 3: Check if admin dashboard page loads
    console.log('\n3️⃣ Testing Admin Dashboard Page...');
    const dashboardResponse = await fetch(`${BASE_URL}/admin`);
    console.log(`✅ Admin Dashboard Status: ${dashboardResponse.status}`);
    
    // Test 4: Check if admin users page loads
    console.log('\n4️⃣ Testing Admin Users Page...');
    const usersPageResponse = await fetch(`${BASE_URL}/admin/users`);
    console.log(`✅ Admin Users Page Status: ${usersPageResponse.status}`);
    
    // Test 5: Check if teller dashboard page loads
    console.log('\n5️⃣ Testing Teller Dashboard Page...');
    const tellerResponse = await fetch(`${BASE_URL}/teller`);
    console.log(`✅ Teller Dashboard Status: ${tellerResponse.status}`);
    
    // Test 6: Check if manager dashboard page loads
    console.log('\n6️⃣ Testing Manager Dashboard Page...');
    const managerResponse = await fetch(`${BASE_URL}/manager`);
    console.log(`✅ Manager Dashboard Status: ${managerResponse.status}`);
    
    // Test 7: Check if compliance dashboard page loads
    console.log('\n7️⃣ Testing Compliance Dashboard Page...');
    const complianceResponse = await fetch(`${BASE_URL}/compliance`);
    console.log(`✅ Compliance Dashboard Status: ${complianceResponse.status}`);
    
    console.log('\n🎉 Admin UI Test Complete!');
    console.log('\n📋 Summary:');
    console.log('- All dashboard pages should return 200 (OK)');
    console.log('- API endpoints may return 401/403 (Unauthorized/Forbidden) without authentication');
    console.log('- This is expected behavior for security');
    
    console.log('\n🌐 Manual Testing Instructions:');
    console.log('1. Go to http://localhost:3008/login');
    console.log('2. Login as admin: admin@globalremit.com / admin123456');
    console.log('3. You should be redirected to /admin dashboard');
    console.log('4. Click "User Management" to see the new UI');
    console.log('5. Click "Invite User" to create invitations');
    console.log('6. Test different user roles and their dashboards');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAdminUI(); 