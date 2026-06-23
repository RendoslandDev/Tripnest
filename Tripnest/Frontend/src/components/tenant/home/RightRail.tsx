import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { TenantDashboard } from '../../../types';
import { getTenantDashboard } from '../../../api/tenant';
import { useAsync } from '../../../hooks/useAsync';
import AsyncBoundary from '../../AsyncBoundary';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Avatar from '../../ui/Avatar';
import Toggle from '../../ui/Toggle';
import { formatCedi } from '../../../lib/format';
import {
  CalendarIcon, CardIcon, HeartIcon, ToolIcon, SearchIcon, PlusIcon, MessageIcon, BellIcon,
} from '../icons';

const QUICK_ACTIONS = [
  { label: 'Search Properties', icon: <SearchIcon size={16} /> },
  { label: 'Add Property', icon: <PlusIcon size={16} /> },
  { label: 'Messages', icon: <MessageIcon size={16} /> },
  { label: 'Make Payment', icon: <CardIcon size={16} /> },
  { label: 'Report an Issue', icon: <ToolIcon size={16} /> },
];

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-100 p-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand">
        {icon}
      </span>
      <p className="mt-2 text-lg font-bold text-ink">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function Rail({ data }: { data: TenantDashboard }) {
  const [smsOn, setSmsOn] = useState(true);
  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-ink">Dashboard Overview</h3>
          <span className="rounded-md border border-gray-200 px-2 py-0.5 text-xs text-muted">This Month</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Active Bookings" value={String(data.stats.activeBookings)} icon={<CalendarIcon size={16} />} />
          <Stat label="Rent Paid" value={formatCedi(data.stats.rentPaid)} icon={<CardIcon size={16} />} />
          <Stat label="Saved Properties" value={String(data.stats.savedProperties)} icon={<HeartIcon size={16} />} />
          <Stat label="Open Maintenance" value={String(data.stats.openMaintenance)} icon={<ToolIcon size={16} />} />
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-ink">Upcoming Booking</h3>
          <Badge tone="green">{data.upcoming.status}</Badge>
        </div>
        <p className="font-semibold text-ink">{data.upcoming.title}</p>
        <p className="text-xs text-muted">TN-ID: {data.upcoming.propertyId}</p>
        <p className="mt-1 text-sm text-muted">{data.upcoming.location}</p>
        <p className="mt-1 text-sm text-muted">{data.upcoming.dates}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-brand">
            {formatCedi(data.upcoming.price)}
            <span className="text-xs font-normal text-muted"> / {data.upcoming.period}</span>
          </span>
          <Button size="sm">View Booking</Button>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-3 font-bold text-ink">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-2">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="text-brand">{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-3 font-bold text-ink">Maintenance Tracker</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-amber-50 py-2">
            <p className="font-bold text-amber-600">{data.maintenance.pending}</p>
            <p className="text-[11px] text-muted">Pending</p>
          </div>
          <div className="rounded-lg bg-blue-50 py-2">
            <p className="font-bold text-blue-600">{data.maintenance.inProgress}</p>
            <p className="text-[11px] text-muted">In Progress</p>
          </div>
          <div className="rounded-lg bg-brand-50 py-2">
            <p className="font-bold text-brand">{data.maintenance.resolved}</p>
            <p className="text-[11px] text-muted">Resolved</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-ink">{data.maintenance.latest.title}</span>
            <span className="block text-xs text-muted">Reported: {data.maintenance.latest.reportedOn}</span>
          </span>
          <Badge tone="amber">{data.maintenance.latest.status}</Badge>
        </div>
      </Card>

      <Card className="bg-brand p-5 text-white">
        <h3 className="font-bold">Invite &amp; Earn</h3>
        <p className="mt-1 text-sm text-white/80">Invite your friends and earn up to GH₵ 100!</p>
        <Button className="mt-3 bg-white text-brand hover:bg-white/90" size="sm">Invite Now</Button>
      </Card>

      <Card className="p-5">
        <h3 className="font-bold text-ink">Safety First</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-ink">
            <BellIcon size={16} className="text-brand" /> SMS Safety Alert
          </span>
          <Toggle on={smsOn} onChange={setSmsOn} />
        </div>
        <div className="mt-3 border-t border-gray-100 pt-3">
          <p className="text-xs text-muted">Emergency Contact</p>
          <p className="text-sm font-semibold text-ink">{data.emergencyContact}</p>
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-ink">Recent Messages</h3>
          <Link to="/messages" className="text-xs font-semibold text-brand no-underline">View all</Link>
        </div>
        <ul className="space-y-3">
          {data.messages.map((m) => (
            <li key={m.id} className="flex items-center gap-3">
              <Avatar name={m.name} size={36} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">
                  {m.name} <span className="font-normal text-muted">({m.role})</span>
                </span>
                <span className="block truncate text-xs text-muted">{m.preview}</span>
              </span>
              <span className="text-xs text-muted">{m.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export default function RightRail() {
  const state = useAsync(getTenantDashboard, []);
  return (
    <AsyncBoundary state={state} loadingMessage="Loading…" errorMessage="Failed to load dashboard.">
      {(data) => <Rail data={data} />}
    </AsyncBoundary>
  );
}
