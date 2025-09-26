import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { updateContentSchema } from '@/lib/schemas';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function GET(
   request: NextRequest,
   { params }: { params: { orgId: string; id: string } }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId, id } = params;

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CONTENT);

      const content = await prisma.content.findFirst({
         where: { id, campaign: { organizationId: orgId } },
         include: {
            campaign: true,
            assets: true,
         },
      });

      if (!content) {
         return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }

      return NextResponse.json(content);
   } catch (error) {
      console.error('Error fetching content:', error);
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}

export async function PUT(
   request: NextRequest,
   { params }: { params: { orgId: string; id: string } }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId, id } = params;

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CONTENT);

      const body = await request.json();
      const validatedData = updateContentSchema.parse(body);

      const content = await prisma.content.update({
         where: { id },
         data: validatedData,
         include: {
            campaign: true,
            assets: true,
         },
      });

      return NextResponse.json(content);
   } catch (error) {
      console.error('Error updating content:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: { orgId: string; id: string } }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId, id } = params;

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CONTENT);

      await prisma.content.delete({
         where: { id },
      });

      return NextResponse.json({ message: 'Content deleted' });
   } catch (error) {
      console.error('Error deleting content:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
