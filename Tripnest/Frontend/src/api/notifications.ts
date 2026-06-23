import type { Notification } from '../types';
import { notifications } from '../data/notifications';
import { mockResponse } from './client';

export function getNotifications(): Promise<Notification[]> {
  // return apiGet<Notification[]>('/notifications');
  return mockResponse(notifications);
}
