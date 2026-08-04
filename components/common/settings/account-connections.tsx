'use client';

import { Button } from '@/components/ui/button';
import { RiGithubLine, RiNotionFill, RiSlackFill } from '@remixicon/react';
import { ArrowUpRight, Calendar, ChevronDown } from 'lucide-react';
import { EnabledDot, SettingsCard, SettingsRow, SettingsSection, SettingsShell } from './shared';

const ConnectedTrailing = () => (
   <span className="inline-flex items-center gap-1.5 text-sm">
      <EnabledDot>
         <span className="text-foreground">Connected</span>
      </EnabledDot>
      <ChevronDown className="size-3.5 text-muted-foreground" />
   </span>
);

/** Personal "Connected accounts" settings. */
export default function AccountConnections() {
   return (
      <SettingsShell
         title="Connected accounts"
         description="Connect your user accounts to sync attribution of your actions between apps"
      >
         <SettingsSection>
            <SettingsCard>
               <SettingsRow
                  icon={<RiSlackFill className="size-4" />}
                  title="Slack"
                  description="Sync your message attribution, and receive notifications in Slack"
                  trailing={<ConnectedTrailing />}
               />
            </SettingsCard>
            <SettingsCard>
               <SettingsRow
                  icon={<Calendar className="size-4" />}
                  title="Google Calendar"
                  description="Sync your calendar out-of-office status to LNDev UI"
                  trailing={<ConnectedTrailing />}
               />
            </SettingsCard>
            <SettingsCard>
               <SettingsRow
                  icon={<RiNotionFill className="size-4" />}
                  title="Notion"
                  description="Preview issues, projects, and views within Notion"
                  trailing={
                     <Button size="xs" variant="ghost">
                        Connect
                        <ArrowUpRight className="size-3.5" />
                     </Button>
                  }
               />
            </SettingsCard>
            <SettingsCard>
               <SettingsRow
                  icon={<RiGithubLine className="size-4" />}
                  title={
                     <>
                        GitHub
                        <span className="text-xs text-muted-foreground font-normal">
                           · @ln-dev7
                        </span>
                     </>
                  }
               />
               <SettingsRow
                  title="octo-relay"
                  description="Review code in LNDev UI and sync attribution of your git-related actions"
                  trailing={<ConnectedTrailing />}
               />
            </SettingsCard>
         </SettingsSection>
      </SettingsShell>
   );
}
