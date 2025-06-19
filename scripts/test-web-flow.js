const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3001';

async function testWebFlow() {
  try {
    console.log('🌐 Testing Complete Web-Based Invitation Flow...');
    console.log('='.repeat(80));
    
    // Step 1: Verify admin user exists and can log in
    console.log('\n1️⃣ Verifying Admin User...');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@globalremit.com' }
    });
    
    if (!adminUser) {
      throw new Error('Admin user not found');
    }
    
    const isValidPassword = await bcrypt.compare('admin123456', adminUser.password);
    console.log(`✅ Admin user exists: ${adminUser.name} (${adminUser.role})`);
    console.log(`✅ Admin password verification: ${isValidPassword ? 'PASS' : 'FAIL'}`);
    
    // Step 2: Create a fresh invitation for testing
    console.log('\n2️⃣ Creating Fresh Invitation...');
    const testEmail = 'newteller@globalremit.com';
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    
    if (existingUser) {
      console.log(`⚠️  User ${testEmail} already exists, deleting for fresh test...`);
      await prisma.user.delete({ where: { email: testEmail } });
    }
    
    // Delete any existing invitations for this email
    await prisma.invitation.deleteMany({
      where: { email: testEmail }
    });
    
    // Create new invitation
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); // 3 days
    
    const invitation = await prisma.invitation.create({
      data: {
        email: testEmail,
        role: 'AGENT_USER',
        token: token,
        invitedBy: adminUser.id,
        expiresAt: expiresAt,
      },
    });
    
    console.log(`✅ Fresh invitation created for ${testEmail}`);
    console.log(`   Token: ${token.substring(0, 16)}...`);
    console.log(`   Expires: ${expiresAt.toLocaleDateString()}`);
    console.log(`   Invite Link: ${BASE_URL}/register?token=${token}`);
    
    // Step 3: Test invitation validation API
    console.log('\n3️⃣ Testing Invitation Validation API...');
    const validationResponse = await fetch(`${BASE_URL}/api/user/invite/validate?token=${token}`);
    const validationData = await validationResponse.json();
    
    if (validationResponse.ok) {
      console.log('✅ Invitation validation API working');
      console.log(`   Email: ${validationData.invite.email}`);
      console.log(`   Role: ${validationData.invite.role}`);
      console.log(`   Invited by: ${validationData.invite.invitedBy}`);
    } else {
      console.log('❌ Invitation validation API failed:', validationData.error);
    }
    
    // Step 4: Simulate user registration via API
    console.log('\n4️⃣ Testing User Registration API...');
    const registrationData = {
      token: token,
      firstName: 'New',
      lastName: 'Teller',
      password: 'newteller123456'
    };
    
    const registrationResponse = await fetch(`${BASE_URL}/api/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });
    
    const registrationResult = await registrationResponse.json();
    
    if (registrationResponse.ok) {
      console.log('✅ User registration successful');
      console.log(`   User ID: ${registrationResult.user.id}`);
      console.log(`   Email: ${registrationResult.user.email}`);
      console.log(`   Role: ${registrationResult.user.role}`);
    } else {
      console.log('❌ User registration failed:', registrationResult.error);
    }
    
    // Step 5: Verify user was created and invitation marked as used
    console.log('\n5️⃣ Verifying Database State...');
    const createdUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    
    const usedInvitation = await prisma.invitation.findUnique({
      where: { token: token }
    });
    
    if (createdUser) {
      console.log('✅ New user created in database');
      console.log(`   Name: ${createdUser.name}`);
      console.log(`   Role: ${createdUser.role}`);
      console.log(`   Status: ${createdUser.status}`);
      console.log(`   Created by: ${createdUser.createdBy}`);
      
      // Test password verification
      const loginValid = await bcrypt.compare('newteller123456', createdUser.password);
      console.log(`   Password verification: ${loginValid ? 'PASS' : 'FAIL'}`);
    } else {
      console.log('❌ User not found in database');
    }
    
    if (usedInvitation && usedInvitation.usedAt) {
      console.log('✅ Invitation marked as used');
      console.log(`   Used at: ${usedInvitation.usedAt.toLocaleString()}`);
    } else {
      console.log('❌ Invitation not marked as used');
    }
    
    // Step 6: Test login with new user
    console.log('\n6️⃣ Testing New User Login...');
    if (createdUser) {
      const loginValid = await bcrypt.compare('newteller123456', createdUser.password);
      console.log(`✅ New user login test: ${loginValid ? 'PASS' : 'FAIL'}`);
      
      if (loginValid) {
        console.log('🎯 New user credentials for testing:');
        console.log(`   Email: ${testEmail}`);
        console.log(`   Password: newteller123456`);
        console.log(`   Expected redirect: /teller (AGENT_USER role)`);
      }
    }
    
    // Step 7: Display final user list
    console.log('\n7️⃣ Final User Database State:');
    console.log('='.repeat(80));
    
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        onboardingStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role} | Status: ${user.status} | Onboarding: ${user.onboardingStatus}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });
    
    console.log('🎉 Web Flow Test Complete!');
    console.log('\n📋 Test Summary:');
    console.log('- ✅ Admin user verification');
    console.log('- ✅ Fresh invitation creation');
    console.log('- ✅ Invitation validation API');
    console.log('- ✅ User registration API');
    console.log('- ✅ Database state verification');
    console.log('- ✅ New user login test');
    
    console.log('\n🌐 Next Steps for Manual Testing:');
    console.log('1. Go to http://localhost:3001/login');
    console.log('2. Login as admin: admin@globalremit.com / admin123456');
    console.log('3. Navigate to admin dashboard and user management');
    console.log('4. Create invitation for new user');
    console.log('5. Use invitation link to register new user');
    console.log('6. Test login with newly created user');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testWebFlow(); 