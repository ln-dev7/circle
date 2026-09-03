'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StatusTriageIcon } from '@/mock-data/status';
import { TriageItem } from '@/mock-data/triage';
import { useTriageStore } from '@/store/triage-store';
import { Box, Check, Clock, Sparkles, Star, Tag, UserRound, X } from 'lucide-react';
import { RiDonutChartFill } from '@remixicon/react';

/* ------------------------------ building blocks ---------------------------- */

function PropertyRow({ children }: { children: React.ReactNode }) {
   return <div className="flex items-center gap-2 text-sm">{children}</div>;
}

const LABEL_DOTS: Record<string, string> = {
   purple: '#a855f7',
   red: '#ef4444',
   green: '#22c55e',
   blue: '#3b82f6',
   yellow: '#eab308',
   orange: '#f97316',
   pink: '#ec4899',
   gray: '#6b7280',
   indigo: '#6366f1',
   teal: '#14b8a6',
};

/** The "Triage Intelligence" strip: suggestions + related issues. */
function IntelligenceCard({ item }: { item: TriageItem }) {
   const { intelligence } = item;
   const chips: React.ReactNode[] = [];

   if (intelligence.suggestedAssignee) {
      chips.push(
         <span
            key="assignee"
            className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs"
         >
            <Avatar className="size-3.5">
               <AvatarImage
                  src={intelligence.suggestedAssignee.avatarUrl}
                  alt={intelligence.suggestedAssignee.name}
               />
               <AvatarFallback className="text-[7px]">
                  {intelligence.suggestedAssignee.name[0]}
               </AvatarFallback>
            </Avatar>
            {intelligence.suggestedAssignee.name}
         </span>
      );
   }
   if (intelligence.suggestedProject) {
      const ProjectIcon = intelligence.suggestedProject.icon;
      chips.push(
         <span
            key="project"
            className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs"
         >
            <ProjectIcon className="size-3.5 text-muted-foreground" />
            <span className="truncate max-w-40">{intelligence.suggestedProject.name}</span>
         </span>
      );
   }
   intelligence.suggestedLabels.forEach((label) => {
      chips.push(
         <span
            key={label.id}
            className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs"
         >
            <span
               className="size-2 rounded-full"
               style={{ backgroundColor: LABEL_DOTS[label.color] ?? '#6b7280' }}
            />
            {label.name}
         </span>
      );
   });

   if (chips.length === 0 && intelligence.related.length === 0) return null;

   return (
      <div className="rounded-lg border bg-container/60 p-4 flex flex-col gap-3">
         <span className="inline-flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4 text-muted-foreground" />
            Triage Intelligence
         </span>
         {chips.length > 0 && (
            <div className="flex items-start gap-3 text-xs">
               <span className="text-muted-foreground shrink-0 pt-1">Suggestions</span>
               <span className="flex items-center gap-1.5 flex-wrap">{chips}</span>
            </div>
         )}
         {intelligence.related.length > 0 && (
            <div className="flex items-start gap-3 text-xs">
               <span className="text-muted-foreground shrink-0 pt-0.5">Related to</span>
               <span className="flex flex-col gap-1.5 min-w-0">
                  {intelligence.related.map((related) => (
                     <span
                        key={related.identifier}
                        className="inline-flex items-center gap-1.5 min-w-0"
                     >
                        <related.status.icon />
                        <span className="text-muted-foreground">{related.identifier}</span>
                        <span className="truncate">{related.title}</span>
                     </span>
                  ))}
               </span>
            </div>
         )}
      </div>
   );
}

/** The fake embedded screenshot — a light-mode billing widget, re-drawn. */
function PreviewCard({ preview }: { preview: NonNullable<TriageItem['preview']> }) {
   return (
      <div className="rounded-lg border bg-white text-zinc-900 p-6 shadow-sm">
         <div className="text-sm font-semibold mb-3">{preview.title}</div>
         <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-start justify-between gap-4">
               <div className="flex flex-col gap-1 min-w-0">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                     <span className="size-2 rounded-full bg-emerald-500" />
                     {preview.statusLine}
                  </span>
                  <span className="text-xs text-zinc-500">{preview.statusDetail}</span>
                  <span className="text-sm mt-1">
                     <span className="font-semibold">{preview.price}</span>{' '}
                     <span className="text-xs text-zinc-500">{preview.priceSuffix}</span>
                  </span>
               </div>
               <span className="shrink-0 rounded bg-zinc-200 px-2 py-0.5 text-[11px] text-zinc-700">
                  {preview.badge}
               </span>
            </div>
            <button className="mt-3 rounded border border-zinc-300 bg-white px-2.5 py-1 text-xs">
               {preview.button}
            </button>
         </div>
      </div>
   );
}

/* ---------------------------------- export --------------------------------- */

export function TriageDetails({ item }: { item: TriageItem }) {
   const { accept, decline, snooze, select } = useTriageStore();

   return (
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
         <div className="flex items-center gap-2 border-b px-6 h-10 shrink-0">
            <button
               onClick={() => select(null)}
               className="lg:hidden text-xs text-muted-foreground hover:text-foreground"
            >
               Back
            </button>
            <span className="text-sm text-muted-foreground shrink-0">{item.identifier}</span>
            <span className="text-sm font-medium truncate">{item.title}</span>
            <Star className="size-3.5 text-muted-foreground shrink-0" />
            <div className="ml-auto flex items-center gap-1.5 shrink-0">
               <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => accept(item.id)}
               >
                  <Check className="size-4" />
                  Accept
               </Button>
               <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => decline(item.id)}
               >
                  <X className="size-4" />
                  Decline
               </Button>
               <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => snooze(item.id)}
               >
                  <Clock className="size-4" />
               </Button>
            </div>
         </div>

         <div className="flex-1 min-h-0 flex overflow-hidden">
            <div className="flex-1 min-w-0 overflow-y-auto">
               <div className="max-w-2xl mx-auto px-8 py-8 flex flex-col gap-5">
                  <h1 className="text-2xl font-semibold">{item.title}</h1>
                  <IntelligenceCard item={item} />
                  {item.sections.map((section) => (
                     <div key={section.heading} className="flex flex-col gap-1.5">
                        <h2 className="text-sm font-semibold">{section.heading}</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                           {section.body}
                        </p>
                     </div>
                  ))}
                  {item.preview && <PreviewCard preview={item.preview} />}
               </div>
            </div>

            <aside className="hidden xl:flex flex-col w-64 shrink-0 border-l h-full overflow-y-auto p-5 gap-6">
               <div className="flex flex-col gap-3">
                  <span className="text-xs text-muted-foreground">Properties</span>
                  <PropertyRow>
                     <span className="inline-flex items-center gap-2">
                        <StatusTriageIcon color="#f2790f" />
                        Triage
                     </span>
                  </PropertyRow>
                  <PropertyRow>
                     <button className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <span className="text-muted-foreground">---</span>
                        Set priority
                     </button>
                  </PropertyRow>
                  <PropertyRow>
                     <button className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <UserRound className="size-4" />
                        Assign
                     </button>
                  </PropertyRow>
                  <PropertyRow>
                     <button className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <RiDonutChartFill className="size-4" />
                        Add to cycle
                     </button>
                  </PropertyRow>
               </div>
               <div className="flex flex-col gap-3">
                  <span className="text-xs text-muted-foreground">Labels</span>
                  <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                     <Tag className="size-4" />
                     Add label
                  </button>
               </div>
               <div className="flex flex-col gap-3">
                  <span className="text-xs text-muted-foreground">Project</span>
                  <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                     <Box className="size-4" />
                     Add to project
                  </button>
               </div>
            </aside>
         </div>
      </div>
   );
}
