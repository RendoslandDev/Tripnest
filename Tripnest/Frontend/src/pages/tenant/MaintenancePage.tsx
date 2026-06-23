import { useState } from 'react';
import type { MaintenanceStatus, MaintenanceTicket } from '../../types';
import { getMaintenanceTickets, createMaintenanceTicket } from '../../api/maintenance';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge, { type BadgeTone } from '../../components/ui/Badge';

const STATUS: Record<MaintenanceStatus, { tone: BadgeTone; label: string }> = {
  pending: { tone: 'amber', label: 'Pending' },
  'in-progress': { tone: 'blue', label: 'In Progress' },
  resolved: { tone: 'green', label: 'Resolved' },
};

const CATEGORIES = ['Plumbing', 'Electrical', 'General'];

function MaintenanceView({ initial }: { initial: MaintenanceTicket[] }) {
  const [tickets, setTickets] = useState(initial);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [saving, setSaving] = useState(false);

  const counts = {
    pending: tickets.filter((t) => t.status === 'pending').length,
    'in-progress': tickets.filter((t) => t.status === 'in-progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const ticket = await createMaintenanceTicket({ title: title.trim(), category });
    setTickets((t) => [ticket, ...t]);
    setTitle('');
    setSaving(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{counts.pending}</p>
            <p className="text-xs text-muted">Pending</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{counts['in-progress']}</p>
            <p className="text-xs text-muted">In Progress</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-brand">{counts.resolved}</p>
            <p className="text-xs text-muted">Resolved</p>
          </Card>
        </div>

        <Card className="divide-y divide-gray-100 overflow-hidden">
          {tickets.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{t.title}</p>
                <p className="text-sm text-muted">{t.category} · Reported {t.reportedOn}</p>
              </div>
              <Badge tone={STATUS[t.status].tone}>{STATUS[t.status].label}</Badge>
            </div>
          ))}
        </Card>
      </div>

      <Card className="h-fit p-5">
        <h2 className="mb-4 text-lg font-bold text-ink">Report an issue</h2>
        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Issue</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Leaking tap in kitchen"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Submitting…' : 'Submit request'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function MaintenancePage() {
  const state = useAsync(getMaintenanceTickets, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-ink">Maintenance</h1>
      <AsyncBoundary
        state={state}
        loadingMessage="Loading maintenance…"
        errorMessage="Failed to load maintenance."
      >
        {(rows) => <MaintenanceView initial={rows} />}
      </AsyncBoundary>
    </div>
  );
}
