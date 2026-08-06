'use client';

import { cn } from '@/lib/utils';
import { ContentBlock } from '@/mock-data/issue-details';
import { useIssuesStore } from '@/store/issues-store';
import { Check, ImageIcon, Play } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Fragment } from 'react';

/**
 * Lightweight inline formatting: `code` spans and **bold** runs.
 */
export function InlineText({ text }: { text: string }) {
   const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

   return (
      <>
         {parts.map((part, index) => {
            if (part.startsWith('`') && part.endsWith('`')) {
               return (
                  <code
                     key={index}
                     className="px-1 py-0.5 rounded bg-accent text-[0.85em] font-mono"
                  >
                     {part.slice(1, -1)}
                  </code>
               );
            }
            if (part.startsWith('**') && part.endsWith('**')) {
               return (
                  <strong key={index} className="font-semibold">
                     {part.slice(2, -2)}
                  </strong>
               );
            }
            return <Fragment key={index}>{part}</Fragment>;
         })}
      </>
   );
}

function ImagePlaceholder({
   alt,
   caption,
   aspect = 'wide',
}: {
   alt: string;
   caption?: string;
   aspect?: 'wide' | 'video' | 'square';
}) {
   return (
      <figure className="my-4">
         <div
            className={cn(
               'w-full rounded-lg border border-border/60 bg-gradient-to-br from-accent/60 via-accent/30 to-accent/60 flex flex-col items-center justify-center gap-2 text-muted-foreground',
               aspect === 'wide' && 'aspect-[21/9]',
               aspect === 'video' && 'aspect-video',
               aspect === 'square' && 'aspect-square max-w-sm'
            )}
         >
            <ImageIcon className="size-6 opacity-60" />
            <span className="text-xs px-6 text-center">{alt}</span>
         </div>
         {caption && (
            <figcaption className="mt-1.5 text-xs text-muted-foreground text-center">
               {caption}
            </figcaption>
         )}
      </figure>
   );
}

function VideoPlaceholder({ title, duration }: { title: string; duration?: string }) {
   return (
      <div className="my-4 w-full aspect-video rounded-lg border border-border/60 bg-zinc-950/90 dark:bg-zinc-900/80 relative flex items-center justify-center">
         <div className="size-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
            <Play className="size-5 text-white fill-white ml-0.5" />
         </div>
         <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/80">
            <span className="truncate">{title}</span>
            {duration && <span className="shrink-0 ml-2 font-mono">{duration}</span>}
         </div>
      </div>
   );
}

function IssueRef({ identifier, note }: { identifier: string; note?: string }) {
   const { orgId } = useParams<{ orgId: string }>();
   const { issues } = useIssuesStore();
   const issue = issues.find((candidate) => candidate.identifier === identifier);

   return (
      <div className="my-2 flex items-start gap-2 text-sm">
         <span className="mt-1 size-1 rounded-full bg-muted-foreground shrink-0" />
         <div className="min-w-0">
            <Link
               href={`/${orgId ?? 'lndev-ui'}/issue/${identifier}`}
               className="inline-flex items-center gap-1.5 bg-accent/60 rounded px-1.5 py-0.5 hover:bg-accent"
            >
               {issue && <issue.status.icon />}
               <span className="text-muted-foreground font-medium">{identifier}</span>
               {issue && <span className="truncate max-w-72">{issue.title}</span>}
            </Link>
            {note && <span className="text-muted-foreground"> — {note}</span>}
         </div>
      </div>
   );
}

/**
 * Renders a list of structured description blocks (paragraphs, lists,
 * checklists, code, media placeholders, quotes, issue references…).
 */
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
   return (
      <div className="text-[15px] leading-7">
         {blocks.map((block, index) => {
            switch (block.type) {
               case 'heading':
                  return block.level === 2 ? (
                     <h3
                        key={index}
                        id={`doc-h-${index}`}
                        className="text-base font-semibold mt-5 mb-1.5 scroll-mt-24"
                     >
                        {block.text}
                     </h3>
                  ) : (
                     <h2
                        key={index}
                        id={`doc-h-${index}`}
                        className="text-lg font-semibold mt-6 mb-2 first:mt-0 scroll-mt-24"
                     >
                        {block.text}
                     </h2>
                  );
               case 'paragraph':
                  return (
                     <p key={index} className="my-3 text-foreground/90">
                        <InlineText text={block.text} />
                     </p>
                  );
               case 'bullet-list':
                  return (
                     <ul key={index} className="my-3 list-disc pl-6 space-y-1.5">
                        {block.items.map((item, itemIndex) => (
                           <li key={itemIndex}>
                              <InlineText text={item} />
                           </li>
                        ))}
                     </ul>
                  );
               case 'numbered-list':
                  return (
                     <ol key={index} className="my-3 list-decimal pl-6 space-y-1.5">
                        {block.items.map((item, itemIndex) => (
                           <li key={itemIndex}>
                              <InlineText text={item} />
                           </li>
                        ))}
                     </ol>
                  );
               case 'checklist':
                  return (
                     <div key={index} className="my-3 space-y-1.5">
                        {block.items.map((item, itemIndex) => (
                           <div key={itemIndex} className="flex items-start gap-2.5">
                              <span
                                 className={cn(
                                    'mt-1 size-4 rounded border flex items-center justify-center shrink-0',
                                    item.checked
                                       ? 'bg-indigo-500 border-indigo-500'
                                       : 'border-muted-foreground/40'
                                 )}
                              >
                                 {item.checked && <Check className="size-3 text-white" />}
                              </span>
                              <span
                                 className={cn(
                                    item.checked && 'line-through text-muted-foreground'
                                 )}
                              >
                                 <InlineText text={item.text} />
                              </span>
                           </div>
                        ))}
                     </div>
                  );
               case 'code':
                  return (
                     <pre
                        key={index}
                        className="my-4 rounded-lg border border-border/60 bg-accent/40 p-4 overflow-x-auto text-[13px] leading-6 font-mono"
                     >
                        <code>{block.code}</code>
                     </pre>
                  );
               case 'image':
                  return (
                     <ImagePlaceholder
                        key={index}
                        alt={block.alt}
                        caption={block.caption}
                        aspect={block.aspect}
                     />
                  );
               case 'video':
                  return (
                     <VideoPlaceholder key={index} title={block.title} duration={block.duration} />
                  );
               case 'quote':
                  return (
                     <blockquote
                        key={index}
                        className="my-4 border-l-2 border-indigo-400/60 pl-4 text-muted-foreground italic"
                     >
                        <InlineText text={block.text} />
                        {block.author && (
                           <span className="block not-italic text-xs mt-1">— {block.author}</span>
                        )}
                     </blockquote>
                  );
               case 'divider':
                  return <hr key={index} className="my-6 border-border/60" />;
               case 'issue-ref':
                  return <IssueRef key={index} identifier={block.identifier} note={block.note} />;
               default:
                  return null;
            }
         })}
      </div>
   );
}

export type { ContentBlock };
export { ImagePlaceholder, VideoPlaceholder };

/** Small helper used by lists of referenced issues in the side panel. */
export function IssueRefRow({ identifier }: { identifier: string }) {
   const { orgId } = useParams<{ orgId: string }>();
   const { issues } = useIssuesStore();
   const issue = issues.find((candidate) => candidate.identifier === identifier);
   if (!issue) return null;

   return (
      <Link
         href={`/${orgId ?? 'lndev-ui'}/issue/${identifier}`}
         className="flex items-center gap-2 py-1 text-sm hover:bg-sidebar/50 rounded px-1.5 -mx-1.5 min-w-0"
      >
         <issue.status.icon />
         <span className="truncate">{issue.title}</span>
      </Link>
   );
}
