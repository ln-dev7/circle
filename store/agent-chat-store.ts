import { create } from 'zustand';
import { chatTitleFrom, getAgentReply } from '@/mock-data/agent';

export interface AgentMessage {
   id: string;
   role: 'user' | 'assistant';
   content: string;
   /** True while the assistant reply is still being "typed". */
   streaming?: boolean;
}

export interface AgentChat {
   id: string;
   title: string;
   messages: AgentMessage[];
}

interface AgentChatState {
   chats: AgentChat[];
   activeChatId: string | null;
   setActiveChat: (chatId: string | null) => void;
   startNewChat: () => void;
   /** Sends a user message; returns the ids needed to stream the reply. */
   sendMessage: (input: string) => { chatId: string; assistantMessageId: string; reply: string };
   appendToMessage: (chatId: string, messageId: string, chunk: string) => void;
   finishMessage: (chatId: string, messageId: string) => void;
}

let nextId = 1;
const uid = (prefix: string) => `${prefix}-${nextId++}`;

/**
 * Fully client-side mock of the Linear Agent chat: conversations live in
 * memory, replies come from deterministic canned answers (mock-data/agent)
 * and are streamed word by word by the page component.
 */
export const useAgentChatStore = create<AgentChatState>((set, get) => ({
   chats: [],
   activeChatId: null,

   setActiveChat: (chatId) => set({ activeChatId: chatId }),

   startNewChat: () => set({ activeChatId: null }),

   sendMessage: (input) => {
      const state = get();
      const reply = getAgentReply(input);
      const assistantMessageId = uid('msg');
      const userMessage: AgentMessage = { id: uid('msg'), role: 'user', content: input };
      const assistantMessage: AgentMessage = {
         id: assistantMessageId,
         role: 'assistant',
         content: '',
         streaming: true,
      };

      const active = state.chats.find((chat) => chat.id === state.activeChatId);
      if (active) {
         set({
            chats: state.chats.map((chat) =>
               chat.id === active.id
                  ? { ...chat, messages: [...chat.messages, userMessage, assistantMessage] }
                  : chat
            ),
         });
         return { chatId: active.id, assistantMessageId, reply };
      }

      const chat: AgentChat = {
         id: uid('chat'),
         title: chatTitleFrom(input),
         messages: [userMessage, assistantMessage],
      };
      set({ chats: [chat, ...state.chats], activeChatId: chat.id });
      return { chatId: chat.id, assistantMessageId, reply };
   },

   appendToMessage: (chatId, messageId, chunk) =>
      set((state) => ({
         chats: state.chats.map((chat) =>
            chat.id === chatId
               ? {
                    ...chat,
                    messages: chat.messages.map((message) =>
                       message.id === messageId
                          ? { ...message, content: message.content + chunk }
                          : message
                    ),
                 }
               : chat
         ),
      })),

   finishMessage: (chatId, messageId) =>
      set((state) => ({
         chats: state.chats.map((chat) =>
            chat.id === chatId
               ? {
                    ...chat,
                    messages: chat.messages.map((message) =>
                       message.id === messageId ? { ...message, streaming: false } : message
                    ),
                 }
               : chat
         ),
      })),
}));
