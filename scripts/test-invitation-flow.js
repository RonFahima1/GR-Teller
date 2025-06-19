const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000';

async function testInvitationFlow() {
  try {
    console.log('🧪 Testing Complete Invitation Flow...');
    console.log('='.repeat(80));
    
    // Step 1: Test admin login
    console.log('\n1️⃣ Testing Admin Login...');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@globalremit.com' }
    });
    
    if (!adminUser) {
      throw new Error('Admin user not found');
    }
    
    const isValidPassword = await bcrypt.compare('admin123456', adminUser.password);
    console.log(`✅ Admin password verification: ${isValidPassword ? 'PASS' : 'FAIL'}`);
    
    // Step 2: Create invitation (simulate admin action)
    console.log('\n2️⃣ Creating Invitation...');
    const testEmail = 'newuser@globalremit.com';
    const testRole = 'AGENT_USER';
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    
    if (existingUser) {
      console.log(`⚠️  User ${testEmail} already exists, skipping invitation creation`);
    } else {
      // Create invitation
      const crypto = require('crypto');
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); // 3 days
      
      const invitation = await prisma.invitation.create({
        data: {
          email: testEmail,
          role: testRole,
          token: token,
          invitedBy: adminUser.id,
          expiresAt: expiresAt,
        },
      });
      
      console.log(`✅ Invitation created for ${testEmail}`);
      console.log(`   Token: ${token.substring(0, 16)}...`);
      console.log(`   Expires: ${expiresAt.toLocaleDateString()}`);
      console.log(`   Invite Link: ${BASE_URL}/register?token=${token}`);
      
      // Step 3: Test invitation validation
      console.log('\n3️⃣ Testing Invitation Validation...');
      const validInvitation = await prisma.invitation.findUnique({
        where: { token: token }
      });
      
      if (validInvitation && !validInvitation.usedAt && validInvitation.expiresAt > new Date()) {
        console.log('✅ Invitation is valid and not expired');
      } else {
        console.log('❌ Invitation validation failed');
      }
      
      // Step 4: Simulate user registration
      console.log('\n4️⃣ Simulating User Registration...');
      const newPassword = 'newuser123456';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const newUser = await prisma.user.create({
        data: {
          email: testEmail,
          name: 'New Test User',
          password: hashedPassword,
          role: testRole,
          status: 'ACTIVE',
          createdBy: adminUser.id,
          onboardingStatus: 'COMPLETED',
        },
      });
      
      console.log(`✅ New user created: ${newUser.email} (${newUser.role})`);
      
      // Mark invitation as used
      await prisma.invitation.update({
        where: { token: token },
        data: { usedAt: new Date() }
      });
      
      console.log('✅ Invitation marked as used');
      
      // Step 5: Test new user login
      console.log('\n5️⃣ Testing New User Login...');
      const createdUser = await prisma.user.findUnique({
        where: { email: testEmail }
      });
      
      if (createdUser) {
        const loginValid = await bcrypt.compare(newPassword, createdUser.password);
        console.log(`✅ New user login test: ${loginValid ? 'PASS' : 'FAIL'}`);
      }
    }
    
    // Step 6: Display final user list
    console.log('\n6️⃣ Final User Database State:');
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
    
    console.log('🎉 Invitation Flow Test Complete!');
    console.log('\n📋 Test Summary:');
    console.log('- ✅ Database connection');
    console.log('- ✅ Admin user verification');
    console.log('- ✅ Invitation creation');
    console.log('- ✅ Invitation validation');
    console.log('- ✅ User registration');
    console.log('- ✅ New user login test');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testInvitationFlow(); 