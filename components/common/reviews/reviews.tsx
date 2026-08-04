'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
   createdReviews,
   forYouReviews,
   Review,
   ReviewList,
   ReviewStatus,
} from '@/mock-data/reviews';
import { ListFilter, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ReviewDetail, ReviewSection } from './review-detail';
import { PrIcon } from './review-shared';

/** Hand-drawn empty-state sketch (paper plane over a folded sheet). */
function EmptySketch() {
   return (
      <svg width="150" height="120" viewBox="0 0 150 120" fill="none" aria-hidden>
         <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M28 78l58-22 34 30-64 16z" />
            <path d="M28 78l30-6 28 28" />
            <path d="M86 56l-8 40" strokeDasharray="4 4" />
            <path d="M104 34c8-10 22-12 26-6s-4 16-14 18" />
            <path d="M116 46c-4 2-8 2-12 0" />
            <path d="M44 66l6-2M56 84l6-2M70 92l6-2" strokeDasharray="3 4" />
         </g>
      </svg>
   );
}

const GROUP_LABELS: Record<ReviewStatus, string> = { merged: 'Merged', closed: 'Closed' };

function ReviewRow({
   review,
   orgId,
   selected,
}: {
   review: Review;
   orgId: string;
   selected: boolean;
}) {
   return (
      <Link
         href={`/${orgId}/review/${review.id}`}
         className={cn(
            'flex items-center gap-2 px-4 py-2 text-sm border-b border-border/40 transition-colors',
            selected ? 'bg-accent/60' : 'hover:bg-sidebar/50'
         )}
      >
         <PrIcon status={review.status} />
         <span className="flex-1 truncate">{review.title}</span>
         <span className="text-xs text-muted-foreground shrink-0">{review.timeAgo}</span>
      </Link>
   );
}

function GroupHeader({ label }: { label: string }) {
   return (
      <div className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-[color-mix(in_oklab,var(--accent)_30%,var(--container))] border-b border-border/40">
         {label}
         <svg width="8" height="8" viewBox="0 0 8 8" className="text-muted-foreground" aria-hidden>
            <path d="M1 3l3 3 3-3" stroke="currentColor" strokeWidth="1.2" fill="none" />
         </svg>
      </div>
   );
}

interface ReviewsProps {
   /** Which list tab is active ("/reviews" vs "/reviews/created"). */
   listTab?: ReviewList;
   /** Selected review (detail routes). */
   selectedReviewId?: string;
   section?: ReviewSection;
}

/** Reviews split view: list panel (For you / Created) + detail or empty state. */
export default function Reviews({
   listTab = 'for-you',
   selectedReviewId,
   section = 'overview',
}: ReviewsProps) {
   const { orgId } = useParams<{ orgId: string }>();
   const source = listTab === 'for-you' ? forYouReviews : createdReviews;

   const groups =
      listTab === 'for-you'
         ? [{ label: 'Completed', items: source }]
         : (['merged', 'closed'] as ReviewStatus[])
              .map((status) => ({
                 label: GROUP_LABELS[status],
                 items: source.filter((review) => review.status === status),
              }))
              .filter((group) => group.items.length > 0);

   return (
      <div className="w-full h-full flex overflow-hidden">
         <div className="w-[420px] max-w-[45%] shrink-0 border-r h-full flex flex-col bg-container">
            <div className="flex items-center justify-between px-4 py-1.5 h-10 border-b shrink-0">
               <div className="flex items-center gap-2">
                  <SidebarTrigger />
                  <span className="text-sm font-medium">Reviews</span>
               </div>
               <div className="flex items-center gap-2 text-muted-foreground">
                  <ListFilter className="size-4" />
                  <SlidersHorizontal className="size-4" />
               </div>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2 shrink-0">
               <Link
                  href={`/${orgId}/reviews`}
                  className={cn(
                     'px-2.5 py-1 rounded-md border text-xs font-medium transition-colors',
                     listTab === 'for-you'
                        ? 'bg-accent border-transparent'
                        : 'text-muted-foreground hover:bg-accent/50'
                  )}
               >
                  For you
               </Link>
               <Link
                  href={`/${orgId}/reviews/created`}
                  className={cn(
                     'px-2.5 py-1 rounded-md border text-xs font-medium transition-colors',
                     listTab === 'created'
                        ? 'bg-accent border-transparent'
                        : 'text-muted-foreground hover:bg-accent/50'
                  )}
               >
                  Created
               </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
               {groups.map((group) => (
                  <div key={group.label}>
                     <GroupHeader label={group.label} />
                     {group.items.map((review) => (
                        <ReviewRow
                           key={review.id}
                           review={review}
                           orgId={orgId}
                           selected={review.id === selectedReviewId}
                        />
                     ))}
                  </div>
               ))}
            </div>
         </div>

         <div className="flex-1 min-w-0 h-full overflow-hidden">
            {selectedReviewId ? (
               <ReviewDetail reviewId={selectedReviewId} section={section} />
            ) : (
               <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
                  <EmptySketch />
                  <span className="text-sm">{source.length} reviews</span>
               </div>
            )}
         </div>
      </div>
   );
}
