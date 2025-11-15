import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/gym-bookings/header';
import GymBookings from '@/components/common/gym-bookings/gym-bookings';

export default function GymBookingsPage() {
  return (
    <MainLayout header={<Header />}>
      <GymBookings />
    </MainLayout>
  );
}
