import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function GET(request: NextRequest, { params }: { params: { orgId: string } }) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId } = params;

      await requirePermission(session.user.id, orgId, PERMISSIONS.VIEW_ANALYTICS);

      // Get metrics for the org - count events by type
      const eventCounts = await prisma.analyticsEvent.groupBy({
         by: ['event'],
         where: { organizationId: params.orgId },
         _count: {
            event: true,
         },
      });

      // Get campaign-specific metrics
      const campaignMetrics = await prisma.campaign.findMany({
         where: { organizationId: params.orgId },
         include: {
            contents: {
               include: {
                  analyticsEvents: true,
               },
            },
            analyticsEvents: true,
         },
      });

      // Calculate aggregated metrics
      const totalImpressions = eventCounts.find((e) => e.event === 'impression')?._count.event || 0;
      const totalClicks = eventCounts.find((e) => e.event === 'click')?._count.event || 0;
      const totalViews = eventCounts.find((e) => e.event === 'view')?._count.event || 0;

      const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      // Calculate ROI (simplified - assuming some conversion value)
      const conversions = eventCounts.find((e) => e.event === 'conversion')?._count.event || 0;
      const roi = conversions > 0 ? ((conversions * 100) / totalClicks) * 100 : 0; // Assuming $100 per conversion

      const metrics = {
         totalEvents: eventCounts.reduce((sum, item) => sum + item._count.event, 0),
         eventsByType: eventCounts.reduce(
            (acc, item) => {
               acc[item.event] = item._count.event;
               return acc;
            },
            {} as Record<string, number>
         ),
         impressions: totalImpressions,
         clicks: totalClicks,
         views: totalViews,
         ctr: ctr,
         roi: roi,
         campaignMetrics: campaignMetrics.map((campaign) => ({
            id: campaign.id,
            name: campaign.name,
            totalEvents: campaign.analyticsEvents.length,
            contentCount: campaign.contents.length,
            contentMetrics: campaign.contents.map((content) => ({
               id: content.id,
               title: content.title,
               events: content.analyticsEvents.length,
               impressions: content.analyticsEvents.filter((e) => e.event === 'impression').length,
               clicks: content.analyticsEvents.filter((e) => e.event === 'click').length,
               views: content.analyticsEvents.filter((e) => e.event === 'view').length,
            })),
         })),
      };

      return NextResponse.json(metrics);
   } catch (error) {
      console.error('Error fetching analytics metrics:', error);
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
