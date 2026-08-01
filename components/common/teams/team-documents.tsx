'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { documentFolders } from '@/mock-data/documents';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { ChevronRight, Pin, Plus, SlidersHorizontal } from 'lucide-react';

const timeAgo = (date: string) =>
   formatDistanceToNowStrict(parseISO(date), { addSuffix: true })
      .replace(' minutes', 'min')
      .replace(' hours', 'h')
      .replace(' days', 'd')
      .replace(' weeks', 'w')
      .replace(' months', 'mo')
      .replace(' years', 'y');

/**
 * Team Home — "Documents" tab: documents grouped in collapsible folders
 * with created / last edited metadata.
 */
export default function TeamDocuments() {
   return (
      <div className="w-full">
         <div className="flex items-center justify-between px-6 py-3 gap-2">
            <div className="grid grid-cols-[1fr_40px] md:grid-cols-[1fr_90px_90px_40px] w-full items-center text-sm text-muted-foreground">
               <span className="flex items-center gap-1 font-medium">Name ↓</span>
               <span className="hidden md:block">Created</span>
               <span className="hidden md:block">Last edited</span>
               <span />
            </div>
            <div className="flex items-center gap-2 shrink-0">
               <Button size="xs" variant="secondary">
                  <Plus className="size-4 md:mr-1" />
                  <span className="hidden md:inline">New document</span>
               </Button>
               <Button size="xs" variant="ghost">
                  <SlidersHorizontal className="size-4" />
               </Button>
            </div>
         </div>

         {documentFolders.map((folder) => (
            <Collapsible key={folder.id} defaultOpen={folder.documents.some((d) => d.pinned)}>
               <CollapsibleTrigger asChild>
                  <button className="group w-full flex items-center gap-2 px-6 h-10 bg-sidebar/30 hover:bg-sidebar/60 border-b border-border/50 text-sm">
                     <ChevronRight className="size-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
                     <span className="text-base leading-none">{folder.icon}</span>
                     <span className="font-medium">{folder.name}</span>
                     <span className="text-muted-foreground">{folder.documents.length}</span>
                  </button>
               </CollapsibleTrigger>
               <CollapsibleContent>
                  {folder.documents.map((doc) => (
                     <div
                        key={doc.id}
                        className="grid grid-cols-[1fr_40px] md:grid-cols-[1fr_90px_90px_40px] items-center px-6 h-11 hover:bg-sidebar/50 border-b border-border/30 text-sm"
                     >
                        <div className="flex items-center gap-2 min-w-0 pl-6">
                           <span className="text-base leading-none">{doc.icon}</span>
                           <span className="font-medium truncate">{doc.name}</span>
                           {doc.pinned && <Pin className="size-3 text-muted-foreground shrink-0" />}
                        </div>
                        <span className="hidden md:block text-xs text-muted-foreground">
                           {timeAgo(doc.createdAt)}
                        </span>
                        <span className="hidden md:block text-xs text-muted-foreground">
                           {timeAgo(doc.updatedAt)}
                        </span>
                        <Avatar className="size-5">
                           <AvatarImage src={doc.creator.avatarUrl} alt={doc.creator.name} />
                           <AvatarFallback>{doc.creator.name[0]}</AvatarFallback>
                        </Avatar>
                     </div>
                  ))}
               </CollapsibleContent>
            </Collapsible>
         ))}
      </div>
   );
}
