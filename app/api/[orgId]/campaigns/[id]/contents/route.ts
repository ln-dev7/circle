import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
   request: NextRequest,
   { params }: { params: { orgId: string; id: string } }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Check if user has access to this organization
      const membership = await prisma.membership.findUnique({
         where: {
            userId_organizationId: {
               userId: session.user.id,
               organizationId: params.orgId,
            },
         },
      });

      if (!membership) {
         return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      // Fetch contents for the specific campaign
      const contents = await prisma.content.findMany({
         where: {
            campaignId: params.id,
            organizationId: params.orgId,
         },
         include: {
            campaign: {
               select: {
                  id: true,
                  title: true,
               },
            },
            creator: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
               },
            },
         },
         orderBy: {
            createdAt: 'desc',
         },
      });

      return NextResponse.json({ contents });
   } catch (error) {
      console.error('Error fetching campaign contents:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}
