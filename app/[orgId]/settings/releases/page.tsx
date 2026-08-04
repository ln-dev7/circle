import SettingsPlaceholder from '@/components/common/settings/settings-placeholder';
import { PLACEHOLDER_SECTIONS } from '@/components/common/settings/placeholder-sections';
import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/settings/header';

export default function ReleasesSettingsPage() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <SettingsPlaceholder config={PLACEHOLDER_SECTIONS['releases']} />
      </MainLayout>
   );
}
