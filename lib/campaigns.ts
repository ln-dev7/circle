import prisma from './prisma';

export async function getCampaign(orgId: string, campaignId: string) {
   try {
      const campaign = await prisma.campaign.findFirst({
         where: {
            id: campaignId,
            organizationId: orgId,
         },
         include: {
            lead: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
               },
            },
            members: {
               include: {
                  user: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                     },
                  },
               },
            },
            tasks: {
               include: {
                  assignee: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                     },
                  },
                  subtasks: {
                     include: {
                        assignee: {
                           select: {
                              id: true,
                              name: true,
                              email: true,
                              image: true,
                           },
                        },
                     },
                  },
               },
               orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
            },
            labels: true,
            milestones: {
               orderBy: { dueDate: 'asc' },
            },
            contents: {
               include: {
                  assets: true,
               },
            },
            schedules: true,
            _count: {
               select: {
                  tasks: true,
                  members: true,
                  labels: true,
                  milestones: true,
                  contents: true,
                  schedules: true,
               },
            },
         },
      });

      return campaign;
   } catch (error) {
      console.error('Error fetching campaign:', error);
      return null;
   }
}

export async function getCampaigns(orgId: string) {
   try {
      const campaigns = await prisma.campaign.findMany({
         where: { organizationId: orgId },
         include: {
            contents: true,
            schedules: true,
         },
         orderBy: { createdAt: 'desc' },
      });

      return campaigns;
   } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
   }
}
