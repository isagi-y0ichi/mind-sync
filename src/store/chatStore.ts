import { create } from 'zustand';
import type { ChatMessage, ChatState, BaseChatMessage } from '@/types/chat';
import { 
  generateChatCompletion, 
  startDepressionAssessment, 
  continueDepressionAssessment, 
  completeDepressionAssessment,
  type DummyChatMessage
} from '@/lib/dummyClient';

// Helper to convert between our message types and dummy message types
const toDummyMessage = (msg: BaseChatMessage): DummyChatMessage => ({
  role: msg.sender === 'user' ? 'user' : 'assistant',
  content: msg.message
});

const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  isTyping: false,
  error: null,

  addMessage: (message: BaseChatMessage) =>
    set((state) => {
      const newMessage: ChatMessage = {
        id: message.id || Date.now().toString(),
        sender: message.sender,
        message: message.message,
        timestamp: message.timestamp || Date.now(),
        status: message.status || 'sent'
      };
      
      return {
        messages: [...state.messages, newMessage]
      };
    }),

  startDepressionAssessment: async (initialMessage: string): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      // Add user's initial message
      get().addMessage({
        sender: 'user',
        message: initialMessage,
        status: 'sent'
      });

      // Start assessment
      const response = await startDepressionAssessment(initialMessage);
      
      // Add AI's response
      get().addMessage({
        sender: 'ai',
        message: response,
        status: 'sent'
      });
      
      return true;
    } catch (error) {
      console.error('Error starting assessment:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to start assessment',
        loading: false 
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  
  continueDepressionAssessment: async (userReply: string) => {
    set({ loading: true, error: null });
    
    try {
      // Add user's reply
      get().addMessage({
        sender: 'user',
        message: userReply,
        status: 'sent'
      });

      // Convert messages to dummy format
      const conversation = get().messages.map(msg => toDummyMessage(msg));
      
      // Continue assessment
      const response = await continueDepressionAssessment(conversation);
      
      // Check if assessment is complete (contains JSON)
      if (response.includes('{') && response.includes('}')) {
        const result = await completeDepressionAssessment(conversation);
        
        // Add AI's final response with scores
        get().addMessage({
          sender: 'ai',
          message: `Assessment complete. Here are your scores:\nPHQ-9: ${result.scores['PHQ-9']} (out of 27)\nBDI-II: ${result.scores['BDI-II']} (out of 63)\nHamilton: ${result.scores['Hamilton']} (out of 52)\n\n${result.verdict}`,
          status: 'sent'
        });
      } else {
        // Add AI's response
        get().addMessage({
          sender: 'ai',
          message: response,
          status: 'sent'
        });
        
        // Add user message
        const userMessage: BaseChatMessage = {
          id: Date.now().toString(),
          sender: 'user',
          message: userReply,
          timestamp: Date.now(),
          status: 'sent'
        };
        get().addMessage(userMessage);
      }
      
      return { completed: false };
      
    } catch (error) {
      console.error('Error continuing depression assessment:', error);
      
      // Update user message status to error
      const lastMessage = get().messages[get().messages.length - 1];
      if (lastMessage) {
        get().addMessage({
          ...lastMessage,
          status: 'error'
        });
      }
      
      // Add error message
      get().addMessage({
        sender: 'ai',
        message: "I'm having trouble continuing the assessment. Please try again.",
        status: 'error'
      });
      
      return { completed: false, error: true };
    } finally {
      set({ loading: false, isTyping: false });
    }
  },
  
  sendMessage: async (text: string) => {
    const { messages, addMessage } = get();
    
    // Add user message
    const userMessage: BaseChatMessage = {
      sender: 'user',
      message: text,
      status: 'sending'
    };
    
    addMessage(userMessage);
    
    try {
      // Convert messages to format expected by Groq
      const chatHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.message
      }));
      
      // Add the system message
      const systemMessage = {
        role: 'system' as const,
        content: 'You are a helpful and compassionate mental health assistant.'
      };
      
      // Get AI response
      const response = await generateChatCompletion([systemMessage, ...chatHistory]);
      
      // Add AI response to messages
      addMessage({
        sender: 'ai',
        message: response,
        status: 'sent'
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update user message status to error
      addMessage({
        ...userMessage,
        status: 'error'
      });
      
      // Add error message
      addMessage({
        sender: 'ai',
        message: "I'm having trouble responding. Please try again in a moment.",
        status: 'error'
      });
    } finally {
      set({ loading: false, isTyping: false });
    }
  },

  reset: () => set({ messages: [], loading: false, error: null, isTyping: false }),
}));

export default useChatStore;
