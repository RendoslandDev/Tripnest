import type { DisplayCardStatus } from '../types'

export function fmtDate(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function fmtDateTime(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

/** Backend stores only Active/Revoked; expiry-based states are derived here. */
export function displayCardStatus(status: string, expiryDate: string): DisplayCardStatus {
  if (status === 'Revoked') return 'Revoked'
  const expiry = new Date(expiryDate).getTime()
  const now = Date.now()
  if (expiry < now) return 'Expired'
  if (expiry < now + 30 * 24 * 60 * 60 * 1000) return 'Expiring Soon'
  return 'Active'
}

export const STATUS_BADGE_CLASS: Record<string, string> = {
  'Active': 'badge-active',
  'Expiring Soon': 'badge-expiring',
  'Expired': 'badge-inactive',
  'Inactive': 'badge-inactive',
  'Revoked': 'badge-revoked',
  'Pending': 'badge-pending',
  'Approved': 'badge-active',
  'Rejected': 'badge-revoked',
}
