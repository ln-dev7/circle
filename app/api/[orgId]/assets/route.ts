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
      const { searchParams } = new URL(request.url);
      const contentId = searchParams.get('contentId');

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CONTENT);

      const where = contentId
         ? { content: { campaign: { organizationId: orgId } }, contentId }
         : { content: { campaign: { organizationId: orgId } } };

      const assets = await prisma.asset.findMany({
         where,
         include: {
            content: true,
         },
      });

      return NextResponse.json(assets);
   } catch (error) {
      console.error('Error fetching assets:', error);
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
