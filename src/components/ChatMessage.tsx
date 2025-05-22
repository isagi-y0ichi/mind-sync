import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={cn(
      'flex gap-4 p-4 group',
      isUser ? 'bg-white' : 'bg-gray-50'
    )}>
      <div className={cn(
        'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center',
        isUser ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-600'
      )}>
        {isUser ? (
          <User className="w-4 h-4" strokeWidth={2} />
        ) : (
          <Bot className="w-4 h-4" strokeWidth={2} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-700 mb-1">
          {isUser ? 'You' : 'MindSync AI'}
        </div>
        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {message.message}
        </div>
      </div>
    </div>
  );
}
