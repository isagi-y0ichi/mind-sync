import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, HeartPulse } from 'lucide-react';
import { ChatWindow } from '@/components/ChatWindow';
import { Button } from '@/components/ui/button';
import useChatStore from '@/store/chatStore';

type AssessmentState = 'idle' | 'in-progress' | 'completed'; // Add more states as needed

export function Chat() {
  const { 
    messages, 
    loading, 
    sendMessage, 
    reset, 
    startDepressionAssessment, 
    continueDepressionAssessment 
  } = useChatStore();
  const [assessmentState, setAssessmentState] = useState<AssessmentState>('idle');
  const navigate = useNavigate();

  // Reset chat when component unmounts
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    if (assessmentState === 'in-progress') {
      // Continue the assessment
      const { completed } = await continueDepressionAssessment(text);
      if (completed) {
        setAssessmentState('completed');
      }
    } else if (assessmentState === 'idle' && messages.length === 0) {
      // Start a regular chat
      await sendMessage(text);
    } else {
      // Continue regular chat
      await sendMessage(text);
    }
  };
  
  const handleStartAssessment = async () => {
    setAssessmentState('in-progress');
    await startDepressionAssessment(
      "I'd like to start a mental health assessment. Please ask me your first question."
    );
  };
  
  const resetAssessment = () => {
    reset();
    setAssessmentState('idle');
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
          <h1 className="text-xl font-semibold text-gray-900">
            {assessmentState === 'in-progress' ? 'Depression Assessment' : 'MindSync Chat'}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {messages.length === 0 && assessmentState === 'idle' ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <HeartPulse className="h-16 w-16 text-blue-500 mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to MindSync</h2>
              <p className="text-gray-600 mb-8 max-w-md">
                Start a conversation or take a mental health assessment to better understand your well-being.
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={handleStartAssessment}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Start Assessment
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => sendMessage("Hi, I'd like to chat.")}
                >
                  Just Chat
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ChatWindow
                messages={messages}
                loading={loading}
                onSendMessage={handleSendMessage}
                className="h-[calc(100vh-200px)]"
              />
              {assessmentState === 'in-progress' && (
                <div className="p-4 border-t bg-blue-50">
                  <p className="text-sm text-blue-700 text-center">
                    You're currently in a depression assessment. Answer the questions as honestly as you can.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>MindSync is here to listen and support you. Your conversations are private and secure.</p>
          {messages.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-blue-600 hover:text-blue-800"
              onClick={resetAssessment}
              disabled={loading}
            >
              Start a new conversation
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
