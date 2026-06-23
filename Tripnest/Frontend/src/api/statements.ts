import type { Statement } from '../types';
import { statements } from '../data/statements';
import { mockResponse } from './client';

export function getStatements(): Promise<Statement[]> {
  // return apiGet<Statement[]>('/statements');
  return mockResponse(statements);
}
