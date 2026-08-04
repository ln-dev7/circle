'use client';

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

/** Centered settings page: big title, optional description, stacked sections. */
export function SettingsShell({
   title,
   description,
   children,
}: {
   title: string;
   description?: string;
   children: React.ReactNode;
}) {
   return (
      <div className="w-full overflow-y-auto h-full">
         <div className="max-w-2xl mx-auto px-6 py-10 pb-20">
            <h1 className="text-2xl font-medium">{title}</h1>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            <div className="flex flex-col gap-10 mt-10">{children}</div>
         </div>
      </div>
   );
}

export function SettingsSection({
   title,
   description,
   action,
   children,
}: {
   title?: string;
   description?: React.ReactNode;
   action?: React.ReactNode;
   children: React.ReactNode;
}) {
   return (
      <section>
         {(title || action) && (
            <div className="flex items-end justify-between gap-4 mb-1">
               <div>
                  {title && <h2 className="text-md font-medium">{title}</h2>}
                  {description && (
                     <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
                  )}
               </div>
               {action}
            </div>
         )}
         <div className="mt-3 flex flex-col gap-3">{children}</div>
      </section>
   );
}

export function SettingsCard({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) {
   return (
      <div className={cn('rounded-lg border bg-container divide-y divide-border/60', className)}>
         {children}
      </div>
   );
}

/** A single settings row: optional icon, title + description, trailing control. */
export function SettingsRow({
   icon,
   title,
   description,
   trailing,
   chevron,
   onClick,
   muted,
}: {
   icon?: React.ReactNode;
   title: React.ReactNode;
   description?: React.ReactNode;
   trailing?: React.ReactNode;
   chevron?: boolean;
   onClick?: () => void;
   muted?: boolean;
}) {
   const Comp = onClick ? 'button' : 'div';
   return (
      <Comp
         onClick={onClick}
         className={cn(
            'w-full flex items-center gap-3 px-4 py-3 text-left',
            onClick && 'hover:bg-accent/40 transition-colors cursor-pointer',
            muted && 'opacity-60'
         )}
      >
         {icon && (
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-muted/50 shrink-0 text-muted-foreground">
               {icon}
            </span>
         )}
         <div className="flex-1 min-w-0">
            <div className="text-sm font-medium flex items-center gap-2">{title}</div>
            {description && (
               <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
            )}
         </div>
         {trailing && (
            <div className="shrink-0 flex items-center gap-2 text-sm text-muted-foreground">
               {trailing}
            </div>
         )}
         {chevron && <ChevronRight className="size-4 text-muted-foreground shrink-0" />}
      </Comp>
   );
}

/** Small functional select (local state) used across the settings pages. */
export function SelectMenu({
   options,
   defaultValue,
   value: controlledValue,
   onChange,
}: {
   options: string[];
   defaultValue?: string;
   /** Optional controlled value (e.g. wired to next-themes). */
   value?: string;
   onChange?: (value: string) => void;
}) {
   const [internal, setInternal] = useState(defaultValue ?? options[0]);
   const value = controlledValue ?? internal;
   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="h-8 px-3 rounded-md border bg-container text-sm inline-flex items-center gap-1.5 hover:bg-accent transition-colors outline-none">
            {value}
            <ChevronDown className="size-3.5 text-muted-foreground" />
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" className="min-w-40">
            {options.map((option) => (
               <DropdownMenuItem
                  key={option}
                  onClick={() => {
                     setInternal(option);
                     onChange?.(option);
                  }}
                  className="flex items-center gap-2 text-sm"
               >
                  <span className="flex-1">{option}</span>
                  {value === option && <Check className="size-3.5" />}
               </DropdownMenuItem>
            ))}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}

/** "● Enabled ..." green-dot status text. */
export function EnabledDot({ children }: { children: React.ReactNode }) {
   return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
         <span className="size-1.5 rounded-full bg-[#00cc66] shrink-0" />
         {children}
      </span>
   );
}
