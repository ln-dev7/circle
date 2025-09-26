import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const updateCampaignSchema = z.object({
   name: z.string().min(3).max(100).optional(),
   summary: z.string().max(200).optional(),
   description: z.string().max(2000).optional(),
   status: z.enum(['DRAFT', 'PLANNING', 'READY', 'DONE', 'CANCELED']).optional(),
   health: z.enum(['ON_TRACK', 'AT_RISK', 'OFF_TRACK']).optional(),
   priority: z.enum(['NO_PRIORITY', 'LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
   leadId: z.string().cuid().optional(),
   startDate: z.string().datetime().optional(),
   targetDate: z.string().datetime().optional(),
});

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

      // Get campaign with all related data
      const campaign = await prisma.campaign.findFirst({
         where: {
            id: params.id,
            organizationId: params.orgId,
         },
         include: {
            lead: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
               },
            },
            members: {
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
            },
            tasks: {
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
                  },
               },
               orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
            },
            labels: true,
            milestones: {
               orderBy: { dueDate: 'asc' },
            },
            contents: {
               select: {
                  id: true,
                  title: true,
                  status: true,
                  createdAt: true,
               },
            },
            schedules: {
               select: {
                  id: true,
                  name: true,
                  status: true,
                  runAt: true,
                  channel: true,
               },
            },
            _count: {
               select: {
                  tasks: true,
                  members: true,
                  labels: true,
                  milestones: true,
                  contents: true,
                  schedules: true,
               },
            },
         },
      });

      if (!campaign) {
         return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      }

      return NextResponse.json(campaign);
   } catch (error) {
      console.error('Error fetching campaign:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
      const validatedData = updateCampaignSchema.parse(body);

      // Validate dates if both are provided
      if (validatedData.startDate && validatedData.targetDate) {
         const startDate = new Date(validatedData.startDate);
         const targetDate = new Date(validatedData.targetDate);

         if (startDate >= targetDate) {
            return NextResponse.json(
               { error: 'Target date must be after start date' },
               { status: 400 }
            );
         }
      }

      // Update campaign
      const updatedCampaign = await prisma.campaign.update({
         where: {
            id: params.id,
            organizationId: params.orgId,
         },
         data: {
            ...validatedData,
            startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
            targetDate: validatedData.targetDate ? new Date(validatedData.targetDate) : undefined,
         },
         include: {
            lead: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
               },
            },
            members: {
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
            },
            labels: true,
            milestones: true,
            _count: {
               select: {
                  tasks: true,
                  members: true,
                  labels: true,
                  milestones: true,
               },
            },
         },
      });

      return NextResponse.json(updatedCampaign);
   } catch (error) {
      console.error('Error updating campaign:', error);

      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { error: 'Invalid request data', details: error.errors },
            { status: 400 }
         );
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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

      // Only campaign OWNER or organization ADMIN can delete campaigns
      const campaignMember = await prisma.campaignMember.findUnique({
         where: {
            campaignId_userId: {
               campaignId: params.id,
               userId: session.user.id,
            },
         },
      });

      const canDelete = campaignMember?.role === 'OWNER' || membership.role === 'ADMIN';

      if (!canDelete) {
         return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      // Delete campaign (cascades to related data)
      await prisma.campaign.delete({
         where: {
            id: params.id,
            organizationId: params.orgId,
         },
      });

      return NextResponse.json({ message: 'Campaign deleted successfully' });
   } catch (error) {
      console.error('Error deleting campaign:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}
