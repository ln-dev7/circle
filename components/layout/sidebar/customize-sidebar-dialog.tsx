'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
   resolveOrder,
   SidebarBadgeStyle,
   SidebarItemKey,
   SidebarSection,
   SidebarVisibility,
   useSidebarPrefsStore,
} from '@/store/sidebar-prefs-store';
import {
   Bot,
   Box,
   Check,
   ChevronDown,
   Compass,
   ContactRound,
   FolderKanban,
   GitPullRequestArrow,
   GripVertical,
   Inbox,
   Layers,
   LucideIcon,
   UserRound,
} from 'lucide-react';
import { useRef, useState } from 'react';

interface ItemConfig {
   key: SidebarItemKey;
   label: string;
   icon: LucideIcon;
   /** Items with a badge get the "Show when badged" option. */
   badged?: boolean;
}

export const PERSONAL_ITEMS: ItemConfig[] = [
   { key: 'inbox', label: 'Inbox', icon: Inbox, badged: true },
   { key: 'reviews', label: 'Reviews', icon: GitPullRequestArrow, badged: true },
   { key: 'my-issues', label: 'My issues', icon: FolderKanban },
   { key: 'agent', label: 'Agent', icon: Bot },
];

export const WORKSPACE_ITEMS: ItemConfig[] = [
   { key: 'initiatives', label: 'Initiatives', icon: Compass },
   { key: 'projects', label: 'Projects', icon: Box },
   { key: 'views', label: 'Views', icon: Layers },
   { key: 'teams', label: 'Teams', icon: ContactRound },
   { key: 'members', label: 'Members', icon: UserRound },
];

const VISIBILITY_LABELS: Record<SidebarVisibility, string> = {
   always: 'Always show',
   badged: 'Show when badged',
   never: "Don't show",
};

function VisibilityDropdown({
   value,
   options,
   onChange,
}: {
   value: SidebarVisibility;
   options: SidebarVisibility[];
   onChange: (value: SidebarVisibility) => void;
}) {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors outline-none">
            {VISIBILITY_LABELS[value]}
            <ChevronDown className="size-3.5" />
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" className="min-w-44">
            {options.map((option) => (
               <DropdownMenuItem key={option} onClick={() => onChange(option)}>
                  {VISIBILITY_LABELS[option]}
                  {value === option && <Check className="ml-auto size-3.5" />}
               </DropdownMenuItem>
            ))}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}

/** One section (Personal / Workspace): rows reorderable by dragging the grip. */
function ItemSection({ section, items }: { section: SidebarSection; items: ItemConfig[] }) {
   const { visibility, order, setVisibility, moveItem } = useSidebarPrefsStore();
   const [dragIndex, setDragIndex] = useState<number | null>(null);
   const [overIndex, setOverIndex] = useState<number | null>(null);
   /** Only start a drag when it was initiated from the grip handle. */
   const dragFromGrip = useRef(false);

   const orderedKeys = resolveOrder(
      order[section],
      items.map((item) => item.key)
   );
   const ordered = orderedKeys
      .map((key) => items.find((item) => item.key === key))
      .filter((item): item is ItemConfig => Boolean(item));

   const resetDrag = () => {
      setDragIndex(null);
      setOverIndex(null);
      dragFromGrip.current = false;
   };

   return (
      <div className="rounded-lg border divide-y divide-border/60">
         {ordered.map((item, index) => {
            const current = visibility[item.key] ?? 'always';
            const options: SidebarVisibility[] = item.badged
               ? ['always', 'badged', 'never']
               : ['always', 'never'];
            return (
               <div
                  key={item.key}
                  draggable
                  onDragStart={(event) => {
                     if (!dragFromGrip.current) {
                        event.preventDefault();
                        return;
                     }
                     event.dataTransfer.effectAllowed = 'move';
                     setDragIndex(index);
                  }}
                  onDragOver={(event) => {
                     event.preventDefault();
                     if (dragIndex !== null) setOverIndex(index);
                  }}
                  onDrop={(event) => {
                     event.preventDefault();
                     if (dragIndex !== null && dragIndex !== index) {
                        moveItem(section, dragIndex, index);
                     }
                     resetDrag();
                  }}
                  onDragEnd={resetDrag}
                  className={cn(
                     'flex items-center gap-2 px-3 py-2.5 transition-colors',
                     dragIndex === index && 'opacity-40',
                     overIndex === index &&
                        dragIndex !== null &&
                        dragIndex !== index &&
                        'bg-accent/50'
                  )}
               >
                  <span
                     onMouseDown={() => (dragFromGrip.current = true)}
                     onMouseUp={() => (dragFromGrip.current = false)}
                     className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground shrink-0"
                     aria-label={`Reorder ${item.label}`}
                  >
                     <GripVertical className="size-3.5" />
                  </span>
                  <item.icon
                     className={cn(
                        'size-4 shrink-0',
                        current === 'never' && 'text-muted-foreground/50'
                     )}
                  />
                  <span
                     className={cn(
                        'flex-1 text-sm',
                        current === 'never' && 'text-muted-foreground/60'
                     )}
                  >
                     {item.label}
                  </span>
                  <VisibilityDropdown
                     value={current}
                     options={options}
                     onChange={(value) => setVisibility(item.key, value)}
                  />
               </div>
            );
         })}
      </div>
   );
}

/** Linear-style "Customize sidebar" modal (badge style, visibility, drag & drop order). */
export function CustomizeSidebarDialog({
   open,
   onOpenChange,
}: {
   open: boolean;
   onOpenChange: (open: boolean) => void;
}) {
   const { badgeStyle, setBadgeStyle } = useSidebarPrefsStore();

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-md p-0 gap-0">
            <DialogHeader className="px-5 pt-5 pb-3">
               <DialogTitle className="text-base">Customize sidebar</DialogTitle>
            </DialogHeader>
            <div className="px-5 pb-5 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
               <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
                  <span className="text-sm">Default badge style</span>
                  <DropdownMenu>
                     <DropdownMenuTrigger className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors outline-none">
                        {badgeStyle === 'count' ? (
                           <span className="text-xs bg-accent rounded px-1">1</span>
                        ) : (
                           <span className="size-1.5 rounded-full bg-muted-foreground inline-block" />
                        )}
                        {badgeStyle === 'count' ? 'Count' : 'Dot'}
                        <ChevronDown className="size-3.5" />
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="min-w-32">
                        {(['count', 'dot'] as SidebarBadgeStyle[]).map((style) => (
                           <DropdownMenuItem key={style} onClick={() => setBadgeStyle(style)}>
                              {style === 'count' ? 'Count' : 'Dot'}
                              {badgeStyle === style && <Check className="ml-auto size-3.5" />}
                           </DropdownMenuItem>
                        ))}
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>

               <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Personal</span>
                  <ItemSection section="personal" items={PERSONAL_ITEMS} />
               </div>

               <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Workspace</span>
                  <ItemSection section="workspace" items={WORKSPACE_ITEMS} />
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
