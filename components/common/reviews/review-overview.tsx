'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Review, ReviewFileCategory } from '@/mock-data/reviews';
import {
   ChevronDown,
   ChevronRight,
   FileCode2,
   GitCommitHorizontal,
   Paperclip,
   Plus,
   Send,
   UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DiffStat, InlineText, IssueCheckIcon, PrIcon } from './review-shared';

const CATEGORY_LABELS: Record<ReviewFileCategory, string> = {
   implementation: 'Implementation',
   tests: 'Tests',
};

function FilesPanel({ review }: { review: Review }) {
   const categories = (['implementation', 'tests'] as ReviewFileCategory[])
      .map((category) => ({
         category,
         files: review.files.filter((file) => file.category === category),
      }))
      .filter((group) => group.files.length > 0);

   return (
      <div className="flex flex-col gap-2">
         <span className="text-sm font-medium">{review.files.length} files changed</span>
         {categories.map((group) => {
            const additions = group.files.reduce((acc, file) => acc + file.additions, 0);
            const deletions = group.files.reduce((acc, file) => acc + file.deletions, 0);
            return (
               <div key={group.category} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                     <span className="font-medium text-foreground">
                        {CATEGORY_LABELS[group.category]}
                     </span>
                     {group.files.length}
                     <ChevronDown className="size-3" />
                     <span className="flex-1" />
                     <DiffStat additions={additions} deletions={deletions} />
                  </div>
                  {group.category === 'implementation' ? (
                     group.files.map((file) => (
                        <div key={file.name} className="flex items-center gap-1.5 text-xs pl-2">
                           <FileCode2 className="size-3.5 text-muted-foreground shrink-0" />
                           <span className="font-medium">{file.name}</span>
                           <span className="text-muted-foreground truncate">{file.path}</span>
                        </div>
                     ))
                  ) : (
                     <span className="text-xs text-muted-foreground pl-2">
                        {group.files.map((file) => file.name).join(', ')}
                     </span>
                  )}
               </div>
            );
         })}
      </div>
   );
}

/** Overview tab: description + timeline on the left, properties on the right. */
export function ReviewOverview({ review }: { review: Review }) {
   const { orgId } = useParams<{ orgId: string }>();

   return (
      <div className="h-full flex overflow-hidden">
         <div className="flex-1 min-w-0 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-8 py-8 flex flex-col gap-6">
               <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-semibold leading-snug">{review.title}</h1>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono flex-wrap">
                     <PrIcon status={review.status} className="size-3.5" />
                     <span>
                        {review.repo}#{review.prNumber}
                     </span>
                     <span>·</span>
                     <span>
                        {review.targetBranch} ← {review.sourceBranch}
                     </span>
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1 text-sm font-medium">
                     Description
                     <ChevronDown className="size-3.5 text-muted-foreground" />
                  </div>
                  <h2 className="text-lg font-semibold">Summary</h2>
                  <ul className="flex flex-col gap-2 list-disc pl-5 text-sm leading-relaxed">
                     {review.summary.map((bullet, index) => (
                        <li key={index}>
                           <InlineText text={bullet} />
                        </li>
                     ))}
                  </ul>
               </div>

               <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-semibold">Ticket</h2>
                  <Link
                     href={`/${orgId}/issue/${review.resolves.identifier}`}
                     className="inline-flex items-center gap-2 rounded-md bg-muted/60 border border-border/60 px-2 py-1.5 text-sm hover:bg-muted transition-colors self-start"
                  >
                     <IssueCheckIcon />
                     <span className="font-medium">{review.resolves.identifier}</span>
                     <span className="text-muted-foreground truncate">{review.resolves.title}</span>
                  </Link>
               </div>

               <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-semibold">Test plan</h2>
                  <div className="flex flex-col gap-1.5">
                     {review.testPlan.map((item, index) => (
                        <label key={index} className="flex items-start gap-2 text-sm">
                           <Checkbox checked={item.checked} className="size-4 mt-0.5" />
                           <span>
                              <InlineText text={item.text} />
                           </span>
                        </label>
                     ))}
                  </div>
               </div>

               {review.deployment && (
                  <div className="rounded-lg border overflow-hidden text-sm">
                     <div className="grid grid-cols-3 gap-2 px-3 py-2 border-b bg-sidebar/50 text-xs text-muted-foreground">
                        <span>Project</span>
                        <span>Deployment</span>
                        <span>Actions</span>
                     </div>
                     <div className="grid grid-cols-3 gap-2 px-3 py-2 items-center">
                        <span className="font-medium">{review.deployment.project}</span>
                        <span className="inline-flex items-center gap-1.5">
                           <span
                              className={cn(
                                 'size-2 rounded-full',
                                 review.deployment.state === 'Ready'
                                    ? 'bg-emerald-500'
                                    : 'bg-muted-foreground/50'
                              )}
                           />
                           {review.deployment.state}
                        </span>
                        <button className="text-primary text-left hover:underline">
                           {review.deployment.action}
                        </button>
                     </div>
                  </div>
               )}

               <div className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm text-muted-foreground">
                  <span className="size-5 rounded-full bg-muted inline-block shrink-0" />
                  <span className="flex-1">Leave a reply...</span>
                  <Paperclip className="size-4" />
                  <Send className="size-4" />
               </div>

               <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <GitCommitHorizontal className="size-3.5 shrink-0" />
                  <span className="truncate">
                     Atlas committed via LNDev Agent{' '}
                     <span className="font-mono">{review.commits.at(-1)?.sha}</span>{' '}
                     {review.commits.at(-1)?.message} ({review.resolves.identifier}) ·{' '}
                     {review.commits.at(-1)?.timeAgo}
                  </span>
               </div>

               {review.reviewNote && (
                  <div className="rounded-lg border p-4 flex flex-col gap-3">
                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="size-5 rounded-full bg-muted inline-block" />
                        <span className="font-medium text-foreground">
                           {review.reviewNote.author}
                        </span>
                        {review.reviewNote.timeAgo}
                     </div>
                     <h3 className="text-base font-semibold">Review results</h3>
                     <blockquote className="border-l-2 border-emerald-500 pl-3 text-sm leading-relaxed">
                        {review.reviewNote.verdictLine}
                     </blockquote>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.reviewNote.profileLine}
                     </p>
                     <div className="rounded-md border overflow-hidden text-sm">
                        <div className="grid grid-cols-5 gap-2 px-3 py-1.5 border-b bg-sidebar/50 text-xs text-muted-foreground">
                           <span>Review</span>
                           <span>Verdict</span>
                           <span>Critical</span>
                           <span>High</span>
                           <span>Medium</span>
                        </div>
                        {review.reviewNote.rows.map((row) => (
                           <div
                              key={row.review}
                              className="grid grid-cols-5 gap-2 px-3 py-2 border-b last:border-b-0 text-xs items-start"
                           >
                              <span className="font-medium">{row.review}</span>
                              <span>{row.verdict}</span>
                              <span>{row.critical}</span>
                              <span>{row.high}</span>
                              <span>{row.medium}</span>
                           </div>
                        ))}
                     </div>
                     {review.reviewNote.footer && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                           {review.reviewNote.footer}
                        </p>
                     )}
                  </div>
               )}
            </div>
         </div>

         <aside className="hidden lg:flex flex-col w-72 shrink-0 border-l h-full overflow-y-auto p-5 gap-6">
            <div className="flex flex-col gap-2">
               <span className="text-sm font-medium">Status</span>
               <span className="inline-flex items-center gap-1.5 text-sm">
                  <PrIcon status={review.status} />
                  {review.status === 'merged'
                     ? 'Merged'
                     : review.status === 'closed'
                       ? 'Closed'
                       : 'Open'}
               </span>
            </div>
            <div className="flex flex-col gap-2">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Resolves</span>
                  <Plus className="size-3.5 text-muted-foreground" />
               </div>
               <Link
                  href={`/${orgId}/issue/${review.resolves.identifier}`}
                  className="flex items-center gap-1.5 text-sm hover:opacity-80 min-w-0"
               >
                  <IssueCheckIcon />
                  <span className="truncate">{review.resolves.title}</span>
               </Link>
            </div>
            <div className="flex flex-col gap-2">
               <span className="text-sm font-medium">Reviewers</span>
               <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors self-start">
                  <UserPlus className="size-4" />
                  Add reviewers
               </button>
            </div>
            <div className="flex flex-col gap-2">
               <span className="text-sm font-medium">Checks</span>
               <span className="inline-flex items-center gap-1.5 text-sm">
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                  {review.checksPassed} / {review.checksTotal} passed
               </span>
               <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span className="size-3.5 rounded-full border-2 border-muted-foreground/50 inline-block" />
                  gate
               </span>
            </div>
            <FilesPanel review={review} />
         </aside>
      </div>
   );
}
