import prisma from './prisma';

export async function publishScheduledContent() {
   try {
      const now = new Date();

      // Find all schedules that are due for publication
      const dueSchedules = await prisma.schedule.findMany({
         where: {
            runAt: {
               lte: now,
            },
            status: {
               not: 'PUBLISHED',
            },
         },
         include: {
            content: true,
            campaign: true,
         },
      });

      console.log(`Found ${dueSchedules.length} schedules due for publication`);

      for (const schedule of dueSchedules) {
         try {
            // Update schedule status to published
            await prisma.schedule.update({
               where: { id: schedule.id },
               data: { status: 'PUBLISHED' },
            });

            // Here you would integrate with your content publishing platform
            // For example, posting to social media, sending emails, etc.
            console.log(
               `Published content: ${schedule.content?.title} for campaign: ${schedule.campaign.name}`
            );

            // You could also update content status or add publishing metadata
            if (schedule.content) {
               // Add any publishing logic here
               // For example, update content with publication timestamp
               await prisma.content.update({
                  where: { id: schedule.content.id },
                  data: {
                     // Add publication metadata if needed
                  },
               });
            }
         } catch (error) {
            console.error(`Error publishing schedule ${schedule.id}:`, error);
            // You might want to mark the schedule as failed
            await prisma.schedule.update({
               where: { id: schedule.id },
               data: { status: 'FAILED' },
            });
         }
      }

      return { success: true, published: dueSchedules.length };
   } catch (error) {
      console.error('Error in publishScheduledContent:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
   }
}

// Function to run the cron job
export async function runCronJob() {
   console.log('Running scheduled content publication cron job...');
   const result = await publishScheduledContent();
   console.log('Cron job completed:', result);
   return result;
}

// Export for use in API routes or scheduled tasks
export default { publishScheduledContent, runCronJob };
