'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SettingsCard, SettingsRow, SettingsSection, SettingsShell } from './shared';

/** Personal settings for the workspace agent. */
export default function AgentPersonalization() {
   return (
      <SettingsShell
         title="Agent personalization"
         description="Your personal settings for the LNDev Agent"
      >
         <SettingsSection
            title="Guidance"
            description="Provide personal instructions and context for the agent when responding to conversations"
         >
            <textarea
               placeholder="Enter personal guidance for the agent (optional)..."
               className="w-full min-h-36 rounded-lg border bg-container p-4 text-sm outline-none resize-y placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
            />
         </SettingsSection>

         <SettingsSection
            title="Skills"
            description="Reusable prompts auto-selected by the agent or invoked via slash commands"
         >
            <SettingsCard>
               <SettingsRow
                  title="No skills created"
                  trailing={
                     <Button size="icon" variant="ghost" className="size-7">
                        <Plus className="size-4" />
                     </Button>
                  }
               />
            </SettingsCard>
         </SettingsSection>

         <SettingsSection
            title="MCP connectors"
            description="Add MCP connectors for use with the agent. Workspace admins can manage available connectors in security settings."
         >
            <SettingsCard>
               <SettingsRow
                  title="Agent MCP access disabled in this workspace"
                  muted
                  trailing={
                     <Button size="xs" variant="ghost">
                        Configure
                     </Button>
                  }
               />
            </SettingsCard>
         </SettingsSection>
      </SettingsShell>
   );
}
