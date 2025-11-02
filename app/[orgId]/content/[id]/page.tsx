import { Suspense } from 'react';
import { ContentDetail } from '@/components/content/content-detail';
import { notFound } from 'next/navigation';
import { getContent } from '@/lib/content';

interface ContentPageProps {
   params: {
      orgId: string;
      id: string;
   };
}

export default async function ContentPage({ params }: ContentPageProps) {
   const content = await getContent(params.orgId, params.id);

   if (!content) {
      notFound();
   }

   return (
      <div className="flex flex-col space-y-6">
         <Suspense fallback={<div>Loading content...</div>}>
            <ContentDetail content={content} />
         </Suspense>
      </div>
   );
}
