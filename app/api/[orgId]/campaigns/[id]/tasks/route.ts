import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const createTaskSchema = z.object({
   title: z.string().min(3).max(200),
   description: z.string().max(2000).optional(),
   status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED']).default('TODO'),
   priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
   assigneeId: z.string().cuid().optional(),
   dueDate: z.string().datetime().optional(),
   parentTaskId: z.string().cuid().optional(),
});

// const updateTaskSchema = z.object({
//   title: z.string().min(3).max(200).optional(),
//   description: z.string().max(3).max(2000).optional(),
//   status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED']).optional(),
//   priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
//   assigneeId: z.string().cuid().optional(),
//   dueDate: z.string().datetime().optional(),
//   parentTaskId: z.string().cuid().optional(),
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

      // Get tasks for the campaign
      const tasks = await prisma.campaignTask.findMany({
         where: {
            campaignId: params.id,
            parentTaskId: null, // Only get top-level tasks
         },
         include: {
            assignee: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
               },
            },
            subtasks: {
               include: {
                  assignee: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                     },
                  },
               },
               orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
            },
         },
         orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      });

      return NextResponse.json(tasks);
   } catch (error) {
      console.error('Error fetching campaign tasks:', error);
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
      const validatedData = createTaskSchema.parse(body);

      // Create task
      const task = await prisma.campaignTask.create({
         data: {
            ...validatedData,
            campaignId: params.id,
            dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
         },
         include: {
            assignee: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
               },
            },
            subtasks: true,
         },
      });

      return NextResponse.json(task, { status: 201 });
   } catch (error) {
      console.error('Error creating campaign task:', error);

      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { error: 'Invalid request data', details: error.errors },
            { status: 400 }
         );
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}
