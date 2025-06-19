import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'admin@globalremit.com',
      password: 'admin123456',
      name: 'System Administrator',
      role: UserRole.ORG_ADMIN,
      employeeId: 'EMP001',
      department: 'IT',
      position: 'System Administrator',
      onboardingStatus: 'COMPLETED' as const,
      onboardingStep: 5,
    },
    {
      email: 'manager@globalremit.com',
      password: 'manager123456',
      name: 'Branch Manager',
      role: UserRole.AGENT_ADMIN,
      employeeId: 'EMP002',
      department: 'Operations',
      position: 'Branch Manager',
      onboardingStatus: 'COMPLETED' as const,
      onboardingStep: 5,
    },
    {
      email: 'teller@globalremit.com',
      password: 'teller123456',
      name: 'Cashier Teller',
      role: UserRole.AGENT_USER,
      employeeId: 'EMP003',
      department: 'Operations',
      position: 'Cashier',
      onboardingStatus: 'COMPLETED' as const,
      onboardingStep: 5,
    },
    {
      email: 'compliance@globalremit.com',
      password: 'compliance123456',
      name: 'Compliance Officer',
      role: UserRole.COMPLIANCE_USER,
      employeeId: 'EMP004',
      department: 'Compliance',
      position: 'Compliance Officer',
      onboardingStatus: 'COMPLETED' as const,
      onboardingStep: 5,
    },
    {
      email: 'user@globalremit.com',
      password: 'user123456',
      name: 'Regular User',
      role: UserRole.ORG_USER,
      employeeId: 'EMP005',
      department: 'Customer Service',
      position: 'Customer Representative',
      onboardingStatus: 'PENDING' as const,
      onboardingStep: 1,
    },
  ];

  for (const userData of users) {
    const existing = await prisma.user.findUnique({ 
      where: { email: userData.email } 
    });
    
    if (existing) {
      console.log(`User ${userData.email} already exists.`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role,
        employeeId: userData.employeeId,
        department: userData.department,
        position: userData.position,
        onboardingStatus: userData.onboardingStatus,
        onboardingStep: userData.onboardingStep,
        emailVerified: new Date(),
        status: 'ACTIVE',
      },
    });
    
    console.log(`Created user: ${userData.email} (${userData.role})`);
  }

  console.log('\n=== Test Users Created ===');
  console.log('Admin: admin@globalremit.com / admin123456');
  console.log('Manager: manager@globalremit.com / manager123456');
  console.log('Teller: teller@globalremit.com / teller123456');
  console.log('Compliance: compliance@globalremit.com / compliance123456');
  console.log('User: user@globalremit.com / user123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 