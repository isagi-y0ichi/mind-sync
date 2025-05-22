type ChatRole = 'user' | 'assistant' | 'system';

interface DummyChatMessage {
  role: ChatRole;
  content: string;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dummy implementation of the chat completion
const generateChatCompletion = async (messages: DummyChatMessage[]): Promise<string> => {
  // Simulate API call delay
  await delay(800);
  
  // Simple echo response for now
  const lastMessage = messages[messages.length - 1].content;
  return `I received your message: "${lastMessage}"`;
};

// Dummy implementation for starting depression assessment
const startDepressionAssessment = async (_initialMessage: string): Promise<string> => {
  await delay(800);
  return "Hello! I'm here to help assess how you've been feeling. Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?";
};

// Dummy implementation for continuing depression assessment
const continueDepressionAssessment = async (conversation: DummyChatMessage[]): Promise<string> => {
  await delay(800);
  
  // Simple conversation flow
  const lastMessage = conversation[conversation.length - 1].content.toLowerCase();
  
  if (lastMessage.includes('yes') || lastMessage.includes('yeah') || lastMessage.includes('sure')) {
    return "I understand. Could you tell me more about what's been on your mind lately?";
  } else if (lastMessage.includes('no') || lastMessage.includes('not')) {
    return "I see. Have you been able to find pleasure in things you usually enjoy?";
  }
  
  return "Thank you for sharing that. How has your sleep been recently?";
};

// Dummy implementation for completing assessment
const completeDepressionAssessment = async (_conversation: DummyChatMessage[]): Promise<{
  scores: {
    'PHQ-9': number;
    'BDI-II': number;
    'Hamilton': number;
  };
  verdict: string;
}> => {
  await delay(800);
  
  // Return dummy scores and verdict
  return {
    scores: {
      'PHQ-9': 5,
      'BDI-II': 12,
      'Hamilton': 8
    },
    verdict: "Based on our conversation, you're showing minimal to mild symptoms of depression. This is a positive sign, but remember that I'm here to help if you ever want to talk more about how you're feeling."
  };
};

export type { DummyChatMessage };

export {
  generateChatCompletion,
  startDepressionAssessment,
  continueDepressionAssessment,
  completeDepressionAssessment
};
