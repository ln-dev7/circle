import { AssetLibrary } from '@/components/assets/asset-library';

interface AssetsPageProps {
   params: {
      orgId: string;
   };
}

export default function AssetsPage({ params }: AssetsPageProps) {
   const { orgId } = params;

   return (
      <div className="container mx-auto py-6">
         <AssetLibrary orgId={orgId} />
      </div>
   );
}
