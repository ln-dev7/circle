import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const addMemberSchema = z.object({
   userId: z.string().cuid(),
   role: z.enum(['OWNER', 'MANAGER', 'MEMBER', 'VIEWER']).default('MEMBER'),
});

// const updateMemberSchema = z.object({
//   role: z.enum(['OWNER', 'MANAGER', 'MEMBER', 'VIEWER']),
// });

export async function GET(
   request: NextRequest,
   { params }: { params: { orgId: string; id: string } }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Check if user has access to this organization
      const membership = await prisma.membership.findUnique({
         where: {
            userId_organizationId: {
               userId: session.user.id,
               organizationId: params.orgId,
            },
         },
      });

      if (!membership) {
         return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      // Get campaign members
      const members = await prisma.campaignMember.findMany({
         where: {
            campaignId: params.id,
         },
         include: {
            user: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
               },
            },
         },
         orderBy: [{ role: 'asc' }, { createdAt: 'asc' }],
      });

      return NextResponse.json(members);
   } catch (error) {
      console.error('Error fetching campaign members:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}

export async function POST(
   request: NextRequest,
   { params }: { params: { orgId: string; id: string } }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Check if user has access to this organization
      const membership = await prisma.membership.findUnique({
         where: {
            userId_organizationId: {
               userId: session.user.id,
               organizationId: params.orgId,
            },
         },
      });

      if (!membership) {
         return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      // Check if user is campaign member with edit permissions
      const campaignMember = await prisma.campaignMember.findUnique({
         where: {
            campaignId_userId: {
               campaignId: params.id,
               userId: session.user.id,
            },
         },
      });

      if (!campaignMember || !['OWNER', 'MANAGER'].includes(campaignMember.role)) {
         return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      const body = await request.json();
      const validatedData = addMemberSchema.parse(body);

      // Check if user exists in organization
      const targetUserMembership = await prisma.membership.findUnique({
         where: {
            userId_organizationId: {
               userId: validatedData.userId,
               organizationId: params.orgId,
            },
         },
      });

      if (!targetUserMembership) {
         return NextResponse.json(
            { error: 'User is not a member of this organization' },
            { status: 400 }
         );
      }

      // Check if user is already a campaign member
      const existingMember = await prisma.campaignMember.findUnique({
         where: {
            campaignId_userId: {
               campaignId: params.id,
               userId: validatedData.userId,
            },
         },
      });

      if (existingMember) {
         return NextResponse.json(
            { error: 'User is already a member of this campaign' },
            { status: 400 }
         );
      }

      // Add member to campaign
      const newMember = await prisma.campaignMember.create({
         data: {
            campaignId: params.id,
            userId: validatedData.userId,
            role: validatedData.role,
         },
         include: {
            user: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
               },
            },
         },
      });

      return NextResponse.json(newMember, { status: 201 });
   } catch (error) {
      console.error('Error adding campaign member:', error);

      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { error: 'Invalid request data', details: error.errors },
            { status: 400 }
         );
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}
