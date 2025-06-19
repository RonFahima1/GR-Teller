const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('🔍 Testing Database Connection...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        onboardingStatus: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('\n📊 Current Users in Database:');
    console.log('='.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role} | Status: ${user.status} | Onboarding: ${user.onboardingStatus}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });
    
    // Test password verification for admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@globalremit.com' }
    });
    
    if (adminUser) {
      const isValidPassword = await bcrypt.compare('admin123456', adminUser.password);
      console.log(`🔐 Admin password test: ${isValidPassword ? '✅ Valid' : '❌ Invalid'}`);
    }
    
    console.log('\n🎯 Test Credentials for Real-World Testing:');
    console.log('='.repeat(80));
    console.log('Admin: admin@globalremit.com / admin123456');
    console.log('Manager: manager@globalremit.com / manager123456');
    console.log('Teller: teller@globalremit.com / teller123456');
    console.log('Compliance: compliance@globalremit.com / compliance123456');
    console.log('User: user@globalremit.com / user123456');
    
    console.log('\n🌐 Application URL: http://localhost:3000 (or next available port)');
    console.log('📝 Login URL: http://localhost:3000/login');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth(); 