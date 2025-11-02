import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
   try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;

      // Check OpenAI API key (basic check)
      const openaiKey = process.env.OPENAI_API_KEY;
      const openaiOk = openaiKey && openaiKey.startsWith('sk-');

      return NextResponse.json({
         ok: true,
         status: 'healthy',
         timestamp: new Date().toISOString(),
         services: {
            database: 'connected',
            openai: openaiOk ? 'configured' : 'not configured',
         },
      });
   } catch (error) {
      console.error('Health check failed:', error);
      return NextResponse.json(
         {
            ok: false,
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
         },
         { status: 503 }
      );
   } finally {
      await prisma.$disconnect();
   }
}
