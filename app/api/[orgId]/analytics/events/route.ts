import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createAnalyticsEventSchema } from '@/lib/schemas';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function GET(request: NextRequest, { params }: { params: { orgId: string } }) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId } = params;

      await requirePermission(session.user.id, orgId, PERMISSIONS.VIEW_ANALYTICS);

      const events = await (prisma as any).analyticsEvent.findMany({
         where: { userId: session.user.id },
         orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(events);
   } catch (error) {
      console.error('Error fetching analytics events:', error);
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}

export async function POST(request: NextRequest, { params }: { params: { orgId: string } }) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId } = params;

      await requirePermission(session.user.id, orgId, PERMISSIONS.VIEW_ANALYTICS);

      const body = await request.json();
      const validatedData = createAnalyticsEventSchema.parse(body);

      const event = await (prisma as any).analyticsEvent.create({
         data: {
            ...validatedData,
            userId: session.user.id,
            organizationId: params.orgId,
         },
      });

      return NextResponse.json(event, { status: 201 });
   } catch (error) {
      console.error('Error creating analytics event:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
