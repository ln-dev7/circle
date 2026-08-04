'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ChevronRight } from 'lucide-react';
import { SelectMenu, SettingsCard, SettingsRow, SettingsSection, SettingsShell } from './shared';

/** Fake diff shown in the "Code theme" preview (invented snippet). */
const DIFF_LINES: { number?: string; text: string; kind: 'context' | 'removed' | 'added' }[] = [
   { number: '1', text: 'const config = {', kind: 'context' },
   { number: '2', text: '  apiUrl: "https://api.example.com",', kind: 'context' },
   { number: '3', text: '  timeout: 5000,', kind: 'context' },
   { number: '-', text: '  debug: true,', kind: 'removed' },
   { number: '4', text: '  headers: { "Content-Type": "application/json" },', kind: 'added' },
   { number: '5', text: '};', kind: 'context' },
   { number: '-', text: 'async function fetchUser(id: string): Promise<User> {', kind: 'removed' },
   { number: '-', text: '  const url = `${config.apiUrl}/users/${id}`;', kind: 'removed' },
   {
      number: '6',
      text: 'async function fetchUser(id: string): Promise<User | null> {',
      kind: 'added',
   },
   { number: '7', text: '  const url = `${config.apiUrl}/v2/users/${id}`;', kind: 'added' },
   { number: '8', text: '  const res = await fetch(url);', kind: 'context' },
   { number: '-', text: '  return res.json();', kind: 'removed' },
];

/** Personal "Code & reviews" settings (PR reviews inside the app). */
export default function AccountCodeReviews() {
   return (
      <SettingsShell
         title="Code & reviews"
         description="Review GitHub pull requests and agent code diffs in LNDev UI"
      >
         <SettingsSection>
            <SettingsCard>
               <SettingsRow
                  title="Enable code reviews"
                  description="Review GitHub pull requests, accessible from the sidebar"
                  trailing={<Switch defaultChecked />}
               />
               <SettingsRow
                  title="Auto-convert draft pull requests"
                  description="Automatically mark your drafts as ready upon approval or requesting a review"
                  trailing={<Switch />}
               />
               <SettingsRow
                  title="Merge strategy"
                  description="Choose the default merge strategy for pull requests. Repository configuration can affect available strategies"
                  trailing={
                     <SelectMenu
                        options={['Squash and merge', 'Merge commit', 'Rebase and merge']}
                     />
                  }
               />
            </SettingsCard>
         </SettingsSection>

         <SettingsSection>
            <SettingsCard>
               <SettingsRow
                  title="Code theme"
                  description="Select the syntax highlighting theme used in code diffs and viewers"
                  trailing={<SelectMenu options={['LNDev Light', 'LNDev Dark', 'Contrast']} />}
               />
               <SettingsRow
                  title="Font"
                  trailing={<SelectMenu options={['12px, Regular, Default', '13px, Medium']} />}
               />
               <div className="p-3">
                  <div className="relative rounded-md border overflow-hidden bg-container">
                     <div className="absolute top-2 right-2 z-10">
                        <SelectMenu options={['TypeScript', 'JavaScript', 'Python']} />
                     </div>
                     <pre className="text-xs leading-5 font-mono overflow-x-auto py-2">
                        {DIFF_LINES.map((line, index) => (
                           <div
                              key={index}
                              className={
                                 line.kind === 'removed'
                                    ? 'bg-red-500/10 border-l-2 border-red-500 px-3 flex gap-3'
                                    : line.kind === 'added'
                                      ? 'bg-green-500/10 border-l-2 border-green-500 px-3 flex gap-3'
                                      : 'px-3 flex gap-3 border-l-2 border-transparent'
                              }
                           >
                              <span className="w-4 text-right text-muted-foreground/60 select-none shrink-0">
                                 {line.number}
                              </span>
                              <code>{line.text}</code>
                           </div>
                        ))}
                     </pre>
                  </div>
               </div>
            </SettingsCard>
         </SettingsSection>

         <SettingsSection
            title="Notifications"
            description="Choose which review activity appears in your inbox and push notifications"
         >
            <SettingsCard>
               <SettingsRow
                  title="Comments & reviews"
                  description="Comments, mentions, and submitted reviews"
                  trailing={<SelectMenu options={['Exclude Bots', 'Everyone', 'None']} />}
               />
               <SettingsRow
                  title="Review requests"
                  description="Requests for your personal review"
                  trailing={<Switch defaultChecked />}
               />
               <SettingsRow
                  title="GitHub team review requests"
                  description="Requests for review from your GitHub teams with 10 or fewer members"
                  trailing={<Switch defaultChecked />}
               />
               <SettingsRow
                  title="Checks & merge queue"
                  description="Check failures and merge queue updates"
                  trailing={<Switch defaultChecked />}
               />
            </SettingsCard>
         </SettingsSection>

         <SettingsSection title="Signed commits">
            <SettingsCard>
               <SettingsRow
                  title="Require signed commits"
                  description="Users must upload a signing key before starting a coding session"
                  trailing={<Switch />}
               />
               <SettingsRow
                  title="No signing key added"
                  trailing={
                     <Button size="xs" variant="ghost">
                        Add key
                     </Button>
                  }
               />
            </SettingsCard>
         </SettingsSection>

         <SettingsSection title="External tools">
            <SettingsCard>
               <SettingsRow
                  title="Configure coding tools"
                  description="Configure the external coding tools you can open issues in"
                  trailing={<ChevronRight className="size-4" />}
                  onClick={() => {}}
               />
               <SettingsRow
                  title="Git attachment format"
                  description="The format of GitHub/GitLab attachments on issues"
                  trailing={<SelectMenu options={['Title', 'URL', 'Compact']} />}
               />
               <SettingsRow
                  title="On git branch copy, move issue to started status"
                  description="After copying the git branch name, issue status is moved to the team's first started workflow status. Hold ⌥ to disable."
                  trailing={<Switch defaultChecked />}
               />
               <SettingsRow
                  title="On open in coding tool, move issue to started status"
                  description="After opening an issue in a coding tool or copying as prompt, issue status is moved to the team's first started workflow status. Hold ⌥ to disable."
                  trailing={<Switch defaultChecked />}
               />
            </SettingsCard>
         </SettingsSection>
      </SettingsShell>
   );
}
