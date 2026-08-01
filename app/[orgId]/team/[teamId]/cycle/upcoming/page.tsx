import CycleIssues from '@/components/common/issues/cycle-issues';
import Header from '@/components/layout/headers/cycle/header';
import MainLayout from '@/components/layout/main-layout';

export default function UpcomingCyclePage() {
   return (
      <MainLayout header={<Header cycleView="upcoming" />}>
         <CycleIssues cycleView="upcoming" />
      </MainLayout>
   );
}
