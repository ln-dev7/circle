import { redirect } from 'next/navigation';

export default async function OrgIdPage({ params }: { params: Promise<{ orgId: string }> }) {
   const { orgId } = await params;
   redirect(`${orgId}/inbox`);
}
