'use client';

import { InlineText } from '@/components/common/issues/details/content-blocks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { agentExamples, agentSkills } from '@/mock-data/agent';
import { users } from '@/mock-data/users';
import { useAgentChatStore } from '@/store/agent-chat-store';
import { ArrowUp, Blocks, Bot, ChevronDown, Paperclip, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/** Streams the canned reply into the assistant message, word by word. */
function useStreamReply() {
   const { appendToMessage, finishMessage } = useAgentChatStore();
   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

   useEffect(() => {
      return () => {
         if (intervalRef.current) clearInterval(intervalRef.current);
      };
   }, []);

   return (chatId: string, messageId: string, reply: string) => {
      const words = reply.split(/(\s+)/);
      let index = 0;
      intervalRef.current = setInterval(() => {
         if (index >= words.length) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            finishMessage(chatId, messageId);
            return;
         }
         appendToMessage(chatId, messageId, words[index]);
         index += 1;
      }, 14);
   };
}

function AgentMessageBody({ content, streaming }: { content: string; streaming?: boolean }) {
   const lines = content.split('\n');
   return (
      <div className="text-sm leading-relaxed flex flex-col gap-1">
         {lines.map((line, index) => {
            const trimmed = line.trim();
            if (trimmed === '') return <span key={index} className="h-1.5" />;
            if (trimmed.startsWith('- ')) {
               return (
                  <span key={index} className="flex gap-2">
                     <span className="text-muted-foreground mt-[7px] size-1 rounded-full bg-muted-foreground shrink-0" />
                     <span>
                        <InlineText text={trimmed.slice(2)} />
                     </span>
                  </span>
               );
            }
            const numbered = trimmed.match(/^(\d+)\.\s+(.*)$/);
            if (numbered) {
               return (
                  <span key={index} className="flex gap-2">
                     <span className="text-muted-foreground tabular-nums">{numbered[1]}.</span>
                     <span>
                        <InlineText text={numbered[2]} />
                     </span>
                  </span>
               );
            }
            return (
               <span key={index}>
                  <InlineText text={trimmed} />
               </span>
            );
         })}
         {streaming && <span className="inline-block w-2 h-4 bg-foreground/60 animate-pulse" />}
      </div>
   );
}

function ChatComposer({
   onSend,
   autoFocus,
   large,
}: {
   onSend: (input: string) => void;
   autoFocus?: boolean;
   large?: boolean;
}) {
   const [value, setValue] = useState('');

   const submit = () => {
      if (value.trim() === '') return;
      onSend(value.trim());
      setValue('');
   };

   return (
      <div className="w-full border rounded-xl bg-container shadow-xs">
         <textarea
            value={value}
            autoFocus={autoFocus}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
               if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  submit();
               }
            }}
            placeholder="Ask the agent…"
            className={cn(
               'w-full resize-none bg-transparent px-4 pt-3.5 text-sm outline-none placeholder:text-muted-foreground',
               large ? 'min-h-16' : 'min-h-12'
            )}
         />
         <div className="flex items-center justify-between px-2.5 pb-2.5">
            <DropdownMenu>
               <DropdownMenuTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-1.5 py-1 rounded-md outline-none transition-colors">
                  <Blocks className="size-3.5" />
                  Skills
                  <ChevronDown className="size-3" />
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start" className="w-48">
                  {agentSkills.map((skill) => (
                     <DropdownMenuItem key={skill}>{skill}</DropdownMenuItem>
                  ))}
               </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-1">
               <Button variant="ghost" size="icon" className="size-7 text-muted-foreground">
                  <Paperclip className="size-4" />
               </Button>
               <Button
                  size="icon"
                  className="size-7 rounded-full"
                  onClick={submit}
                  disabled={value.trim() === ''}
                  aria-label="Send"
               >
                  <ArrowUp className="size-4" />
               </Button>
            </div>
         </div>
      </div>
   );
}

/**
 * Functional mock of the Linear Agent page: ask anything, get a canned
 * (deterministic) reply streamed word by word. Conversations live in a
 * client store and can be revisited from the header dropdown.
 */
export default function AgentChat() {
   const { chats, activeChatId, sendMessage } = useAgentChatStore();
   const stream = useStreamReply();
   const [bannerDismissed, setBannerDismissed] = useState(false);
   const [examplesDismissed, setExamplesDismissed] = useState(false);
   const scrollRef = useRef<HTMLDivElement>(null);

   const activeChat = chats.find((chat) => chat.id === activeChatId);

   useEffect(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
   }, [activeChat?.messages]);

   const handleSend = (input: string) => {
      const { chatId, assistantMessageId, reply } = sendMessage(input);
      stream(chatId, assistantMessageId, reply);
   };

   /* ------------------------------- Hero ------------------------------- */
   if (!activeChat) {
      return (
         <div className="w-full h-full flex flex-col items-center overflow-y-auto">
            {!bannerDismissed && (
               <div className="mt-4 flex items-center gap-3 rounded-full border bg-container shadow-xs px-4 py-1.5 text-sm">
                  <span>Agent is now your default view</span>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                     Change
                  </button>
                  <button
                     onClick={() => setBannerDismissed(true)}
                     className="font-medium rounded-full border px-2.5 py-0.5 hover:bg-accent transition-colors"
                  >
                     Keep
                  </button>
               </div>
            )}

            <div className="flex-1 w-full max-w-2xl px-6 flex flex-col justify-center pb-24">
               <div className="flex justify-center mb-8 text-muted-foreground/30">
                  <Bot className="size-24" strokeWidth={1} />
               </div>
               <ChatComposer onSend={handleSend} autoFocus large />

               {!examplesDismissed && (
                  <div className="mt-6">
                     <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">
                           Get started with some examples
                        </span>
                        <button
                           onClick={() => setExamplesDismissed(true)}
                           className="text-muted-foreground hover:text-foreground transition-colors"
                           aria-label="Dismiss examples"
                        >
                           <X className="size-4" />
                        </button>
                     </div>
                     <div className="grid sm:grid-cols-3 gap-3">
                        {agentExamples.map((example) => (
                           <button
                              key={example.id}
                              type="button"
                              onClick={() => handleSend(example.prompt)}
                              className="border rounded-lg p-4 text-left hover:bg-accent/40 transition-colors"
                           >
                              <example.icon className="size-4 text-muted-foreground" />
                              <p className="mt-6 text-sm font-medium">{example.title}</p>
                              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                 {example.description}
                              </p>
                           </button>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </div>
      );
   }

   /* --------------------------- Conversation --------------------------- */
   return (
      <div className="w-full h-full flex flex-col overflow-hidden">
         <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
               {activeChat.messages.map((message) =>
                  message.role === 'user' ? (
                     <div key={message.id} className="flex justify-end">
                        <div className="flex items-start gap-2.5 max-w-[85%]">
                           <div className="rounded-2xl rounded-tr-sm bg-accent px-4 py-2.5 text-sm">
                              {message.content}
                           </div>
                           <Avatar className="size-6 mt-1 shrink-0">
                              <AvatarImage src={users[0].avatarUrl} alt={users[0].name} />
                              <AvatarFallback>{users[0].name[0]}</AvatarFallback>
                           </Avatar>
                        </div>
                     </div>
                  ) : (
                     <div key={message.id} className="flex items-start gap-2.5">
                        <span className="mt-1 inline-flex size-6 items-center justify-center rounded-full border bg-container shrink-0">
                           <Bot className="size-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                           <AgentMessageBody
                              content={message.content}
                              streaming={message.streaming}
                           />
                        </div>
                     </div>
                  )
               )}
            </div>
         </div>
         <div className="shrink-0 border-t bg-container">
            <div className="max-w-2xl mx-auto px-6 py-4">
               <ChatComposer onSend={handleSend} />
            </div>
         </div>
      </div>
   );
}
