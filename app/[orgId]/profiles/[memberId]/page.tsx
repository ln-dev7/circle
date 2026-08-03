import MemberProfile from '@/components/common/members/member-profile';
import Header from '@/components/layout/headers/profile/header';
import MainLayout from '@/components/layout/main-layout';
import { users } from '@/mock-data/users';
import { notFound } from 'next/navigation';

interface MemberProfilePageProps {
   params: Promise<{ memberId: string }>;
}

export default async function MemberProfilePage({ params }: MemberProfilePageProps) {
   const { memberId } = await params;
   const member = users.find((user) => user.id === memberId);

   if (!member) {
      notFound();
   }

   return (
      <MainLayout header={<Header member={member} />}>
         <MemberProfile member={member} />
      </MainLayout>
   );
}
