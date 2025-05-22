import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ChatWindow } from '@/components/ChatWindow';
import useChatStore from '@/store/chatStore';

export default function Chat() {
  const { messages, loading, sendMessage, reset } = useChatStore();
  const navigate = useNavigate();

  // Reset chat when component unmounts
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    await sendMessage(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-full text-gray-500 hover:bg-gray-100"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">MindSync Chat</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ChatWindow
            messages={messages}
            loading={loading}
            onSendMessage={handleSendMessage}
            className="h-[calc(100vh-200px)]"
          />
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>MindSync is here to listen and support you. Your conversations are private and secure.</p>
        </div>
      </main>
    </div>
  );
}
