'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command';
import { cycles, formatCycleDateRange } from '@/mock-data/cycles';
import { Issue } from '@/mock-data/issues';
import { labels as allLabels } from '@/mock-data/labels';
import { priorities } from '@/mock-data/priorities';
import { projects as allProjects } from '@/mock-data/projects';
import { status as allStatus } from '@/mock-data/status';
import { teams } from '@/mock-data/teams';
import { users } from '@/mock-data/users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCreateIssueStore } from '@/store/create-issue-store';
import { useIssuesStore } from '@/store/issues-store';
import {
   Box,
   CalendarPlus,
   Check,
   CircleDot,
   Clipboard,
   ClipboardList,
   ClipboardType,
   Compass,
   ContactRound,
   FileText,
   GitBranch,
   Inbox,
   Layers,
   Link2,
   PackagePlus,
   SquarePen,
   Tags,
   Type,
   UserRound,
   UserRoundMinus,
   UserRoundPlus,
   Users,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type PaletteRoute =
   | 'root'
   | 'assign'
   | 'status'
   | 'priority'
   | 'labels'
   | 'project'
   | 'cycle'
   | 'team'
   | 'due-date';

/** Small keyboard hint chips on the right of a command row. */
function Keys({ keys }: { keys: string[] }) {
   return (
      <span className="ml-auto flex items-center gap-1">
         {keys.map((key, index) => (
            <kbd
               key={index}
               className="min-w-5 h-5 px-1 inline-flex items-center justify-center rounded border bg-muted/50 text-[11px] text-muted-foreground font-sans"
            >
               {key}
            </kbd>
         ))}
      </span>
   );
}

/** ⌘K command palette — Linear-style, aware of the issue in context. */
export function CommandPalette() {
   const [open, setOpen] = useState(false);
   const [route, setRoute] = useState<PaletteRoute>('root');
   const [query, setQuery] = useState('');
   /** When true, the issue context chip was dismissed with ⌫. */
   const [contextCleared, setContextCleared] = useState(false);

   const pathname = usePathname();
   const router = useRouter();
   const { issues, updateIssueStatus, updateIssuePriority, updateIssueAssignee, addIssueLabel, removeIssueLabel, updateIssueProject, updateIssue } = useIssuesStore();
   const { openModal } = useCreateIssueStore();

   const orgId = pathname.split('/')[1] || 'lndev-ui';

   const contextIssue = useMemo<Issue | undefined>(() => {
      const match = pathname.match(/^\/[^/]+\/issue\/([^/]+)/);
      if (!match) return undefined;
      return issues.find((issue) => issue.identifier === match[1]);
   }, [pathname, issues]);

   const issue = contextCleared ? undefined : contextIssue;

   const reset = useCallback(() => {
      setRoute('root');
      setQuery('');
      setContextCleared(false);
   }, []);

   const close = useCallback(() => {
      setOpen(false);
      reset();
   }, [reset]);

   // ⌘K / Ctrl+K
   useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
         if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            setOpen((value) => {
               if (value) reset();
               return !value;
            });
         }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
   }, [reset]);

   const copy = useCallback(
      async (label: string, text: string) => {
         try {
            await navigator.clipboard.writeText(text);
            toast.success(`${label} copied to clipboard`);
         } catch {
            toast.error('Could not access the clipboard');
         }
         close();
      },
      [close]
   );

   const issueUrl = issue
      ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${orgId}/issue/${issue.identifier}`
      : '';
   const branchName = issue
      ? `${users[0].id}/${issue.identifier.toLowerCase()}-${issue.title
           .toLowerCase()
           .replace(/[^a-z0-9]+/g, '-')
           .replace(/^-|-$/g, '')
           .slice(0, 40)}`
      : '';

   const go = (path: string) => {
      router.push(`/${orgId}${path}`);
      close();
   };

   const input = (
      <div className="relative">
         <CommandInput
            autoFocus
            placeholder="Type a command or search…"
            value={query}
            onValueChange={setQuery}
            onKeyDown={(event) => {
               if (event.key === 'Escape' && route !== 'root') {
                  event.preventDefault();
                  event.stopPropagation();
                  setRoute('root');
                  setQuery('');
               }
               if (event.key === 'Backspace' && query === '' && route !== 'root') {
                  setRoute('root');
               }
               if (event.key === 'Tab' && route === 'root') {
                  event.preventDefault();
                  go('/agent');
               }
            }}
         />
         {route === 'root' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-muted-foreground pointer-events-none">
               Ask Agent
               <kbd className="h-5 px-1.5 inline-flex items-center rounded border bg-muted/50 text-[11px] font-sans">
                  Tab
               </kbd>
            </span>
         )}
      </div>
   );

   return (
      <Dialog
         open={open}
         onOpenChange={(value) => {
            setOpen(value);
            if (!value) reset();
         }}
      >
         <DialogContent
            showCloseButton={false}
            className="overflow-hidden p-0 sm:max-w-2xl top-[22%] translate-y-0 gap-0"
         >
            <DialogTitle className="sr-only">Command menu</DialogTitle>
            <DialogDescription className="sr-only">
               Type a command or search
            </DialogDescription>
            <Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-2.5">
         {issue && (
            <div className="flex items-center gap-1.5 px-3 pt-3 pb-1">
               <span className="inline-flex items-center gap-1.5 max-w-full rounded-md bg-muted/70 border border-border/60 px-2 py-1 text-xs">
                  <span className="text-muted-foreground shrink-0">{issue.identifier} ⋅</span>
                  <span className="truncate">{issue.title}</span>
                  <button
                     tabIndex={-1}
                     onClick={() => setContextCleared(true)}
                     className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                     aria-label="Clear issue context"
                  >
                     ⌫
                  </button>
               </span>
            </div>
         )}
         {input}
         <CommandList className="max-h-96">
            <CommandEmpty>No results found.</CommandEmpty>

            {route === 'root' && issue && (
               <>
                  <CommandGroup heading="Issue">
                     <CommandItem onSelect={() => { setRoute('assign'); setQuery(''); }}>
                        <UserRoundPlus className="text-muted-foreground" />
                        Assign to…
                        <Keys keys={['A']} />
                     </CommandItem>
                     <CommandItem
                        onSelect={() => {
                           updateIssueAssignee(issue.id, null);
                           toast.success('Un-assigned');
                           close();
                        }}
                     >
                        <UserRoundMinus className="text-muted-foreground" />
                        Un-assign from me
                        <Keys keys={['I']} />
                     </CommandItem>
                     <CommandItem onSelect={() => { setRoute('status'); setQuery(''); }}>
                        <CircleDot className="text-muted-foreground" />
                        Change status…
                        <Keys keys={['S']} />
                     </CommandItem>
                     <CommandItem onSelect={() => { setRoute('priority'); setQuery(''); }}>
                        <Layers className="text-muted-foreground" />
                        Set priority…
                        <Keys keys={['P']} />
                     </CommandItem>
                     <CommandItem onSelect={() => { setRoute('project'); setQuery(''); }}>
                        <Box className="text-muted-foreground" />
                        Move to project…
                        <Keys keys={['⇧', 'P']} />
                     </CommandItem>
                     <CommandItem onSelect={() => { setRoute('labels'); setQuery(''); }}>
                        <Tags className="text-muted-foreground" />
                        Change or add labels…
                        <Keys keys={['L']} />
                     </CommandItem>
                     <CommandItem onSelect={() => { setRoute('cycle'); setQuery(''); }}>
                        <CircleDot className="text-muted-foreground" />
                        Move to cycle…
                        <Keys keys={['⇧', 'C']} />
                     </CommandItem>
                     <CommandItem
                        onSelect={() => {
                           toast.success('Added to the next release');
                           close();
                        }}
                     >
                        <PackagePlus className="text-muted-foreground" />
                        Add to release…
                        <Keys keys={['⌥', 'R']} />
                     </CommandItem>
                     <CommandItem onSelect={() => { setRoute('team'); setQuery(''); }}>
                        <Users className="text-muted-foreground" />
                        Move to a different team…
                        <Keys keys={['⌘', '⇧', 'M']} />
                     </CommandItem>
                     <CommandItem onSelect={() => { setRoute('due-date'); setQuery(''); }}>
                        <CalendarPlus className="text-muted-foreground" />
                        Set due date…
                        <Keys keys={['⇧', 'D']} />
                     </CommandItem>
                  </CommandGroup>
                  <CommandGroup heading="Copy">
                     <CommandItem onSelect={() => copy('Issue ID', issue.identifier)}>
                        <Clipboard className="text-muted-foreground" />
                        Copy issue ID
                        <Keys keys={['⌘', '.']} />
                     </CommandItem>
                     <CommandItem onSelect={() => copy('Issue URL', issueUrl)}>
                        <Link2 className="text-muted-foreground" />
                        Copy issue URL
                        <Keys keys={['⌘', '⇧', ',']} />
                     </CommandItem>
                     <CommandItem onSelect={() => copy('Issue title', issue.title)}>
                        <Type className="text-muted-foreground" />
                        Copy issue title
                        <Keys keys={['⌘', '⇧', "'"]} />
                     </CommandItem>
                     <CommandItem
                        onSelect={() => copy('Title link', `[${issue.identifier}: ${issue.title}](${issueUrl})`)}
                     >
                        <Link2 className="text-muted-foreground" />
                        Copy title as link
                        <Keys keys={['⌘', 'C']} />
                     </CommandItem>
                     <CommandItem
                        onSelect={() => copy('Description', issue.description || issue.title)}
                     >
                        <FileText className="text-muted-foreground" />
                        Copy issue description as Markdown
                     </CommandItem>
                     <CommandItem
                        onSelect={() =>
                           copy(
                              'Issue content',
                              `# ${issue.identifier}: ${issue.title}\n\n${issue.description || ''}\n\n- Status: ${issue.status.name}\n- Priority: ${issue.priority.name}\n- Assignee: ${issue.assignee?.name ?? 'Unassigned'}`
                           )
                        }
                     >
                        <ClipboardType className="text-muted-foreground" />
                        Copy issue content as Markdown
                        <Keys keys={['⌘', '⌥', 'C']} />
                     </CommandItem>
                     <CommandItem onSelect={() => copy('Branch name', branchName)}>
                        <GitBranch className="text-muted-foreground" />
                        Copy git branch name
                        <Keys keys={['⌘', '⇧', '.']} />
                     </CommandItem>
                     <CommandItem
                        onSelect={() =>
                           copy(
                              'Prompt',
                              `Work on the following issue.\n\nIssue ${issue.identifier}: ${issue.title}\n${issue.description || ''}\nStatus: ${issue.status.name} — Priority: ${issue.priority.name}`
                           )
                        }
                     >
                        <ClipboardList className="text-muted-foreground" />
                        Copy as prompt
                        <Keys keys={['⌘', '⌥', 'P']} />
                     </CommandItem>
                  </CommandGroup>
               </>
            )}

            {route === 'root' && !issue && (
               <>
                  <CommandGroup heading="Actions">
                     <CommandItem
                        onSelect={() => {
                           openModal();
                           close();
                        }}
                     >
                        <SquarePen className="text-muted-foreground" />
                        Create new issue
                        <Keys keys={['C']} />
                     </CommandItem>
                  </CommandGroup>
                  <CommandGroup heading="Go to">
                     <CommandItem onSelect={() => go('/inbox')}>
                        <Inbox className="text-muted-foreground" /> Inbox
                        <Keys keys={['G', 'I']} />
                     </CommandItem>
                     <CommandItem onSelect={() => go('/my-issues')}>
                        <ClipboardList className="text-muted-foreground" /> My issues
                        <Keys keys={['G', 'M']} />
                     </CommandItem>
                     <CommandItem onSelect={() => go('/reviews')}>
                        <GitBranch className="text-muted-foreground" /> Reviews
                     </CommandItem>
                     <CommandItem onSelect={() => go('/initiatives')}>
                        <Compass className="text-muted-foreground" /> Initiatives
                     </CommandItem>
                     <CommandItem onSelect={() => go('/projects')}>
                        <Box className="text-muted-foreground" /> Projects
                        <Keys keys={['G', 'P']} />
                     </CommandItem>
                     <CommandItem onSelect={() => go('/views')}>
                        <Layers className="text-muted-foreground" /> Views
                     </CommandItem>
                     <CommandItem onSelect={() => go('/teams')}>
                        <ContactRound className="text-muted-foreground" /> Teams
                     </CommandItem>
                     <CommandItem onSelect={() => go('/members')}>
                        <UserRound className="text-muted-foreground" /> Members
                     </CommandItem>
                     <CommandItem onSelect={() => go('/settings')}>
                        <FileText className="text-muted-foreground" /> Settings
                        <Keys keys={['G', 'S']} />
                     </CommandItem>
                  </CommandGroup>
               </>
            )}

            {route === 'assign' && issue && (
               <CommandGroup heading="Assign to…">
                  {users.slice(0, 12).map((user) => (
                     <CommandItem
                        key={user.id}
                        onSelect={() => {
                           updateIssueAssignee(issue.id, user);
                           toast.success(`Assigned to ${user.name}`);
                           close();
                        }}
                     >
                        <Avatar className="size-5">
                           <AvatarImage src={user.avatarUrl} alt={user.name} />
                           <AvatarFallback className="text-[9px]">{user.name[0]}</AvatarFallback>
                        </Avatar>
                        {user.name}
                        {issue.assignee?.id === user.id && <Check className="ml-auto size-4" />}
                     </CommandItem>
                  ))}
               </CommandGroup>
            )}

            {route === 'status' && issue && (
               <CommandGroup heading="Change status…">
                  {allStatus.map((candidate) => (
                     <CommandItem
                        key={candidate.id}
                        onSelect={() => {
                           updateIssueStatus(issue.id, candidate);
                           toast.success(`Status set to ${candidate.name}`);
                           close();
                        }}
                     >
                        <candidate.icon />
                        {candidate.name}
                        {issue.status.id === candidate.id && <Check className="ml-auto size-4" />}
                     </CommandItem>
                  ))}
               </CommandGroup>
            )}

            {route === 'priority' && issue && (
               <CommandGroup heading="Set priority…">
                  {priorities.map((candidate) => (
                     <CommandItem
                        key={candidate.id}
                        onSelect={() => {
                           updateIssuePriority(issue.id, candidate);
                           toast.success(`Priority set to ${candidate.name}`);
                           close();
                        }}
                     >
                        <candidate.icon className="text-muted-foreground" />
                        {candidate.name}
                        {issue.priority.id === candidate.id && <Check className="ml-auto size-4" />}
                     </CommandItem>
                  ))}
               </CommandGroup>
            )}

            {route === 'labels' && issue && (
               <CommandGroup heading="Change or add labels…">
                  {allLabels.map((label) => {
                     const active = issue.labels.some((candidate) => candidate.id === label.id);
                     return (
                        <CommandItem
                           key={label.id}
                           onSelect={() => {
                              if (active) removeIssueLabel(issue.id, label.id);
                              else addIssueLabel(issue.id, label);
                              toast.success(active ? `Label ${label.name} removed` : `Label ${label.name} added`);
                           }}
                        >
                           <span
                              className="size-3 rounded-full"
                              style={{ backgroundColor: label.color }}
                           />
                           {label.name}
                           {active && <Check className="ml-auto size-4" />}
                        </CommandItem>
                     );
                  })}
               </CommandGroup>
            )}

            {route === 'project' && issue && (
               <CommandGroup heading="Move to project…">
                  <CommandItem
                     onSelect={() => {
                        updateIssueProject(issue.id, undefined);
                        toast.success('Removed from project');
                        close();
                     }}
                  >
                     <Box className="text-muted-foreground" />
                     No project
                  </CommandItem>
                  {allProjects.map((project) => (
                     <CommandItem
                        key={project.id}
                        onSelect={() => {
                           updateIssueProject(issue.id, project);
                           toast.success(`Moved to ${project.name}`);
                           close();
                        }}
                     >
                        <project.icon className="text-muted-foreground" />
                        {project.name}
                        {issue.project?.id === project.id && <Check className="ml-auto size-4" />}
                     </CommandItem>
                  ))}
               </CommandGroup>
            )}

            {route === 'cycle' && issue && (
               <CommandGroup heading="Move to cycle…">
                  <CommandItem
                     onSelect={() => {
                        updateIssue(issue.id, { cycleId: '' });
                        toast.success('Removed from cycle');
                        close();
                     }}
                  >
                     <CircleDot className="text-muted-foreground" />
                     No cycle
                  </CommandItem>
                  {cycles.slice(0, 6).map((cycle) => (
                     <CommandItem
                        key={cycle.id}
                        onSelect={() => {
                           updateIssue(issue.id, { cycleId: cycle.id });
                           toast.success(`Moved to ${cycle.name}`);
                           close();
                        }}
                     >
                        <CircleDot className="text-muted-foreground" />
                        {cycle.name}
                        <span className="text-xs text-muted-foreground ml-2">
                           {formatCycleDateRange(cycle)}
                        </span>
                        {issue.cycleId === cycle.id && <Check className="ml-auto size-4" />}
                     </CommandItem>
                  ))}
               </CommandGroup>
            )}

            {route === 'team' && issue && (
               <CommandGroup heading="Move to a different team…">
                  {teams
                     .filter((team) => team.joined)
                     .map((team) => (
                        <CommandItem
                           key={team.id}
                           onSelect={() => {
                              toast.success(`Moved to ${team.name}`);
                              close();
                           }}
                        >
                           <span className="text-sm">{team.icon}</span>
                           {team.name}
                        </CommandItem>
                     ))}
               </CommandGroup>
            )}

            {route === 'due-date' && issue && (
               <CommandGroup heading="Set due date…">
                  {(
                     [
                        ['Today', '2026-08-04'],
                        ['Tomorrow', '2026-08-05'],
                        ['End of this week', '2026-08-09'],
                        ['In one week', '2026-08-11'],
                     ] as const
                  ).map(([label, date]) => (
                     <CommandItem
                        key={label}
                        onSelect={() => {
                           updateIssue(issue.id, { dueDate: date });
                           toast.success(`Due date set to ${label.toLowerCase()}`);
                           close();
                        }}
                     >
                        <CalendarPlus className="text-muted-foreground" />
                        {label}
                     </CommandItem>
                  ))}
                  <CommandItem
                     onSelect={() => {
                        updateIssue(issue.id, { dueDate: undefined });
                        toast.success('Due date cleared');
                        close();
                     }}
                  >
                     <CalendarPlus className="text-muted-foreground" />
                     Clear due date
                  </CommandItem>
               </CommandGroup>
            )}
         </CommandList>
            </Command>
         </DialogContent>
      </Dialog>
   );
}
