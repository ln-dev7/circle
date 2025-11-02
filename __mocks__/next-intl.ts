export const useTranslations = () => (key: string) => {
   const translations: Record<string, string> = {
      admin_title: 'Admin Dashboard',
      admin_description: 'Manage your organization and users',
      total_users: 'Total Users',
      active_users: 'active',
      active_campaigns: 'Active Campaigns',
      total_campaigns: 'of',
      total: 'total',
      content_pieces: 'Content Pieces',
      pending_approvals: 'Pending Approvals',
      user_management: 'User Management',
      organization: 'Organization',
      system: 'System',
      system_settings: 'System Settings',
   };

   return translations[key] || key;
};

export const useFormatter = () => ({
   dateTime: (date: Date) => date.toISOString(),
   number: (num: number) => num.toString(),
});

export const NextIntlClientProvider = ({ children }: { children: React.ReactNode }) => children;
