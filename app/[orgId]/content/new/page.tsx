import { ContentEditor } from '@/components/content/content-editor';
import { PageHeader } from '@/components/ui/page-header';

interface CreateContentPageProps {
   params: {
      orgId: string;
   };
}

export default function CreateContentPage({ params }: CreateContentPageProps) {
   const { orgId } = params;

   return (
      <div className="flex flex-col space-y-6">
         <PageHeader title="Create Content" description="Create new content for your campaigns" />

         <div className="max-w-4xl">
            <ContentEditor orgId={orgId} />
         </div>
      </div>
   );
}
