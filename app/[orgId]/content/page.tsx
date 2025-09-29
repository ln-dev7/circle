import { Suspense } from 'react';
import { ContentList } from '@/components/content/content-list';
import { CreateContentButton } from '@/components/content/create-content-button';
import { PageHeader } from '@/components/ui/page-header';

interface ContentPageProps {
   params: {
      orgId: string;
   };
}

export default function ContentPage({ params }: ContentPageProps) {
   const { orgId } = params;

   return (
      <div className="flex flex-col space-y-6">
         <PageHeader
            title="Content"
            description="Manage your content and creative assets"
            action={<CreateContentButton orgId={orgId} />}
         />

         <Suspense fallback={<div>Loading content...</div>}>
            <ContentList orgId={orgId} />
         </Suspense>
      </div>
   );
}
