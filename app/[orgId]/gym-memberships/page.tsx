import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/gym-memberships/header';
import GymMemberships from '@/components/common/gym-memberships/gym-memberships';

export default function GymMembershipsPage() {
  return (
    <MainLayout header={<Header />}>
      <GymMemberships />
    </MainLayout>
  );
}
