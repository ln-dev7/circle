'use client';

import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
   SidebarBadgeStyle,
   SidebarItemKey,
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
   GripVertical,
   Inbox,
   Layers,
   LucideIcon,
   UserRound,
} from 'lucide-react';

interface ItemConfig {
   key: SidebarItemKey;
   label: string;
   icon: LucideIcon;
   /** Items with a badge get the "Show when badged" option. */
   badged?: boolean;
}

const PERSONAL_ITEMS: ItemConfig[] = [
   { key: 'inbox', label: 'Inbox', icon: Inbox, badged: true },
   { key: 'my-issues', label: 'My issues', icon: FolderKanban },
   { key: 'agent', label: 'Agent', icon: Bot },
];

const WORKSPACE_ITEMS: ItemConfig[] = [
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

function ItemRow({ item }: { item: ItemConfig }) {
   const { visibility, setVisibility } = useSidebarPrefsStore();
   const current = visibility[item.key];
   const options: SidebarVisibility[] = item.badged
      ? ['always', 'badged', 'never']
      : ['always', 'never'];

   return (
      <div className="flex items-center gap-2 px-3 py-2.5">
         <GripVertical className="size-3.5 text-muted-foreground/50 shrink-0" />
         <item.icon
            className={cn('size-4 shrink-0', current === 'never' && 'text-muted-foreground/50')}
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
}

/** Linear-style "Customize sidebar" modal (badge style + item visibility). */
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
                  <div className="rounded-lg border divide-y divide-border/60">
                     {PERSONAL_ITEMS.map((item) => (
                        <ItemRow key={item.key} item={item} />
                     ))}
                  </div>
               </div>

               <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Workspace</span>
                  <div className="rounded-lg border divide-y divide-border/60">
                     {WORKSPACE_ITEMS.map((item) => (
                        <ItemRow key={item.key} item={item} />
                     ))}
                  </div>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
