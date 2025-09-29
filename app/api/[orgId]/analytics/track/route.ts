import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function POST(request: NextRequest, { params }: { params: { orgId: string } }) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId } = params;

      await requirePermission(session.user.id, orgId, PERMISSIONS.VIEW_ANALYTICS);

      const body = await request.json();
      const { event, campaignId, contentId, data } = body;

      if (!event) {
         return NextResponse.json({ error: 'Event type is required' }, { status: 400 });
      }

      // Validate that campaign and content belong to the organization
      if (campaignId) {
         const campaign = await prisma.campaign.findFirst({
            where: {
               id: campaignId,
               organizationId: orgId,
            },
         });
         if (!campaign) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
         }
      }

      if (contentId) {
         const content = await prisma.content.findFirst({
            where: {
               id: contentId,
               campaign: {
                  organizationId: orgId,
               },
            },
         });
         if (!content) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
         }
      }

      const analyticsEvent = await prisma.analyticsEvent.create({
         data: {
            event,
            data,
            userId: session.user.id,
            organizationId: orgId,
            campaignId: campaignId || null,
            contentId: contentId || null,
         },
      });

      return NextResponse.json(analyticsEvent, { status: 201 });
   } catch (error) {
      console.error('Error tracking analytics event:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
