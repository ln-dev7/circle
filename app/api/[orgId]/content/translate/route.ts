import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { translateContent } from '@/lib/openai';
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
      const { content, targetLanguage, sourceLanguage } = body;

      if (!content || !targetLanguage) {
         return NextResponse.json(
            { error: 'Content and target language are required' },
            { status: 400 }
         );
      }

      const translatedContent = await translateContent({
         content,
         targetLanguage,
         sourceLanguage,
      });

      return NextResponse.json({ translatedContent }, { status: 200 });
   } catch (error) {
      console.error('Error translating content:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
