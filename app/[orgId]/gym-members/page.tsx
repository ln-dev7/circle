import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/gym-members/header';
import GymMembers from '@/components/common/gym-members/gym-members';

export default function GymMembersPage() {
  return (
    <MainLayout header={<Header />}>
      <GymMembers />
    </MainLayout>
  );
}
