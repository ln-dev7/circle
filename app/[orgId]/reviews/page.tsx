import Reviews from '@/components/common/reviews/reviews';
import MainLayout from '@/components/layout/main-layout';

export default function ReviewsPage() {
   return (
      <MainLayout>
         <Reviews listTab="for-you" />
      </MainLayout>
   );
}
