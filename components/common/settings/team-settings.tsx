'use client';

import { Button } from '@/components/ui/button';
import { getCyclesByTeam } from '@/mock-data/cycles';
import { status } from '@/mock-data/status';
import { teams } from '@/mock-data/teams';
import {
   Bot,
   ChevronRight,
   FileText,
   Lock,
   Radar,
   RefreshCcw,
   Repeat,
   Settings,
   Sparkles,
   Tag,
   Target,
   Users,
   Workflow,
   Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SettingsCard, SettingsRow, SettingsSection } from './shared';

interface TeamSettingsProps {
   teamId: string;
}

/** Per-team settings page (general, workflow, AI and danger zone). */
export default function TeamSettings({ teamId }: TeamSettingsProps) {
   const { orgId } = useParams<{ orgId: string }>();
   const team = teams.find((candidate) => candidate.id === teamId);

   if (!team) {
      return (
         <div className="max-w-2xl mx-auto px-6 py-10">
            <h1 className="text-2xl font-medium">Team not found</h1>
         </div>
      );
   }

   const cycles = getCyclesByTeam(team.id);

   return (
      <div className="w-full overflow-y-auto h-full">
         <div className="max-w-2xl mx-auto px-6 py-10 pb-20">
            <div className="flex items-center gap-3">
               <span className="inline-flex size-9 bg-muted/50 items-center justify-center rounded-md text-lg">
                  {team.icon}
               </span>
               <div className="flex-1">
                  <h1 className="text-2xl font-medium">{team.name}</h1>
                  <p className="text-sm text-muted-foreground">
                     Accessible to all workspace members
                  </p>
               </div>
               <Link
                  href={`/${orgId}/team/${team.id}/overview`}
                  className="text-sm inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
               >
                  Team overview
                  <ChevronRight className="size-4" />
               </Link>
            </div>

            <div className="flex flex-col gap-10 mt-10">
               <SettingsSection>
                  <SettingsCard>
                     <SettingsRow
                        icon={<Settings className="size-4" />}
                        title="General"
                        description="Name, identifier, timezone, estimates, and broader settings"
                        chevron
                        onClick={() => {}}
                     />
                     <SettingsRow
                        icon={<Lock className="size-4" />}
                        title="Access and permissions"
                        description="Manage team access and who in the team can take certain actions"
                        chevron
                        onClick={() => {}}
                     />
                     <SettingsRow
                        icon={<Users className="size-4" />}
                        title="Members"
                        description="Manage team members"
                        trailing={<span>{team.members.length} members</span>}
                        chevron
                        onClick={() => {}}
                     />
                     <SettingsRow
                        icon={<Zap className="size-4" />}
                        title="Slack notifications"
                        description="Broadcast notifications to Slack"
                        trailing={<span>Off</span>}
                        chevron
                        onClick={() => {}}
                     />
                  </SettingsCard>
               </SettingsSection>

               <SettingsSection title="Issues, projects, and docs">
                  <SettingsCard>
                     <SettingsRow
                        icon={<Tag className="size-4" />}
                        title="Issue labels"
                        description="Labels available to this team's issues"
                        trailing={<span>7 labels</span>}
                        chevron
                        onClick={() => {}}
                     />
                     <SettingsRow
                        icon={<FileText className="size-4" />}
                        title="Templates"
                        description="Pre-filled templates for issues, documents, and projects"
                        trailing={<span>3 templates</span>}
                        chevron
                        onClick={() => {}}
                     />
                     <SettingsRow
                        icon={<Repeat className="size-4" />}
                        title="Recurring issues"
                        description="Automatically create issues on a schedule"
                        trailing={<span>None</span>}
                        chevron
                        onClick={() => {}}
                     />
                  </SettingsCard>
               </SettingsSection>

               <SettingsSection title="Workflow">
                  <SettingsCard>
                     <SettingsRow
                        icon={<Target className="size-4" />}
                        title="Issue statuses"
                        description="Customize the statuses issues go through"
                        trailing={<span>{status.length} statuses</span>}
                        chevron
                        onClick={() => {}}
                     />
                     <SettingsRow
                        icon={<Workflow className="size-4" />}
                        title="Workflows & automations"
                        description="Manage issue automations, git workflows and other workflows"
                        chevron
                        onClick={() => {}}
                     />
                     <SettingsRow
                        icon={<Radar className="size-4" />}
                        title="Triage"
                        description="Streamline how you handle requests from outside your team"
                        trailing={<span>Enabled</span>}
                        chevron
                        onClick={() => {}}
                     />
                     <SettingsRow
                        icon={<RefreshCcw className="size-4" />}
                        title="Cycles"
                        description="Focus your team over short, time-boxed windows"
                        trailing={<span>{cycles.length > 0 ? 'Every 2 weeks' : 'Off'}</span>}
                        chevron
                        onClick={() => {}}
                     />
                  </SettingsCard>
               </SettingsSection>

               <SettingsSection title="AI & Agents">
                  <SettingsCard>
                     <SettingsRow
                        icon={<Bot className="size-4" />}
                        title="Team agents"
                        description="Add guidance for how agents should operate within this team"
                        chevron
                        onClick={() => {}}
                     />
                     <SettingsRow
                        icon={<Sparkles className="size-4" />}
                        title="Agent skills"
                        description="Agent skills shared with this team"
                        trailing={<span>None</span>}
                        chevron
                        onClick={() => {}}
                     />
                     <SettingsRow
                        icon={<RefreshCcw className="size-4" />}
                        title="Loops"
                        description="Automated agent workflows that run on a schedule or when an issue is updated"
                        trailing={<span>None</span>}
                        chevron
                        onClick={() => {}}
                     />
                     <SettingsRow
                        icon={<Zap className="size-4" />}
                        title="Project updates"
                        description="Automatically generate updates using recent activity and defined rules"
                        chevron
                        onClick={() => {}}
                     />
                     <SettingsRow
                        icon={<FileText className="size-4" />}
                        title="Resolved thread summaries"
                        description="Automatically generate summaries for resolved threads"
                        chevron
                        onClick={() => {}}
                     />
                  </SettingsCard>
               </SettingsSection>

               <SettingsSection
                  title="Team hierarchy"
                  description="Teams can be nested to reflect your team structure and to share workflows and settings."
               >
                  <div />
               </SettingsSection>

               <SettingsSection title="Danger zone">
                  <SettingsCard>
                     <SettingsRow
                        title="Leave team"
                        description="Remove yourself as a member of this team"
                        trailing={
                           <Button size="xs" variant="ghost">
                              Leave team...
                           </Button>
                        }
                     />
                     <SettingsRow
                        title="Retire team"
                        description="Prevent creating and updating issues in this team while preserving all historical data"
                        muted
                        trailing={
                           <Button size="xs" variant="ghost">
                              Retire...
                           </Button>
                        }
                     />
                     <SettingsRow
                        title="Delete team"
                        description="Permanently delete this team and all its data, with a 30-day restoration window"
                        muted
                        trailing={
                           <Button size="xs" variant="ghost">
                              Delete...
                           </Button>
                        }
                     />
                  </SettingsCard>
               </SettingsSection>
            </div>
         </div>
      </div>
   );
}
