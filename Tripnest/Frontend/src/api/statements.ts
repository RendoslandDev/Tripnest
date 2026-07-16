import type { Statement } from '../types';
import { apiGet } from './client';
import { mapStatement, type StatementResponseDto } from './backend';

// Monthly payout statements, computed server-side from completed bookings.

export async function getStatements(): Promise<Statement[]> {
  const dtos = await apiGet<StatementResponseDto[]>('/api/statements');
  return dtos.map(mapStatement);
}
