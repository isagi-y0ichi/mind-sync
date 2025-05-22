import axios from 'axios';
import { ChatRequestSchema } from '@/types/chat';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function sendChat(messages: any[]) {
  try {
    const payload = ChatRequestSchema.parse({ messages });
    const response = await api.post('/chat', payload);
    return response.data;
  } catch (error) {
    console.error('Error sending chat:', error);
    throw error;
  }
}
