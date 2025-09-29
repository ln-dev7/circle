import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
   console.log('🌱 Seeding database...');

   // Create organization
   const organization = await prisma.organization.upsert({
      where: { id: 'org_default_seed' },
      update: {},
      create: {
         id: 'org_default_seed',
         name: 'Default Organization',
      },
   });

   // Create users
   const user1 = await prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
         email: 'john@example.com',
         name: 'John Doe',
      },
   });

   const user2 = await prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
         email: 'jane@example.com',
         name: 'Jane Smith',
      },
   });

   const user3 = await prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
         email: 'bob@example.com',
         name: 'Bob Johnson',
      },
   });

   // Create memberships
   await prisma.membership.upsert({
      where: { userId_organizationId: { userId: user1.id, organizationId: organization.id } },
      update: {},
      create: {
         userId: user1.id,
         organizationId: organization.id,
         role: 'ADMIN',
      },
   });

   await prisma.membership.upsert({
      where: { userId_organizationId: { userId: user2.id, organizationId: organization.id } },
      update: {},
      create: {
         userId: user2.id,
         organizationId: organization.id,
         role: 'BRAND_OWNER',
      },
   });

   await prisma.membership.upsert({
      where: { userId_organizationId: { userId: user3.id, organizationId: organization.id } },
      update: {},
      create: {
         userId: user3.id,
         organizationId: organization.id,
         role: 'CREATOR',
      },
   });

   // Create campaigns
   const campaign1 = await prisma.campaign.create({
      data: {
         name: 'Summer Marketing Campaign 2024',
         summary: 'Boost summer sales with targeted social media campaigns',
         description:
            'A comprehensive marketing campaign targeting young adults during summer months. Focus on social media platforms and influencer partnerships.',
         organizationId: organization.id,
         leadId: user1.id,
         health: 'ON_TRACK',
         status: 'PLANNING',
         priority: 'HIGH',
         startDate: new Date('2024-06-01'),
         targetDate: new Date('2024-08-31'),
      },
   });

   const campaign2 = await prisma.campaign.create({
      data: {
         name: 'Product Launch Q4',
         summary: 'Launch new product line with multi-channel marketing',
         description:
            'Strategic launch campaign for our new product line. Includes PR, social media, and influencer marketing.',
         organizationId: organization.id,
         leadId: user2.id,
         health: 'AT_RISK',
         status: 'READY',
         priority: 'URGENT',
         startDate: new Date('2024-10-01'),
         targetDate: new Date('2024-12-31'),
      },
   });

   const campaign3 = await prisma.campaign.create({
      data: {
         name: 'Brand Awareness Campaign',
         summary: 'Increase brand recognition in target markets',
         description:
            'Long-term brand awareness campaign focusing on content marketing and thought leadership.',
         organizationId: organization.id,
         leadId: user3.id,
         health: 'OFF_TRACK',
         status: 'DRAFT',
         priority: 'MEDIUM',
         startDate: new Date('2024-09-01'),
         targetDate: new Date('2025-02-28'),
      },
   });

   // Create campaign members
   await prisma.campaignMember.createMany({
      data: [
         {
            campaignId: campaign1.id,
            userId: user1.id,
            role: 'OWNER',
         },
         {
            campaignId: campaign1.id,
            userId: user2.id,
            role: 'MANAGER',
         },
         {
            campaignId: campaign1.id,
            userId: user3.id,
            role: 'MEMBER',
         },
         {
            campaignId: campaign2.id,
            userId: user2.id,
            role: 'OWNER',
         },
         {
            campaignId: campaign2.id,
            userId: user1.id,
            role: 'MANAGER',
         },
         {
            campaignId: campaign3.id,
            userId: user3.id,
            role: 'OWNER',
         },
      ],
   });

   // Create campaign labels
   await prisma.campaignLabel.createMany({
      data: [
         {
            campaignId: campaign1.id,
            name: 'Summer',
            color: '#FF6B6B',
         },
         {
            campaignId: campaign1.id,
            name: 'Social Media',
            color: '#4ECDC4',
         },
         {
            campaignId: campaign2.id,
            name: 'Product Launch',
            color: '#45B7D1',
         },
         {
            campaignId: campaign2.id,
            name: 'Q4',
            color: '#96CEB4',
         },
         {
            campaignId: campaign3.id,
            name: 'Brand',
            color: '#FFEAA7',
         },
      ],
   });

   // Create campaign tasks
   const task1 = await prisma.campaignTask.create({
      data: {
         title: 'Design social media assets',
         description: 'Create visual assets for Instagram, Facebook, and Twitter',
         campaignId: campaign1.id,
         assigneeId: user3.id,
         status: 'IN_PROGRESS',
         priority: 'HIGH',
         dueDate: new Date('2024-06-15'),
      },
   });

   const task2 = await prisma.campaignTask.create({
      data: {
         title: 'Plan influencer partnerships',
         description: 'Research and contact potential influencers for collaboration',
         campaignId: campaign1.id,
         assigneeId: user2.id,
         status: 'TODO',
         priority: 'MEDIUM',
         dueDate: new Date('2024-06-20'),
      },
   });

   const task3 = await prisma.campaignTask.create({
      data: {
         title: 'Create campaign timeline',
         description: 'Develop detailed timeline for campaign execution',
         campaignId: campaign1.id,
         assigneeId: user1.id,
         status: 'DONE',
         priority: 'LOW',
         dueDate: new Date('2024-06-10'),
      },
   });

   // Create subtasks
   await prisma.campaignTask.create({
      data: {
         title: 'Instagram post designs',
         description: 'Design 10 Instagram posts for the campaign',
         campaignId: campaign1.id,
         assigneeId: user3.id,
         status: 'TODO',
         priority: 'HIGH',
         dueDate: new Date('2024-06-12'),
         parentTaskId: task1.id,
      },
   });

   await prisma.campaignTask.create({
      data: {
         title: 'Facebook banner designs',
         description: 'Create Facebook banner and cover images',
         campaignId: campaign1.id,
         assigneeId: user3.id,
         status: 'TODO',
         priority: 'MEDIUM',
         dueDate: new Date('2024-06-14'),
         parentTaskId: task1.id,
      },
   });

   // Create campaign milestones
   await prisma.campaignMilestone.createMany({
      data: [
         {
            campaignId: campaign1.id,
            title: 'Campaign Planning Complete',
            description: 'All planning documents and strategies finalized',
            dueDate: new Date('2024-06-15'),
            completedAt: new Date('2024-06-10'),
         },
         {
            campaignId: campaign1.id,
            title: 'Asset Creation Complete',
            description: 'All visual and content assets created',
            dueDate: new Date('2024-06-30'),
         },
         {
            campaignId: campaign1.id,
            title: 'Campaign Launch',
            description: 'Campaign goes live across all channels',
            dueDate: new Date('2024-07-01'),
         },
         {
            campaignId: campaign1.id,
            title: 'Campaign Completion',
            description: 'Campaign ends and results are analyzed',
            dueDate: new Date('2024-08-31'),
         },
      ],
   });

   // Create content for campaigns
   const content1 = await prisma.content.create({
      data: {
         title: 'Summer Vibes Social Media Post',
         body: 'Get ready for summer with our amazing deals! 🌞☀️ #SummerVibes #Marketing',
         campaignId: campaign1.id,
         status: 'APPROVED',
      },
   });

   const content2 = await prisma.content.create({
      data: {
         title: 'Product Launch Announcement',
         body: 'Exciting news! Our new product line is launching soon. Stay tuned for updates! 🚀',
         campaignId: campaign2.id,
         status: 'DRAFT',
      },
   });

   // Create schedules
   await prisma.schedule.create({
      data: {
         name: 'Summer Campaign Launch',
         campaignId: campaign1.id,
         contentId: content1.id,
         channel: 'INSTAGRAM',
         runAt: new Date('2024-07-01T10:00:00Z'),
         timezone: 'UTC',
         status: 'PENDING',
      },
   });

   console.log('✅ Database seeded successfully!');
   console.log(`📊 Created ${organization.name} with campaigns and team members`);
}

main()
   .catch((e) => {
      console.error('❌ Error seeding database:', e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
