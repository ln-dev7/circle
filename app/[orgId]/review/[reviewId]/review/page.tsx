import Reviews from '@/components/common/reviews/reviews';
import MainLayout from '@/components/layout/main-layout';

export default async function ReviewGuidePage({
   params,
}: {
   params: Promise<{ reviewId: string }>;
}) {
   const { reviewId } = await params;
   return (
      <MainLayout>
         <Reviews selectedReviewId={reviewId} section="guide" />
      </MainLayout>
   );
}
