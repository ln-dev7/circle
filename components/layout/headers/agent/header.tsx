'use client';

import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAgentChatStore } from '@/store/agent-chat-store';
import { ChevronDown, MessageSquare, Plus } from 'lucide-react';

export default function Header() {
   const { chats, activeChatId, setActiveChat, startNewChat } = useAgentChatStore();
   const activeChat = chats.find((chat) => chat.id === activeChatId);

   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <div className="flex items-center gap-2 min-w-0">
            <SidebarTrigger className="" />
            <DropdownMenu>
               <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium outline-none hover:text-foreground min-w-0">
                  <span className="truncate max-w-64">{activeChat?.title ?? 'New chat'}</span>
                  <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuItem onClick={startNewChat}>
                     <Plus className="size-4" />
                     New chat
                  </DropdownMenuItem>
                  {chats.length > 0 && <DropdownMenuSeparator />}
                  {chats.map((chat) => (
                     <DropdownMenuItem key={chat.id} onClick={() => setActiveChat(chat.id)}>
                        <MessageSquare className="size-4" />
                        <span className="truncate">{chat.title}</span>
                     </DropdownMenuItem>
                  ))}
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
         <Button size="xs" variant="ghost" onClick={startNewChat} aria-label="Start a new chat">
            <Plus className="size-4" />
         </Button>
      </div>
   );
}
