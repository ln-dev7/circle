'use client';

import { Switch } from '@/components/ui/switch';
import { Mail, Monitor, Slack, Smartphone } from 'lucide-react';
import { EnabledDot, SettingsCard, SettingsRow, SettingsSection, SettingsShell } from './shared';

const CHANNELS = [
   {
      icon: <Monitor className="size-4" />,
      title: 'Desktop',
      status: 'Enabled for assignments, status changes, 13 others',
   },
   {
      icon: <Smartphone className="size-4" />,
      title: 'Mobile',
      status: 'Enabled for assignments, status changes, 13 others',
   },
   { icon: <Mail className="size-4" />, title: 'Email', status: 'Enabled for all notifications' },
   { icon: <Slack className="size-4" />, title: 'Slack', status: 'Enabled for all notifications' },
];

/** Personal notification settings (push channels + product updates). */
export default function AccountNotifications() {
   return (
      <SettingsShell title="Notifications">
         <SettingsSection
            title="Push notifications"
            description="Choose which notifications are pushed to your devices. All notifications will still appear in your inbox."
         >
            <SettingsCard>
               {CHANNELS.map((channel) => (
                  <SettingsRow
                     key={channel.title}
                     icon={channel.icon}
                     title={channel.title}
                     description={<EnabledDot>{channel.status}</EnabledDot>}
                     chevron
                     onClick={() => {}}
                  />
               ))}
            </SettingsCard>
         </SettingsSection>

         <SettingsSection
            title="Updates from LNDev UI"
            description="Subscribe to product announcements and important changes from the LNDev UI team"
         >
            <h3 className="text-sm font-medium mt-2">Changelog</h3>
            <SettingsCard>
               <SettingsRow
                  title="Show updates in sidebar"
                  description="Highlight new features and improvements in the app sidebar"
                  trailing={<Switch defaultChecked />}
               />
               <SettingsRow
                  title="Changelog newsletter"
                  description="Receive an email twice a month highlighting new features and improvements"
                  trailing={<Switch />}
               />
            </SettingsCard>

            <h3 className="text-sm font-medium mt-2">Marketing</h3>
            <SettingsCard>
               <SettingsRow
                  title="Marketing and onboarding"
                  description="Occasional updates to help you get the most out of LNDev UI"
                  trailing={<Switch />}
               />
            </SettingsCard>

            <h3 className="text-sm font-medium mt-2">Other updates</h3>
            <SettingsCard>
               <SettingsRow
                  title="Invite accepted"
                  description="Receive an email when an invite you sent is accepted"
                  trailing={<Switch defaultChecked />}
               />
               <SettingsRow
                  title="Privacy and legal updates"
                  description="Important updates about terms of service or privacy policy changes"
                  trailing={<Switch defaultChecked />}
               />
            </SettingsCard>
         </SettingsSection>
      </SettingsShell>
   );
}
