import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/gym-classes/header';
import GymClasses from '@/components/common/gym-classes/gym-classes';

export default function GymClassesPage() {
  return (
    <MainLayout header={<Header />}>
      <GymClasses />
    </MainLayout>
  );
}
