import type { Notification } from '../types';
import { apiGet, apiPatch } from './client';
import { mapNotification, type NotificationResponseDto, type PagedResultDto } from './backend';

export async function getNotifications(): Promise<Notification[]> {
  const page = await apiGet<PagedResultDto<NotificationResponseDto>>(
    '/api/notifications/mine?page=1&pageSize=50',
  );
  return page.items.map(mapNotification);
}

export async function getUnreadCount(): Promise<number> {
  const data = await apiGet<{ unreadCount: number }>('/api/notifications/unread-count');
  return data.unreadCount;
}

export function markNotificationRead(id: string | number): Promise<unknown> {
  return apiPatch(`/api/notifications/${id}/read`);
}

export function markAllNotificationsRead(): Promise<unknown> {
  return apiPatch('/api/notifications/mark-all-read');
}
