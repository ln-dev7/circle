'use client';

import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { SettingsCard, SettingsRow, SettingsSection, SettingsShell } from './shared';

/** Invented workspace issue templates. */
const TEMPLATES = [
   { name: 'Bug report intake', meta: 'Created by sophia.reed 1 year ago' },
   { name: 'Component feature request', meta: 'Created by mason.carter 1 year ago' },
   { name: 'Release checklist', meta: 'Updated by alex.zhang 2 years ago' },
];

/** Workspace "Issue templates" settings. */
export default function IssueTemplatesSettings() {
   return (
      <SettingsShell
         title="Issue templates"
         description="These templates are available when creating issues for any team in the workspace. To create templates that only apply to specific teams, add them as team templates."
      >
         <SettingsSection>
            <SettingsCard>
               <SettingsRow
                  title={`${TEMPLATES.length} issue templates`}
                  trailing={
                     <Button size="icon" variant="ghost" className="size-7">
                        <Plus className="size-4" />
                     </Button>
                  }
               />
               {TEMPLATES.map((template) => (
                  <SettingsRow
                     key={template.name}
                     icon={<FileText className="size-4" />}
                     title={template.name}
                     description={template.meta}
                     onClick={() => {}}
                  />
               ))}
            </SettingsCard>
         </SettingsSection>
      </SettingsShell>
   );
}
