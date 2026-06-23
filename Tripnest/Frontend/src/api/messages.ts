import type { ChatMessage, Conversation } from '../types';
import { conversations, messagesByConversation } from '../data/messages';
import { mockResponse } from './client';

export function getConversations(): Promise<Conversation[]> {
  // return apiGet<Conversation[]>('/conversations');
  return mockResponse(conversations);
}

export function getMessages(conversationId: number): Promise<ChatMessage[]> {
  // return apiGet<ChatMessage[]>(`/conversations/${conversationId}/messages`);
  return mockResponse(messagesByConversation[conversationId] ?? []);
}
