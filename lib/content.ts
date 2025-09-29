import prisma from './prisma';

export async function getContent(orgId: string, contentId: string) {
   try {
      const content = await prisma.content.findFirst({
         where: {
            id: contentId,
            campaign: { organizationId: orgId },
         },
         include: {
            campaign: true,
            assets: true,
         },
      });

      return content;
   } catch (error) {
      console.error('Error fetching content:', error);
      return null;
   }
}

export async function getContents(
   orgId: string,
   filters?: {
      campaignId?: string;
      status?: string;
   }
) {
   try {
      const where: any = {
         campaign: { organizationId: orgId },
      };

      if (filters?.campaignId) {
         where.campaignId = filters.campaignId;
      }

      if (filters?.status) {
         where.status = filters.status;
      }

      const contents = await prisma.content.findMany({
         where,
         include: {
            campaign: true,
            assets: true,
         },
         orderBy: { createdAt: 'desc' },
      });

      return contents;
   } catch (error) {
      console.error('Error fetching contents:', error);
      return [];
   }
}
