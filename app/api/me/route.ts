import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
   const session = await auth();
   if (!session?.user?.id) return NextResponse.json({ hasMembership: false });
   const membership = await prisma.membership.findFirst({ where: { userId: session.user.id } });
   return NextResponse.json({
      hasMembership: !!membership,
      organizationId: membership?.organizationId,
   });
}
