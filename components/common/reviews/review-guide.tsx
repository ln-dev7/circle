'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
   getReviewFileDiff,
   getReviewGuide,
   Review,
} from '@/mock-data/reviews';
import { FileCode2 } from 'lucide-react';
import { useMemo } from 'react';
import { DiffView } from './diff-view';
import { DiffStat, InlineText, PrIcon } from './review-shared';

/** Guide tab: narrated walk-through sections next to the relevant diff. */
export function ReviewGuide({ review }: { review: Review }) {
   const sections = useMemo(() => getReviewGuide(review), [review]);

   return (
      <div className="h-full overflow-y-auto relative">
         <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-10">
            <div className="flex flex-col gap-1.5">
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

            {sections.map((section, index) => {
               const file = review.files.find((candidate) => candidate.name === section.diffName);
               const diff = file ? getReviewFileDiff(review, file) : undefined;
               return (
                  <div
                     key={section.title}
                     className="grid grid-cols-1 xl:grid-cols-[minmax(260px,1fr)_2fr] gap-6"
                  >
                     <div className="flex flex-col gap-3">
                        <h2 className="text-lg font-semibold leading-snug">{section.title}</h2>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                           {String(index + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
                           <label className="inline-flex items-center gap-1.5 cursor-pointer">
                              <Checkbox className="size-3.5" />
                              Reviewed
                           </label>
                        </div>
                        {section.paragraphs.map((paragraph, pIndex) => (
                           <p key={pIndex} className="text-sm leading-relaxed">
                              <InlineText text={paragraph} />
                           </p>
                        ))}
                        <div className="flex flex-col gap-1.5 mt-1">
                           {section.fileRefs.map((ref) => (
                              <div
                                 key={ref.name}
                                 className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs bg-container"
                              >
                                 <FileCode2 className="size-3.5 text-muted-foreground shrink-0" />
                                 <span className="font-medium">{ref.name}</span>
                                 <span className="text-muted-foreground truncate flex-1">
                                    {ref.path}
                                 </span>
                                 <span className="text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
                                    {ref.stat}
                                 </span>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div>{diff && <DiffView diff={diff} />}</div>
                  </div>
               );
            })}
         </div>

         <div className="sticky bottom-4 flex justify-center pointer-events-none">
            <span className="pointer-events-auto inline-flex items-center gap-2 rounded-full border bg-container shadow-sm px-4 py-1.5 text-xs text-muted-foreground">
               {review.files.length} files changed
               <DiffStat additions={review.additions} deletions={review.deletions} />
            </span>
         </div>
      </div>
   );
}
