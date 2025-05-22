import Groq from 'groq-sdk';

// Using Vite's environment variable syntax
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

if (!groqApiKey) {
  console.warn('GROQ_API_KEY is not set. API calls will fail.');
}

export const groq = new Groq({
  apiKey: groqApiKey || '',
});

type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

const DEPRESSION_ASSESSMENT_SYSTEM_PROMPT = `You are a compassionate mental health counselor conducting a 15-question conversation to assess a student's depression level.

Ask your own questions one at a time, adapting based on the user's responses. 
Use a blend of clinically relevant questions inspired by PHQ-9, BDI-II, and Hamilton Depression Rating Scale, 
but do not mention the names of these scales. Use empathetic, friendly, and natural language.

After completing the conversation, say:
"Thank you, I now have enough to assess."

Then summarize and provide scores in this exact JSON format ONLY (include the total possible score):
{
  "PHQ-9": number (out of 27),
  "BDI-II": number (out of 63),
  "Hamilton": number (out of 52)
}

After the JSON, provide a brief final verdict based on the scores using clinically common interpretations such as:
- None/Minimal
- Mild
- Moderate
- Moderately Severe
- Severe

Example output:
{
  "PHQ-9": 16 (out of 27),
  "BDI-II": 29 (out of 63),
  "Hamilton": 18 (out of 52)
}
Verdict: Moderate depression across all three scales. (add justification for the verdict based on the three scales)`;

export async function generateChatCompletion(
  messages: ChatMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const {
    model = 'llama-3-70b-8192',
    temperature = 0.7,
    maxTokens = 200,
  } = options;

  try {
    const response = await groq.chat.completions.create({
      messages,
      model,
      temperature,
      max_tokens: maxTokens,
      top_p: 1,
      stream: false,
      stop: null,
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error generating chat completion:', error);
    return 'Sorry, there was an error processing your request.';
  }
}

export async function startDepressionAssessment(initialMessage: string) {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: DEPRESSION_ASSESSMENT_SYSTEM_PROMPT,
    },
    {
      role: 'user',
      content: initialMessage,
    },
  ];

  return await generateChatCompletion(messages, {
    model: 'llama-3-70b-8192',
    temperature: 0.7,
    maxTokens: 200,
  });
}

export async function continueDepressionAssessment(conversation: ChatMessage[]) {
  return await generateChatCompletion(conversation, {
    model: 'llama-3-70b-8192',
    temperature: 0.7,
    maxTokens: 200,
  });
}

export async function completeDepressionAssessment(conversation: ChatMessage[]) {
  const finalMessages: ChatMessage[] = [
    ...conversation,
    {
      role: 'user',
      content: 'Based on our conversation, please summarize and give me the scores in the requested format.',
    },
  ];

  return await generateChatCompletion(finalMessages, {
    model: 'llama-3-70b-8192',
    temperature: 0.0, // Use lower temperature for more deterministic scoring
    maxTokens: 500, // Allow more tokens for the final assessment
  });
}
