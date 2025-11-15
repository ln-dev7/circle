import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/gym-attendance/header';
import GymAttendance from '@/components/common/gym-attendance/gym-attendance';

export default function GymAttendancePage() {
  return (
    <MainLayout header={<Header />}>
      <GymAttendance />
    </MainLayout>
  );
}
