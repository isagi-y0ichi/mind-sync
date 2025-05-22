import { create } from 'zustand';
import type { ChatMessage, ChatState } from '@/types/chat';
import { sendChat } from '@/lib/api';

const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  error: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  sendMessage: async (text) => {
    const { messages, addMessage } = get();
    
    // Add user message
    const userMessage: ChatMessage = {
      sender: 'user',
      message: text,
      timestamp: 0
    };
    
    addMessage(userMessage);
    set({ loading: true, error: null });

    try {
      // Send to API and get AI response
      const response = await sendChat([...messages, userMessage]);
      
      // Add AI response
      const aiMessage: ChatMessage = {
        sender: 'ai',
        message: response.reply || "I'm here to listen. How are you feeling today?",
        timestamp: 0
      };
      
      addMessage(aiMessage);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      set({ 
        error: 'Failed to get response. Please try again.',
      });
      
      // Add error message
      addMessage({
        sender: 'ai',
        message: "I'm having trouble connecting. Please try again in a moment.",
        timestamp: 0
      });
    } finally {
      set({ loading: false });
    }
  },

  reset: () => set({ messages: [], loading: false, error: null }),
}));

export default useChatStore;
