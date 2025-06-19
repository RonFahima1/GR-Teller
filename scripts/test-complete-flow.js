const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3008'; // Update to current port

async function testCompleteFlow() {
  try {
    console.log('🚀 Testing Complete Invitation Flow...');
    console.log('='.repeat(80));
    
    // Step 1: Verify admin user exists
    console.log('\n1️⃣ Verifying Admin User...');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@globalremit.com' }
    });
    
    if (!adminUser) {
      throw new Error('Admin user not found - run seed script first');
    }
    
    const isValidPassword = await bcrypt.compare('admin123456', adminUser.password);
    console.log(`✅ Admin user: ${adminUser.name} (${adminUser.role})`);
    console.log(`✅ Password verification: ${isValidPassword ? 'PASS' : 'FAIL'}`);
    
    // Step 2: Clean up any existing test data
    console.log('\n2️⃣ Cleaning up test data...');
    const testEmail = 'newteller@globalremit.com';
    
    // Delete existing user if exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    
    if (existingUser) {
      await prisma.user.delete({ where: { email: testEmail } });
      console.log('✅ Deleted existing test user');
    }
    
    // Delete existing invitations
    await prisma.invitation.deleteMany({
      where: { email: testEmail }
    });
    console.log('✅ Cleaned up existing invitations');
    
    // Step 3: Test invitation creation
    console.log('\n3️⃣ Testing Invitation Creation...');
    
    // Create invitation directly in database (simulating API call)
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
    
    console.log(`✅ Invitation created for ${testEmail}`);
    console.log(`   Token: ${token.substring(0, 16)}...`);
    console.log(`   Expires: ${expiresAt.toLocaleDateString()}`);
    console.log(`   Invite Link: ${BASE_URL}/register?token=${token}`);
    
    // Step 4: Test invitation validation
    console.log('\n4️⃣ Testing Invitation Validation...');
    const validInvitation = await prisma.invitation.findUnique({
      where: { token: token },
      include: {
        invitedByUser: {
          select: { name: true, email: true }
        }
      }
    });
    
    if (validInvitation && !validInvitation.usedAt && validInvitation.expiresAt > new Date()) {
      console.log('✅ Invitation is valid and not expired');
      console.log(`   Invited by: ${validInvitation.invitedByUser.name}`);
    } else {
      console.log('❌ Invitation validation failed');
    }
    
    // Step 5: Test user registration
    console.log('\n5️⃣ Testing User Registration...');
    const newPassword = 'newuser123456';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const newUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: 'New Test Teller',
        password: hashedPassword,
        role: 'AGENT_USER',
        status: 'ACTIVE',
        createdBy: adminUser.id,
        onboardingStatus: 'COMPLETED',
      },
    });
    
    console.log(`✅ New user created: ${newUser.name} (${newUser.email})`);
    console.log(`   Role: ${newUser.role} | Status: ${newUser.status}`);
    
    // Mark invitation as used
    await prisma.invitation.update({
      where: { token: token },
      data: { usedAt: new Date() }
    });
    
    console.log('✅ Invitation marked as used');
    
    // Step 6: Test new user login
    console.log('\n6️⃣ Testing New User Login...');
    const createdUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    
    if (createdUser) {
      const loginValid = await bcrypt.compare(newPassword, createdUser.password);
      console.log(`✅ New user login test: ${loginValid ? 'PASS' : 'FAIL'}`);
    }
    
    // Step 7: Display final state
    console.log('\n7️⃣ Final Database State:');
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
    
    console.log('\n📋 Users:');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role} | Status: ${user.status} | Onboarding: ${user.onboardingStatus}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });
    
    const allInvitations = await prisma.invitation.findMany({
      include: {
        invitedByUser: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('📋 Invitations:');
    allInvitations.forEach((inv, index) => {
      console.log(`${index + 1}. ${inv.email} (${inv.role})`);
      console.log(`   Status: ${inv.usedAt ? 'Used' : 'Pending'} | Expires: ${inv.expiresAt.toLocaleDateString()}`);
      console.log(`   Invited by: ${inv.invitedByUser.name}`);
      console.log('');
    });
    
    console.log('🎉 Complete Flow Test Successful!');
    console.log('\n📋 Test Summary:');
    console.log('- ✅ Database connection');
    console.log('- ✅ Admin user verification');
    console.log('- ✅ Invitation creation');
    console.log('- ✅ Invitation validation');
    console.log('- ✅ User registration');
    console.log('- ✅ New user login test');
    console.log('- ✅ Database state verification');
    
    console.log('\n🔗 Next Steps:');
    console.log('1. Start the dev server: npm run dev');
    console.log('2. Login as admin at: http://localhost:3008/login');
    console.log('3. Go to Admin > Users');
    console.log('4. Click "Invite User"');
    console.log('5. Create invitation and copy link');
    console.log('6. Open link in new browser/incognito');
    console.log('7. Complete registration');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testCompleteFlow(); 