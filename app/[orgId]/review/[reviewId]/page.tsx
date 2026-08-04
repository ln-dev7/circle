import Reviews from '@/components/common/reviews/reviews';
import MainLayout from '@/components/layout/main-layout';

export default async function ReviewOverviewPage({
   params,
}: {
   params: Promise<{ reviewId: string }>;
}) {
   const { reviewId } = await params;
   return (
      <MainLayout>
         <Reviews selectedReviewId={reviewId} section="overview" />
      </MainLayout>
   );
}
