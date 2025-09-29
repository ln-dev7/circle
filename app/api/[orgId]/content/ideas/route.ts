import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateIdeas } from '@/lib/openai';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function POST(request: NextRequest, { params }: { params: { orgId: string } }) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId } = params;

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CONTENT);

      const body = await request.json();
      const { topic, count = 5, type = 'general' } = body;

      if (!topic) {
         return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
      }

      const ideas = await generateIdeas({
         topic,
         count,
         type,
      });

      return NextResponse.json({ ideas }, { status: 200 });
   } catch (error) {
      console.error('Error generating ideas:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
