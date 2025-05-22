import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  isTyping?: boolean;
}

export function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  // Animation variants for message bubbles
  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.15 } 
    }
  };

  // Animation for typing indicator
  const typingVariants = {
    start: { 
      y: '0%',
    },
    end: { 
      y: '-15%',
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={messageVariants}
      className={cn(
        'flex gap-3 px-4 py-2 group',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1',
          'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
        )}>
          <Bot className="w-4 h-4" strokeWidth={2.5} />
        </div>
      )}
      
      <div className={cn(
        'max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-2.5',
        isUser 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none',
        isTyping && 'bg-gray-100 dark:bg-gray-700'
      )}>
        {isTyping ? (
          <div className="flex space-x-1.5 py-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gray-400 rounded-full"
                variants={typingVariants}
                initial="start"
                animate="end"
                transition={{
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 0.5,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {message.message}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1',
          'bg-blue-500 text-white'
        )}>
          <User className="w-4 h-4" strokeWidth={2.5} />
        </div>
      )}
    </motion.div>
  );
}
