require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Technical Issue" },
      update: {},
      create: {
        name: "Technical Issue",
        description: "Software, hardware, or system issues",
      },
    }),
    prisma.category.upsert({
      where: { name: "Billing" },
      update: {},
      create: {
        name: "Billing",
        description: "Payment and billing related complaints",
      },
    }),
    prisma.category.upsert({
      where: { name: "Account" },
      update: {},
      create: {
        name: "Account",
        description: "Account access and management issues",
      },
    }),
    prisma.category.upsert({
      where: { name: "General Inquiry" },
      update: {},
      create: {
        name: "General Inquiry",
        description: "General questions and inquiries",
      },
    }),
    prisma.category.upsert({
      where: { name: "Feature Request" },
      update: {},
      create: {
        name: "Feature Request",
        description: "Requests for new features or improvements",
      },
    }),
  ]);

  console.log("✅ Created categories");

  // Create admin user
  const hashedPassword = await bcrypt.hash("Admin@123456", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log("✅ Created admin user");

  // Create agent users
  const agentPassword = await bcrypt.hash("Agent@123456", 12);

  const agent1 = await prisma.user.upsert({
    where: { email: "agent1@example.com" },
    update: {},
    create: {
      email: "agent1@example.com",
      name: "John Agent",
      password: agentPassword,
      role: "AGENT",
      emailVerified: new Date(),
    },
  });

  const agent2 = await prisma.user.upsert({
    where: { email: "agent2@example.com" },
    update: {},
    create: {
      email: "agent2@example.com",
      name: "Jane Agent",
      password: agentPassword,
      role: "AGENT",
      emailVerified: new Date(),
    },
  });

  console.log("✅ Created agent users");

  // Create customer user
  const customerPassword = await bcrypt.hash("Customer@123456", 12);

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "John Customer",
      password: customerPassword,
      role: "CUSTOMER",
      emailVerified: new Date(),
    },
  });

  console.log("✅ Created customer user");

  // Create sample issues
  const issues = await Promise.all([
    prisma.issue.create({
      data: {
        ticketId: `TKT-${Date.now().toString(36).toUpperCase()}-1`,
        title: "Login page not loading",
        description: "The login page shows a blank screen on Firefox browser",
        categoryId: categories[0].id,
        priority: "HIGH",
        status: "IN_PROGRESS",
        createdById: customer.id,
        assignedToId: agent1.id,
      },
    }),
    prisma.issue.create({
      data: {
        ticketId: `TKT-${Date.now().toString(36).toUpperCase()}-2`,
        title: "Duplicate charge on account",
        description: "I was charged twice for my subscription last month",
        categoryId: categories[1].id,
        priority: "CRITICAL",
        status: "NEW",
        createdById: customer.id,
      },
    }),
    prisma.issue.create({
      data: {
        ticketId: `TKT-${Date.now().toString(36).toUpperCase()}-3`,
        title: "Password reset email not received",
        description: "I requested a password reset but didn't receive the email",
        categoryId: categories[2].id,
        priority: "MEDIUM",
        status: "ASSIGNED",
        createdById: customer.id,
        assignedToId: agent2.id,
      },
    }),
    prisma.issue.create({
      data: {
        ticketId: `TKT-${Date.now().toString(36).toUpperCase()}-4`,
        title: "How do I enable two-factor authentication?",
        description: "Need instructions on setting up 2FA for my account",
        categoryId: categories[3].id,
        priority: "LOW",
        status: "RESOLVED",
        createdById: customer.id,
        assignedToId: agent1.id,
        resolvedAt: new Date(),
      },
    }),
  ]);

  console.log("✅ Created sample issues");

  // Create sample comments
  await prisma.comment.create({
    data: {
      content: "I've started investigating this issue. Will update you soon.",
      authorId: agent1.id,
      issueId: issues[0].id,
    },
  });

  console.log("✅ Created sample comments");

  console.log("🎉 Database seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
