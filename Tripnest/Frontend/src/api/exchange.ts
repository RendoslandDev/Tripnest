import type { ExchangePost } from '../types';
import { exchangePosts as mockPosts } from '../data/exchange';
import { mockResponse } from './client';

// Service layer for the owner community board. Today these resolve local mock
// data; to go live, swap each body for the commented apiGet/apiPost call.

export function getExchangePosts(): Promise<ExchangePost[]> {
  // return apiGet<ExchangePost[]>('/exchange/posts');
  return mockResponse(mockPosts);
}
