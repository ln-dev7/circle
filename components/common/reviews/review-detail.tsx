'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getReviewById } from '@/mock-data/reviews';
import { Eye, Link2, MoreHorizontal, Play, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ReviewDiff } from './review-diff';
import { ReviewGuide } from './review-guide';
import { ReviewOverview } from './review-overview';
import { DiffStat, IssueCheckIcon, PrIcon } from './review-shared';

export type ReviewSection = 'overview' | 'guide' | 'diff';

const SECTION_TABS: { key: ReviewSection; label: string; path: string }[] = [
   { key: 'overview', label: 'Overview', path: '' },
   { key: 'guide', label: 'Guide', path: '/review' },
   { key: 'diff', label: 'Diff', path: '/changes' },
];

/** Right pane of the Reviews split view: breadcrumb, tabs and section body. */
export function ReviewDetail({
   reviewId,
   section,
}: {
   reviewId: string;
   section: ReviewSection;
}) {
   const { orgId } = useParams<{ orgId: string }>();
   const review = getReviewById(reviewId);

   if (!review) {
      return (
         <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            Review not found
         </div>
      );
   }

   return (
      <div className="h-full flex flex-col overflow-hidden">
         <div className="flex items-center gap-2 px-4 h-10 border-b shrink-0 min-w-0">
            <Link
               href={`/${orgId}/issue/${review.resolves.identifier}`}
               className="flex items-center gap-1.5 shrink-0 hover:opacity-80"
            >
               <IssueCheckIcon />
               <span className="text-sm font-medium">{review.resolves.identifier}</span>
            </Link>
            <span className="text-muted-foreground text-xs shrink-0">›</span>
            <PrIcon status={review.status} />
            <span className="text-sm font-medium truncate">{review.title}</span>
            <DiffStat additions={review.additions} deletions={review.deletions} />
            <span className="flex-1" />
            <Star className="size-3.5 text-muted-foreground shrink-0" />
            <MoreHorizontal className="size-3.5 text-muted-foreground shrink-0" />
            <Link2 className="size-3.5 text-muted-foreground shrink-0 hidden sm:block" />
         </div>
         <div className="flex items-center justify-between px-4 h-10 border-b shrink-0">
            <div className="flex items-center gap-1.5">
               {SECTION_TABS.map((tab) => (
                  <Link
                     key={tab.key}
                     href={`/${orgId}/review/${review.id}${tab.path}`}
                     className={cn(
                        'px-2.5 py-1 rounded-md border text-xs font-medium transition-colors',
                        section === tab.key
                           ? 'bg-accent border-transparent'
                           : 'text-muted-foreground hover:bg-accent/50'
                     )}
                  >
                     {tab.label}
                  </Link>
               ))}
            </div>
            <div className="flex items-center gap-1">
               <Button size="xs" variant="ghost">
                  <Eye className="size-3.5" />
                  Preview
               </Button>
               <Play className="size-3.5 text-muted-foreground" />
            </div>
         </div>
         <div className="flex-1 min-h-0 overflow-hidden">
            {section === 'overview' && <ReviewOverview review={review} />}
            {section === 'guide' && <ReviewGuide review={review} />}
            {section === 'diff' && <ReviewDiff review={review} />}
         </div>
      </div>
   );
}
