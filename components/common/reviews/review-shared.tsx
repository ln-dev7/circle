'use client';

import { cn } from '@/lib/utils';
import { ReviewStatus } from '@/mock-data/reviews';
import { Fragment } from 'react';

/** Colored pull-request icon (purple merged, gray closed). */
export function PrIcon({ status, className }: { status: ReviewStatus; className?: string }) {
   return (
      <svg
         viewBox="0 0 16 16"
         className={cn('size-4 shrink-0', className)}
         fill={status === 'merged' ? '#8250df' : '#d1242f'}
         aria-hidden
      >
         <path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
      </svg>
   );
}

/** Violet check chip used for the linked issue. */
export function IssueCheckIcon({ className }: { className?: string }) {
   return (
      <svg viewBox="0 0 16 16" className={cn('size-4 shrink-0', className)} aria-hidden>
         <circle cx="8" cy="8" r="7" fill="#5e6ad2" />
         <path
            d="M5 8.2 7.2 10.4 11 6.2"
            fill="none"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   );
}

/** Renders `inline code` spans inside a text string. */
export function InlineText({ text }: { text: string }) {
   const parts = text.split('`');
   return (
      <>
         {parts.map((part, index) =>
            index % 2 === 1 ? (
               <code
                  key={index}
                  className="bg-muted/70 border border-border/60 rounded px-1 py-px text-[0.85em] font-mono"
               >
                  {part}
               </code>
            ) : (
               <Fragment key={index}>{part}</Fragment>
            )
         )}
      </>
   );
}

/** "+46 -1" colored diff stat. */
export function DiffStat({
   additions,
   deletions,
   className,
}: {
   additions: number;
   deletions: number;
   className?: string;
}) {
   return (
      <span className={cn('inline-flex items-center gap-1 text-xs font-medium', className)}>
         <span className="text-emerald-600 dark:text-emerald-400">+{additions}</span>
         {deletions > 0 && <span className="text-red-500">-{deletions}</span>}
      </span>
   );
}
