import { NextRequest, NextResponse } from 'next/server';
import { runCronJob } from '@/lib/cron-worker';

export async function POST(request: NextRequest) {
   try {
      // You might want to add authentication/authorization here
      // to prevent unauthorized access to the cron endpoint

      const result = await runCronJob();

      if (result.success) {
         return NextResponse.json({
            message: 'Cron job executed successfully',
            published: result.published,
         });
      } else {
         return NextResponse.json({ error: result.error }, { status: 500 });
      }
   } catch (error) {
      console.error('Error running cron job:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}

// Optional: GET endpoint to check cron status
export async function GET() {
   return NextResponse.json({
      message: 'Cron endpoint is available',
      endpoint: '/api/cron/publish',
      method: 'POST',
   });
}
