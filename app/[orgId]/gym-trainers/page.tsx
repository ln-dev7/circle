import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/gym-trainers/header';
import GymTrainers from '@/components/common/gym-trainers/gym-trainers';

export default function GymTrainersPage() {
  return (
    <MainLayout header={<Header />}>
      <GymTrainers />
    </MainLayout>
  );
}
