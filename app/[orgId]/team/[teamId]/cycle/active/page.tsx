import CycleIssues from '@/components/common/issues/cycle-issues';
import Header from '@/components/layout/headers/cycle/header';
import MainLayout from '@/components/layout/main-layout';

export default function ActiveCyclePage() {
   return (
      <MainLayout header={<Header cycleView="active" />}>
         <CycleIssues cycleView="active" />
      </MainLayout>
   );
}
