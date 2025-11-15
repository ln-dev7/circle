import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/gym-equipment/header';
import GymEquipment from '@/components/common/gym-equipment/gym-equipment';

export default function GymEquipmentPage() {
  return (
    <MainLayout header={<Header />}>
      <GymEquipment />
    </MainLayout>
  );
}
