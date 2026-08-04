import Reviews from '@/components/common/reviews/reviews';
import MainLayout from '@/components/layout/main-layout';

export default async function ReviewDiffPage({
   params,
}: {
   params: Promise<{ reviewId: string }>;
}) {
   const { reviewId } = await params;
   return (
      <MainLayout>
         <Reviews selectedReviewId={reviewId} section="diff" />
      </MainLayout>
   );
}
