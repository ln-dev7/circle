'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ActivityItem } from '@/mock-data/issue-details';
import { users } from '@/mock-data/users';
import {
   Ban,
   CircleDot,
   GitPullRequestArrow,
   Link2,
   PenLine,
   Plus,
   RefreshCcw,
   SmilePlus,
   Tag,
   Unlock,
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import { ContentBlocks } from './content-blocks';

const EVENT_ICONS: Record<string, ReactNode> = {
   created: <PenLine className="size-3.5" />,
   status: <CircleDot className="size-3.5" />,
   label: <Tag className="size-3.5" />,
   priority: <CircleDot className="size-3.5" />,
   cycle: <RefreshCcw className="size-3.5" />,
   blocked: <Ban className="size-3.5" />,
   unblocked: <Unlock className="size-3.5" />,
   related: <Link2 className="size-3.5" />,
   pr: <GitPullRequestArrow className="size-3.5" />,
};

function EventRow({ item }: { item: Extract<ActivityItem, { kind: 'event' }> }) {
   return (
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground py-1.5">
         <span className="size-5 rounded-full bg-accent flex items-center justify-center shrink-0">
            {EVENT_ICONS[item.event] ?? <CircleDot className="size-3.5" />}
         </span>
         <span className="min-w-0 truncate">
            <span className="text-foreground/90 font-medium">{item.actor.name}</span> {item.text}
         </span>
         <span className="shrink-0 text-xs">· {item.timeAgo}</span>
      </div>
   );
}

function CommentCard({ item }: { item: Extract<ActivityItem, { kind: 'comment' }> }) {
   return (
      <div className="my-2 rounded-lg border border-border/60 bg-container p-3.5">
         <div className="flex items-center gap-2 mb-1.5">
            <Avatar className="size-5">
               <AvatarImage src={item.actor.avatarUrl} alt={item.actor.name} />
               <AvatarFallback>{item.actor.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{item.actor.name}</span>
            <span className="text-xs text-muted-foreground">{item.timeAgo}</span>
         </div>
         <div className="text-sm [&_p]:my-1.5">
            <ContentBlocks blocks={item.body} />
         </div>
         <div className="flex items-center gap-1.5 mt-1">
            {item.reactions?.map((reaction) => (
               <span
                  key={reaction.emoji}
                  className="inline-flex items-center gap-1 text-xs bg-accent/60 border border-border/60 rounded-full px-2 py-0.5"
               >
                  {reaction.emoji} {reaction.count}
               </span>
            ))}
            <button className="text-muted-foreground hover:text-foreground">
               <SmilePlus className="size-3.5" />
            </button>
         </div>
      </div>
   );
}

/**
 * Issue activity: interleaved events and comments, plus a local
 * comment composer (comments are kept in memory only).
 */
export function ActivityFeed({ activity }: { activity: ActivityItem[] }) {
   const [items, setItems] = useState<ActivityItem[]>(activity);
   const [draft, setDraft] = useState('');
   const currentUser = users[0];

   const submitComment = () => {
      const text = draft.trim();
      if (!text) return;
      setItems((previous) => [
         ...previous,
         {
            kind: 'comment',
            id: `local-${previous.length}`,
            actor: currentUser,
            timeAgo: 'just now',
            body: [{ type: 'paragraph', text }],
         },
      ]);
      setDraft('');
   };

   return (
      <div className="mt-10">
         <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold">Activity</h2>
            <button className="text-xs text-muted-foreground hover:text-foreground">
               Subscribe
            </button>
         </div>

         <div className="flex flex-col">
            {items.map((item) =>
               item.kind === 'event' ? (
                  <EventRow key={item.id} item={item} />
               ) : (
                  <CommentCard key={item.id} item={item} />
               )
            )}
         </div>

         {/* Composer */}
         <div className="mt-3 rounded-lg border border-border/60 bg-container p-3 flex flex-col gap-2">
            <textarea
               value={draft}
               onChange={(event) => setDraft(event.target.value)}
               onKeyDown={(event) => {
                  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                     submitComment();
                  }
               }}
               placeholder="Leave a comment..."
               rows={2}
               className="w-full resize-none bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            <div className="flex items-center justify-between">
               <Plus className="size-4 text-muted-foreground" />
               <Button size="xs" onClick={submitComment} disabled={!draft.trim()}>
                  Comment
               </Button>
            </div>
         </div>
      </div>
   );
}
