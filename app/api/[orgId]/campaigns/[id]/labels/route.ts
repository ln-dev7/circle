import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const createLabelSchema = z.object({
   name: z.string().min(1).max(50),
   color: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i)
      .default('#3B82F6'),
});

// const updateLabelSchema = z.object({
//   name: z.string().min(1).max(50).optional(),
//   color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
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

      // Get campaign labels
      const labels = await prisma.campaignLabel.findMany({
         where: {
            campaignId: params.id,
         },
         orderBy: [{ name: 'asc' }],
      });

      return NextResponse.json(labels);
   } catch (error) {
      console.error('Error fetching campaign labels:', error);
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
      const validatedData = createLabelSchema.parse(body);

      // Check if label name already exists for this campaign
      const existingLabel = await prisma.campaignLabel.findUnique({
         where: {
            campaignId_name: {
               campaignId: params.id,
               name: validatedData.name,
            },
         },
      });

      if (existingLabel) {
         return NextResponse.json(
            { error: 'Label with this name already exists' },
            { status: 400 }
         );
      }

      // Create label
      const label = await prisma.campaignLabel.create({
         data: {
            ...validatedData,
            campaignId: params.id,
         },
      });

      return NextResponse.json(label, { status: 201 });
   } catch (error) {
      console.error('Error creating campaign label:', error);

      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { error: 'Invalid request data', details: error.errors },
            { status: 400 }
         );
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}
