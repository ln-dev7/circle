import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const createCampaignSchema = z.object({
   name: z.string().min(3).max(100),
   summary: z.string().max(200).optional(),
   description: z.string().max(2000).optional(),
   status: z.enum(['DRAFT', 'PLANNING', 'READY', 'DONE', 'CANCELED']).default('DRAFT'),
   health: z.enum(['ON_TRACK', 'AT_RISK', 'OFF_TRACK']).default('ON_TRACK'),
   priority: z.enum(['NO_PRIORITY', 'LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('NO_PRIORITY'),
   leadId: z.string().cuid().optional(),
   startDate: z.string().datetime().optional(),
   targetDate: z.string().datetime().optional(),
});

const getCampaignsSchema = z.object({
   status: z.enum(['DRAFT', 'PLANNING', 'READY', 'DONE', 'CANCELED']).optional(),
   health: z.enum(['ON_TRACK', 'AT_RISK', 'OFF_TRACK']).optional(),
   priority: z.enum(['NO_PRIORITY', 'LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
   search: z.string().optional(),
   page: z.coerce.number().min(1).default(1),
   limit: z.coerce.number().min(1).max(100).default(20),
});

export async function GET(request: NextRequest, { params }: { params: { orgId: string } }) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { searchParams } = new URL(request.url);
      const query = getCampaignsSchema.parse({
         status: searchParams.get('status'),
         health: searchParams.get('health'),
         priority: searchParams.get('priority'),
         search: searchParams.get('search'),
         page: searchParams.get('page'),
         limit: searchParams.get('limit'),
      });

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

      // Build where clause
      const where: any = {
         organizationId: params.orgId,
      };

      if (query.status) {
         where.status = query.status;
      }

      if (query.health) {
         where.health = query.health;
      }

      if (query.priority) {
         where.priority = query.priority;
      }

      if (query.search) {
         where.OR = [
            { name: { contains: query.search, mode: 'insensitive' } },
            { summary: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
         ];
      }

      // Get total count for pagination
      const total = await prisma.campaign.count({ where });

      // Get campaigns with pagination
      const campaigns = await prisma.campaign.findMany({
         where,
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
               select: {
                  id: true,
                  status: true,
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
         orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
         skip: (query.page - 1) * query.limit,
         take: query.limit,
      });

      // Calculate pagination info
      const totalPages = Math.ceil(total / query.limit);
      const hasNextPage = query.page < totalPages;
      const hasPrevPage = query.page > 1;

      return NextResponse.json({
         campaigns,
         pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages,
            hasNextPage,
            hasPrevPage,
         },
      });
   } catch (error) {
      console.error('Error fetching campaigns:', error);

      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { error: 'Invalid query parameters', details: error.errors },
            { status: 400 }
         );
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}

export async function POST(request: NextRequest, { params }: { params: { orgId: string } }) {
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

      // Only ADMIN and BRAND_OWNER can create campaigns
      if (!['ADMIN', 'BRAND_OWNER'].includes(membership.role)) {
         return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      const body = await request.json();
      const validatedData = createCampaignSchema.parse(body);

      // Validate dates
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

      // Create campaign
      const campaign = await prisma.campaign.create({
         data: {
            ...validatedData,
            organizationId: params.orgId,
            startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
            targetDate: validatedData.targetDate ? new Date(validatedData.targetDate) : null,
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

      // Add creator as campaign member with OWNER role
      await prisma.campaignMember.create({
         data: {
            campaignId: campaign.id,
            userId: session.user.id,
            role: 'OWNER',
         },
      });

      return NextResponse.json(campaign, { status: 201 });
   } catch (error) {
      console.error('Error creating campaign:', error);

      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { error: 'Invalid request data', details: error.errors },
            { status: 400 }
         );
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}
