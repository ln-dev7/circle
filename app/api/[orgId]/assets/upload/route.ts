import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest, { params }: { params: { orgId: string } }) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId } = params;

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CONTENT);

      // Parse multipart form data
      const form = formidable({
         uploadDir: path.join(process.cwd(), 'public/uploads'),
         keepExtensions: true,
      });

      const [fields, files] = await form.parse(request as any);

      const contentId = fields.contentId?.[0];
      const file = files.file?.[0];

      if (!contentId || !file) {
         return NextResponse.json({ error: 'Missing contentId or file' }, { status: 400 });
      }

      // Verify content belongs to org
      const content = await prisma.content.findFirst({
         where: { id: contentId, campaign: { organizationId: orgId } },
      });
      if (!content) {
         return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }

      // Mock URL - in real implementation, upload to cloud storage
      const mockUrl = `/uploads/${file.newFilename}`;

      const asset = await prisma.asset.create({
         data: {
            url: mockUrl,
            name: fields.name?.[0] || file.originalFilename || 'Untitled',
            type: file.mimetype || 'unknown',
            size: file.size,
            description: fields.description?.[0],
            tags: fields.tags?.[0] ? JSON.parse(fields.tags[0]) : [],
            contentId,
         },
      });

      return NextResponse.json(asset, { status: 201 });
   } catch (error) {
      console.error('Error uploading asset:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
