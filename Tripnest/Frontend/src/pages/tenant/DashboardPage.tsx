import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { TenantDashboard } from '../../types';
import { getTenantDashboard } from '../../api/tenant';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Toggle from '../../components/ui/Toggle';
import { formatCedi } from '../../lib/format';
import { currentUser } from '../../data/user';
import { useSession } from '../../store/authStore';
import {
  CalendarIcon, CardIcon, HeartIcon, ToolIcon, SearchIcon, PlusIcon, MessageIcon, BellIcon,
  MapPinIcon,
} from '../../components/tenant/icons';

const QUICK_ACTIONS = [
  { label: 'Search Properties', icon: <SearchIcon size={16} />, to: '/search' },
  { label: 'Add Property', icon: <PlusIcon size={16} />, to: '/landlord' },
  { label: 'Messages', icon: <MessageIcon size={16} />, to: '/messages' },
  { label: 'Make Payment', icon: <CardIcon size={16} />, to: '/payments' },
  { label: 'Report an Issue', icon: <ToolIcon size={16} />, to: '/maintenance' },
];

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand">
        {icon}
      </span>
      <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </Card>
  );
}

function Dashboard({ data }: { data: TenantDashboard }) {
  const session = useSession();
  const firstName = (session?.name ?? currentUser.name).split(' ')[0];
  const [smsOn, setSmsOn] = useState(true);
  const [invited, setInvited] = useState(false);

  const invite = () => {
    const link = `${window.location.origin}/?ref=${encodeURIComponent(currentUser.name.split(' ')[0].toLowerCase())}`;
    navigator.clipboard?.writeText(link).catch(() => {});
    setInvited(true);
    setTimeout(() => setInvited(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
          <p className="mt-1 text-muted">Welcome back, {firstName} — here's what's happening with your home.</p>
        </div>
        <span className="rounded-md border border-gray-200 px-2.5 py-1 text-xs text-muted">This Month</span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Active Bookings" value={String(data.stats.activeBookings)} icon={<CalendarIcon size={18} />} />
        <Stat label="Rent Paid" value={formatCedi(data.stats.rentPaid)} icon={<CardIcon size={18} />} />
        <Stat label="Saved Properties" value={String(data.stats.savedProperties)} icon={<HeartIcon size={18} />} />
        <Stat label="Open Maintenance" value={String(data.stats.openMaintenance)} icon={<ToolIcon size={18} />} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">Upcoming Booking</h2>
              <Badge tone="green">{data.upcoming.status}</Badge>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-ink">{data.upcoming.title}</p>
                <p className="text-xs text-muted">TN-ID: {data.upcoming.propertyId}</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                  <MapPinIcon size={14} /> {data.upcoming.location}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                  <CalendarIcon size={14} /> {data.upcoming.dates}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-brand">
                  {formatCedi(data.upcoming.price)}
                  <span className="text-xs font-normal text-muted"> / {data.upcoming.period}</span>
                </p>
                <Link to="/bookings" className="no-underline">
                  <Button size="sm" className="mt-3">View Booking</Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">Maintenance Tracker</h2>
              <Link to="/maintenance" className="text-xs font-semibold text-brand no-underline">View all</Link>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-amber-50 py-3">
                <p className="text-lg font-bold text-amber-600">{data.maintenance.pending}</p>
                <p className="text-xs text-muted">Pending</p>
              </div>
              <div className="rounded-lg bg-blue-50 py-3">
                <p className="text-lg font-bold text-blue-600">{data.maintenance.inProgress}</p>
                <p className="text-xs text-muted">In Progress</p>
              </div>
              <div className="rounded-lg bg-brand-50 py-3">
                <p className="text-lg font-bold text-brand">{data.maintenance.resolved}</p>
                <p className="text-xs text-muted">Resolved</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink">{data.maintenance.latest.title}</span>
                <span className="block text-xs text-muted">Reported: {data.maintenance.latest.reportedOn}</span>
              </span>
              <Badge tone="amber">{data.maintenance.latest.status}</Badge>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">Recent Messages</h2>
              <Link to="/messages" className="text-xs font-semibold text-brand no-underline">View all</Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {data.messages.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar name={m.name} size={40} />
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

        <div className="min-w-0 space-y-6">
          <Card className="p-6">
            <h2 className="mb-3 text-lg font-bold text-ink">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-2">
              {QUICK_ACTIONS.map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm font-medium text-gray-700 no-underline hover:bg-gray-50"
                >
                  <span className="text-brand">{a.icon}</span>
                  {a.label}
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-ink">Safety First</h2>
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

          <Card className="bg-brand p-6 text-white">
            <h2 className="text-lg font-bold">Invite &amp; Earn</h2>
            <p className="mt-1 text-sm text-white/80">Invite your friends and earn up to GH₵ 100!</p>
            <Button className="mt-3 bg-white text-brand hover:bg-white/90" size="sm" onClick={invite}>
              {invited ? 'Link copied!' : 'Invite Now'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const state = useAsync(getTenantDashboard, []);
  return (
    <AsyncBoundary state={state} loadingMessage="Loading…" errorMessage="Failed to load dashboard.">
      {(data) => <Dashboard data={data} />}
    </AsyncBoundary>
  );
}
