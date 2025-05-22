export type MessageStatus = 'sending' | 'sent' | 'error';

export type MessageSender = 'user' | 'ai' | 'system';

export interface BaseChatMessage {
  id?: string;
  sender: MessageSender;
  message: string;
  timestamp?: number;
  status?: MessageStatus;
}

export interface ChatMessage extends Required<BaseChatMessage> {}

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatRequest {
  role: ChatRole;
  content: string;
}

export interface AssessmentScores {
  'PHQ-9': number;
  'BDI-II': number;
  'Hamilton': number;
}

export interface ChatState {
  // State
  messages: ChatMessage[];
  loading: boolean;
  isTyping: boolean;
  error: string | null;
  
  // Basic Chat Actions
  addMessage: (message: BaseChatMessage) => void;
  sendMessage: (text: string) => Promise<void>;
  reset: () => void;
  
  // Assessment Actions
  startDepressionAssessment: (initialMessage: string) => Promise<boolean>;
  continueDepressionAssessment: (userReply: string) => Promise<{
    completed: boolean;
    scores?: Partial<AssessmentScores>;
    error?: boolean;
  }>;
}
