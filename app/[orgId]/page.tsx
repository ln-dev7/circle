import { Suspense } from 'react';
import { getUserRole } from '@/lib/rbac';
import { CreatorDashboard } from '@/components/dashboards/creator-dashboard';
import { BrandDashboard } from '@/components/dashboards/brand-dashboard';
import { AdminDashboard } from '@/components/dashboards/admin-dashboard';
import { redirect } from 'next/navigation';
import { OrgRole } from '@prisma/client';

interface OrgIdPageProps {
   params: Promise<{
      orgId: string;
   }>;
}

async function DashboardContent({ orgId }: { orgId: string }) {
   const userRole = await getUserRole(orgId);

   if (!userRole) {
      // User doesn't have access to this organization
      redirect('/auth/signin');
   }

   switch (userRole) {
      case OrgRole.CREATOR:
         return <CreatorDashboard orgId={orgId} />;
      case OrgRole.BRAND_OWNER:
         return <BrandDashboard orgId={orgId} />;
      case OrgRole.ADMIN:
         return <AdminDashboard orgId={orgId} />;
      default:
         redirect('/auth/signin');
   }
}

export default async function OrgIdPage({ params }: OrgIdPageProps) {
   const resolvedParams = await params;

   return (
      <Suspense
         fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
               <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <div className="text-lg font-medium">Loading dashboard...</div>
                  <div className="text-sm text-muted-foreground">
                     Please wait while we set up your workspace
                  </div>
               </div>
            </div>
         }
      >
         <DashboardContent orgId={resolvedParams.orgId} />
      </Suspense>
   );
}
