'use client';

import { cn } from '@/lib/utils';
import { ContentBlock } from '@/mock-data/issue-details';
import { AlignLeft } from 'lucide-react';
import { RefObject, useEffect, useMemo, useState } from 'react';

export interface OutlineItem {
   id: string;
   text: string;
   level: number;
}

/** Heading anchors of a block list (ids match ContentBlocks' `doc-h-{index}`). */
export function getOutlineItems(blocks: ContentBlock[]): OutlineItem[] {
   const items: OutlineItem[] = [];
   blocks.forEach((block, index) => {
      if (block.type === 'heading') {
         items.push({ id: `doc-h-${index}`, text: block.text, level: block.level ?? 1 });
      }
   });
   return items;
}

/**
 * Linear-style document outline for long descriptions: a rail of small
 * tick marks pinned to the right edge; hovering it opens a floating panel
 * with the heading hierarchy for quick navigation. The active section is
 * tracked while scrolling.
 */
export function DocumentOutline({
   items,
   scrollRef,
}: {
   items: OutlineItem[];
   scrollRef: RefObject<HTMLDivElement | null>;
}) {
   const [activeId, setActiveId] = useState<string | null>(null);

   const ids = useMemo(() => items.map((item) => item.id), [items]);

   useEffect(() => {
      const container = scrollRef.current;
      if (!container || ids.length === 0) return;

      const onScroll = () => {
         const containerTop = container.getBoundingClientRect().top;
         let current: string | null = null;
         for (const id of ids) {
            const element = container.querySelector<HTMLElement>(`#${id}`);
            if (!element) continue;
            if (element.getBoundingClientRect().top - containerTop <= 140) current = id;
         }
         setActiveId(current);
      };

      onScroll();
      container.addEventListener('scroll', onScroll, { passive: true });
      return () => container.removeEventListener('scroll', onScroll);
   }, [ids, scrollRef]);

   if (items.length < 3) return null;

   const jump = (id: string) => {
      scrollRef.current
         ?.querySelector<HTMLElement>(`#${id}`)
         ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
   };

   return (
      <div className="group absolute right-1.5 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center">
         {/* Hover panel */}
         <div className="absolute right-full mr-2 w-72 max-h-[65vh] overflow-y-auto rounded-lg border bg-container shadow-lg p-2 opacity-0 translate-x-1 pointer-events-none transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto">
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium">
               <AlignLeft className="size-4 text-muted-foreground" />
               Description
            </div>
            {items.map((item) => (
               <button
                  key={item.id}
                  onClick={() => jump(item.id)}
                  className={cn(
                     'w-full text-left px-2 py-1 rounded-md text-sm truncate transition-colors hover:bg-accent/50',
                     item.level > 1 && 'pl-6',
                     activeId === item.id
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground'
                  )}
               >
                  {item.text}
               </button>
            ))}
         </div>

         {/* Tick rail */}
         <div className="flex flex-col items-end gap-[7px] py-3 pl-3 pr-1">
            {items.map((item) => (
               <button
                  key={item.id}
                  onClick={() => jump(item.id)}
                  aria-label={item.text}
                  className={cn(
                     'h-[2px] rounded-full transition-colors',
                     item.level > 1 ? 'w-2' : 'w-3.5',
                     activeId === item.id ? 'bg-foreground' : 'bg-muted-foreground/35'
                  )}
               />
            ))}
         </div>
      </div>
   );
}
