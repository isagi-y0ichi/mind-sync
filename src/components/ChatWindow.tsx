import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Loader2 } from 'lucide-react';
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={cn('flex flex-col min-h-[80vh] max-h-[90vh] bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-600">
            <div className="text-center p-8 max-w-md">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-6">
                <svg
                  className="h-8 w-8 text-blue-600"
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Welcome to MindSync</h3>
              <p className="text-gray-600">
                Share your thoughts and feelings. I'm here to listen and support you.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={`${message.timestamp}-${index}`} message={message} />
          ))
        )}
        {loading && (
          <div className="flex items-center justify-start p-4">
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-100 p-4">
        <ChatInput
          onSend={onSendMessage}
          disabled={loading}
          placeholder="How are you feeling today?"
          className="border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
        />
      </div>
    </div>
  );
}

// Utility function to merge class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
