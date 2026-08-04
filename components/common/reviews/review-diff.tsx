'use client';

import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getReviewFileDiff, Review } from '@/mock-data/reviews';
import {
   Check,
   FileCode2,
   GitCommitHorizontal,
   ListFilter,
   Search,
   SlidersHorizontal,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DiffView } from './diff-view';

/** Diff tab: Files / Commits toolbar, file list and stacked unified diffs. */
export function ReviewDiff({ review }: { review: Review }) {
   const [query, setQuery] = useState('');

   const files = useMemo(
      () =>
         review.files.filter((file) =>
            (file.name + file.path).toLowerCase().includes(query.trim().toLowerCase())
         ),
      [review.files, query]
   );

   return (
      <div className="h-full flex flex-col overflow-hidden">
         <div className="flex items-center justify-between gap-2 px-4 py-2 border-b shrink-0">
            <div className="flex items-center gap-1.5 text-xs">
               <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border bg-accent font-medium">
                  <ListFilter className="size-3.5" />
                  Files
                  <span className="text-muted-foreground">{review.files.length}</span>
               </span>
               <Popover>
                  <PopoverTrigger asChild>
                     <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-muted-foreground hover:bg-accent/50 transition-colors">
                        <GitCommitHorizontal className="size-3.5" />
                        Commits
                        <span>{review.commits.length}</span>
                     </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-96 p-0 text-sm">
                     <div className="flex items-center justify-between px-3 py-2 border-b">
                        <span className="font-medium">All commits</span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                           <Check className="size-3.5" />
                           {review.commits.length} commits
                        </span>
                     </div>
                     {review.commits.map((commit) => (
                        <div
                           key={commit.sha}
                           className="flex items-center gap-2 px-3 py-2 border-b last:border-b-0 text-xs"
                        >
                           <span className="font-mono text-muted-foreground">{commit.sha}</span>
                           <span className="flex-1 truncate">{commit.message}</span>
                           <span className="text-muted-foreground shrink-0">{commit.timeAgo}</span>
                        </div>
                     ))}
                  </PopoverContent>
               </Popover>
            </div>
            <SlidersHorizontal className="size-4 text-muted-foreground" />
         </div>

         <div className="flex-1 min-h-0 flex overflow-hidden">
            <div className="hidden md:flex flex-col w-64 shrink-0 border-r p-3 gap-2 overflow-y-auto">
               <div className="relative shrink-0">
                  <Search className="size-3.5 text-muted-foreground absolute left-2 top-1/2 -translate-y-1/2" />
                  <Input
                     placeholder="Filter files..."
                     value={query}
                     onChange={(event) => setQuery(event.target.value)}
                     className="pl-7 h-8 text-xs"
                  />
               </div>
               {files.map((file) => (
                  <a
                     key={file.name + file.path}
                     href={`#diff-${file.name}`}
                     className={cn(
                        'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs hover:bg-accent/50 transition-colors'
                     )}
                  >
                     <FileCode2 className="size-3.5 text-muted-foreground shrink-0" />
                     <span className="font-medium truncate">{file.name}</span>
                     <span className="text-muted-foreground truncate">{file.path}</span>
                  </a>
               ))}
            </div>
            <div className="flex-1 min-w-0 overflow-y-auto p-4 flex flex-col gap-4">
               {files.map((file) => (
                  <div key={file.name + file.path} id={`diff-${file.name}`}>
                     <DiffView diff={getReviewFileDiff(review, file)} />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
