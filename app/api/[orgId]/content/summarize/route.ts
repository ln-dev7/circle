import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { summarizeContent } from '@/lib/openai';
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
      const { content, length = 'brief' } = body;

      if (!content) {
         return NextResponse.json({ error: 'Content is required' }, { status: 400 });
      }

      const summary = await summarizeContent({
         content,
         length,
      });

      return NextResponse.json({ summary }, { status: 200 });
   } catch (error) {
      console.error('Error summarizing content:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
