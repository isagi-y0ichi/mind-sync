import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatWindowProps {
  messages: ChatMessageType[];
  loading: boolean;
  onSendMessage: (message: string) => void;
  className?: string;
}

export function ChatWindow({
  messages,
  loading,
  onSendMessage,
  className,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    scrollToBottom('auto');
  }, [scrollToBottom]);

  useEffect(() => {
    if (loading) {
      scrollToBottom();
    }
  }, [loading, scrollToBottom]);

  // Handle initial scroll to bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom('auto');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [scrollToBottom]);

  return (
    <div className={cn('flex flex-col h-[calc(100vh-64px)] bg-white dark:bg-gray-900', className)}>
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto pb-4"
      >
        <div className="max-w-3xl mx-auto w-full px-4 py-2 space-y-1">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-600 dark:text-gray-400">
              <div className="text-center p-8 max-w-md">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
                  <svg
                    className="h-8 w-8 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Welcome to MindSync</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Share your thoughts and feelings. I'm here to listen and support you.
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <ChatMessage 
                  key={`${message.id || index}-${message.timestamp}`} 
                  message={message} 
                />
              ))}
            </AnimatePresence>
          )}
          
          {loading && (
            <ChatMessage 
              message={{
                id: 'typing',
                sender: 'ai',
                message: '',
                timestamp: Date.now(),
                status: 'sending'
              }}
              isTyping={true}
            />
          )}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSend={onSendMessage}
            disabled={loading}
            placeholder="How are you feeling today?"
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-shadow"
          />
        </div>
      </div>
    </div>
  );
}

// Utility function to merge class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
