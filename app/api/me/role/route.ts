import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole } from '@/lib/rbac';

export async function GET(request: NextRequest) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { searchParams } = new URL(request.url);
      const orgId = searchParams.get('orgId');

      if (!orgId) {
         return NextResponse.json({ error: 'Organization ID required' }, { status: 400 });
      }

      const userRole = await getUserRole(orgId);

      if (!userRole) {
         return NextResponse.json(
            { error: 'No role found for this organization' },
            { status: 403 }
         );
      }

      return NextResponse.json({ role: userRole });
   } catch (error) {
      console.error('Error fetching user role:', error);
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
