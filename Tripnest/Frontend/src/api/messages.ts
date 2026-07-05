import type { ChatMessage, Conversation } from '../types';
import { getSession } from '../store/authStore';
import { apiGet, apiPatch, apiPost } from './client';
import {
  mapConversation,
  mapMessage,
  timeAgo,
  type ConversationResponseDto,
  type MessageResponseDto,
  type PagedResultDto,
} from './backend';
import { getPropertyById } from './properties';

/**
 * Conversations for the signed-in user, enriched client-side because the
 * DTO carries ids only: property-linked chats are named after the property,
 * and the newest message (API pages newest-first) supplies the sidebar
 * preview, timestamp and unread flag. Enrichment is best-effort — on any
 * failure the bare conversation still renders.
 */
export async function getConversations(): Promise<Conversation[]> {
  const me = getSession()?.userId ?? '';
  const dtos = await apiGet<ConversationResponseDto[]>('/api/chat/conversations/mine');
  return Promise.all(dtos.map(async (dto) => {
    const conversation = mapConversation(dto, me);
    try {
      const [latest, property] = await Promise.all([
        apiGet<PagedResultDto<MessageResponseDto>>(
          `/api/chat/conversations/${dto.conversationId}/messages?page=1&pageSize=1`,
        ).then((p) => p.items[0]),
        dto.propertyId ? getPropertyById(dto.propertyId) : Promise.resolve(undefined),
      ]);
      if (property) conversation.name = property.title;
      if (latest) {
        conversation.lastMessage = latest.content;
        conversation.time = timeAgo(latest.createdAt);
        conversation.unread = latest.senderId !== me && !latest.isRead ? 1 : 0;
      }
    } catch { /* enrichment only */ }
    return conversation;
  }));
}

export async function getMessages(conversationId: string | number): Promise<ChatMessage[]> {
  const me = getSession()?.userId ?? '';
  const page = await apiGet<PagedResultDto<MessageResponseDto>>(
    `/api/chat/conversations/${conversationId}/messages?page=1&pageSize=100`,
  );
  // The API orders newest-first; the thread renders oldest-first.
  return [...page.items].reverse().map((dto) => mapMessage(dto, me));
}

/** Open (or reuse) a conversation with another user; returns its id. */
export async function startConversation(otherUserId: string, propertyId?: string): Promise<string> {
  const dto = await apiPost<ConversationResponseDto>('/api/chat/conversations', {
    otherUserId,
    propertyId,
  });
  return dto.conversationId;
}

export async function sendMessage(conversationId: string | number, body: string): Promise<ChatMessage> {
  const me = getSession()?.userId ?? '';
  const dto = await apiPost<MessageResponseDto>(
    `/api/chat/conversations/${conversationId}/messages`,
    { body },
  );
  return mapMessage(dto, me);
}

/** Clear the unread state server-side when a conversation is opened. */
export function markConversationRead(conversationId: string | number): Promise<unknown> {
  return apiPatch(`/api/chat/conversations/${conversationId}/mark-read`);
}
