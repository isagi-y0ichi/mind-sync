import { z } from "zod";

export const ChatMessageSchema = z.object({
  sender: z.enum(["user", "ai"]),
  message: z.string().min(1),
  timestamp: z.number().default(() => Date.now())
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema),
});

export const ChatResponseSchema = z.object({
  reply: z.string(),
});

export type ChatState = {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  addMessage: (message: ChatMessage) => void;
  sendMessage: (text: string) => Promise<void>;
  reset: () => void;
};
