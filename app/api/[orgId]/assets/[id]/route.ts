import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
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

      const asset = await prisma.asset.findFirst({
         where: {
            id,
            content: { campaign: { organizationId: orgId } },
         },
         include: {
            content: true,
         },
      });

      if (!asset) {
         return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
      }

      return NextResponse.json(asset);
   } catch (error) {
      console.error('Error fetching asset:', error);
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
      const body = await request.json();

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CONTENT);

      // Verify asset belongs to org
      const existingAsset = await prisma.asset.findFirst({
         where: {
            id,
            content: { campaign: { organizationId: orgId } },
         },
      });

      if (!existingAsset) {
         return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
      }

      const updatedAsset = await prisma.asset.update({
         where: { id },
         data: {
            url: body.url,
            type: body.type,
         },
         include: {
            content: true,
         },
      });

      return NextResponse.json(updatedAsset);
   } catch (error) {
      console.error('Error updating asset:', error);
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

      // Verify asset belongs to org
      const existingAsset = await prisma.asset.findFirst({
         where: {
            id,
            content: { campaign: { organizationId: orgId } },
         },
      });

      if (!existingAsset) {
         return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
      }

      await prisma.asset.delete({
         where: { id },
      });

      return NextResponse.json({ message: 'Asset deleted successfully' });
   } catch (error) {
      console.error('Error deleting asset:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
