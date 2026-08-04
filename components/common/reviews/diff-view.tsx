'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { FileDiff } from '@/mock-data/reviews';
import { ArrowDownToLine, FileCode2, MoreHorizontal } from 'lucide-react';
import { DiffStat } from './review-shared';

/** One file diff: header (name, path, stats, Reviewed) + unified code view. */
export function DiffView({ diff }: { diff: FileDiff }) {
   return (
      <div className="rounded-lg border overflow-hidden bg-container">
         <div className="flex items-center gap-2 px-3 py-2 border-b bg-sidebar/50 text-sm">
            <FileCode2 className="size-4 text-muted-foreground shrink-0" />
            <span className="font-medium">{diff.name}</span>
            <span className="text-xs text-muted-foreground truncate">{diff.path}/</span>
            <span className="flex-1" />
            <DiffStat additions={diff.additions} deletions={diff.deletions} />
            <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
               <Checkbox className="size-3.5" />
               Reviewed
            </label>
            <MoreHorizontal className="size-4 text-muted-foreground" />
         </div>
         <div className="font-mono text-xs leading-5 overflow-x-auto">
            {diff.lines.map((line, index) => {
               if (line.type === 'skip') {
                  return (
                     <div
                        key={index}
                        className="flex items-center justify-center gap-1.5 py-1.5 text-muted-foreground bg-sidebar/40 border-y border-border/40"
                     >
                        <ArrowDownToLine className="size-3" />
                        {line.count} unchanged lines
                     </div>
                  );
               }
               return (
                  <div
                     key={index}
                     className={cn(
                        'flex',
                        line.type === 'add' && 'bg-emerald-500/10',
                        line.type === 'del' && 'bg-red-500/10'
                     )}
                  >
                     <span
                        className={cn(
                           'w-10 shrink-0 text-right pr-2 select-none text-muted-foreground/60 border-r border-border/40',
                           line.type === 'add' && 'border-l-2 border-l-emerald-500',
                           line.type === 'del' && 'border-l-2 border-l-red-500'
                        )}
                     >
                        {line.type === 'del' ? '-' : line.number}
                     </span>
                     <pre className="px-3 whitespace-pre">{line.text}</pre>
                  </div>
               );
            })}
         </div>
      </div>
   );
}
