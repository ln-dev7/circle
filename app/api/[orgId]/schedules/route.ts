import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createScheduleSchema } from '@/lib/schemas';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function GET(request: NextRequest, { params }: { params: { orgId: string } }) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json(
            { ok: false, error: { code: 'E_UNAUTHORIZED', message: 'Unauthorized' } },
            { status: 401 }
         );
      }

      const { orgId } = params;
      const { searchParams } = new URL(request.url);
      const from = searchParams.get('from');
      const to = searchParams.get('to');
      const channels = searchParams.get('channels')?.split(',');
      const campaigns = searchParams.get('campaigns')?.split(',');

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_SCHEDULES);

      const where: any = {
         campaign: { organizationId: orgId },
      };

      // Add date range filter
      if (from && to) {
         where.runAt = {
            gte: new Date(from),
            lte: new Date(to),
         };
      }

      // Add channel filter
      if (channels && channels.length > 0) {
         where.channel = { in: channels };
      }

      // Add campaign filter
      if (campaigns && campaigns.length > 0) {
         where.campaignId = { in: campaigns };
      }

      const schedules = await prisma.schedule.findMany({
         where,
         include: {
            campaign: true,
            content: true,
         },
         orderBy: { runAt: 'asc' },
      });

      return NextResponse.json({ ok: true, data: schedules });
   } catch (error) {
      console.error('Error fetching schedules:', error);
      return NextResponse.json(
         { ok: false, error: { code: 'E_INTERNAL', message: 'Internal server error' } },
         { status: 500 }
      );
   }
}

export async function POST(request: NextRequest, { params }: { params: { orgId: string } }) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json(
            { ok: false, error: { code: 'E_UNAUTHORIZED', message: 'Unauthorized' } },
            { status: 401 }
         );
      }

      const { orgId } = params;

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_SCHEDULES);

      const body = await request.json();
      const validatedData = createScheduleSchema.parse(body);

      // Verify campaign belongs to org
      const campaign = await prisma.campaign.findFirst({
         where: { id: validatedData.campaignId, organizationId: orgId },
      });
      if (!campaign) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Campaign not found' },
            },
            { status: 404 }
         );
      }

      // Verify content belongs to campaign
      const content = await prisma.content.findFirst({
         where: { id: validatedData.contentId, campaignId: validatedData.campaignId },
      });
      if (!content) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Content not found' },
            },
            { status: 404 }
         );
      }

      // Check for potential conflicts (same channel at overlapping times)
      const conflictingSchedule = await prisma.schedule.findFirst({
         where: {
            channel: validatedData.channel,
            runAt: {
               gte: new Date(new Date(validatedData.runAt).getTime() - 15 * 60 * 1000), // 15 minutes before
               lte: new Date(new Date(validatedData.runAt).getTime() + 15 * 60 * 1000), // 15 minutes after
            },
            status: { not: 'CANCELLED' },
         },
      });

      if (conflictingSchedule) {
         return NextResponse.json(
            {
               ok: false,
               error: {
                  code: 'E_CONFLICT_SLOT',
                  message: 'Potential scheduling conflict detected',
                  details: { conflictingScheduleId: conflictingSchedule.id },
               },
            },
            { status: 409 }
         );
      }

      // Create schedule and update content status in a transaction
      const result = await prisma.$transaction(async (tx) => {
         const schedule = await tx.schedule.create({
            data: {
               runAt: new Date(validatedData.runAt),
               timezone: validatedData.timezone,
               channel: validatedData.channel,
               status: validatedData.status || 'PENDING',
               campaignId: validatedData.campaignId,
               contentId: validatedData.contentId,
            },
            include: {
               campaign: true,
               content: true,
            },
         });

         // Update content status to SCHEDULED
         await tx.content.update({
            where: { id: validatedData.contentId },
            data: { status: 'SCHEDULED' },
         });

         return schedule;
      });

      return NextResponse.json({ ok: true, data: result }, { status: 201 });
   } catch (error) {
      console.error('Error creating schedule:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_FORBIDDEN', message: 'Forbidden' },
            },
            { status: 403 }
         );
      }
      if (error instanceof Error && error.message.includes('Invalid date')) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_VALIDATION', message: 'Invalid date format' },
            },
            { status: 400 }
         );
      }
      return NextResponse.json(
         { ok: false, error: { code: 'E_INTERNAL', message: 'Internal server error' } },
         { status: 500 }
      );
   }
}
