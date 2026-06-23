import type { CalendarMonth } from '../types';
import { augustCalendar } from '../data/calendar';
import { mockResponse } from './client';

// Service layer for the pricing calendar. Mock-backed for now (see api/client).

export function getCalendarMonth(_month?: string): Promise<CalendarMonth> {
  // return apiGet<CalendarMonth>(`/calendar?month=${_month}`);
  return mockResponse(augustCalendar);
}
