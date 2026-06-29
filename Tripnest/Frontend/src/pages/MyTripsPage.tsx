import { useState } from 'react';
import type { Trip, TripStatus } from '../types';
import { getTrips } from '../api/trips';
import { useAsync } from '../hooks/useAsync';
import AsyncBoundary from '../components/AsyncBoundary';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge, { type BadgeTone } from '../components/ui/Badge';
import { formatCurrency } from '../lib/format';

const STATUS_TONE: Record<TripStatus, BadgeTone> = {
  upcoming: 'blue',
  completed: 'green',
  canceled: 'red',
};

const TABS: { id: TripStatus; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'canceled', label: 'Canceled' },
];

function TripCard({ trip }: { trip: Trip }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="flex overflow-hidden">
      <div className="w-28 shrink-0" style={{ backgroundColor: trip.coverColor }} />
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{trip.destination}</p>
            <p className="truncate text-sm text-muted">{trip.property}</p>
          </div>
          <Badge tone={STATUS_TONE[trip.status]}>{trip.status}</Badge>
        </div>

        <p className="mt-3 text-sm text-muted">
          {trip.checkIn} → {trip.checkOut} · {trip.nights} nights · {trip.guests} guests
        </p>

        {open && (
          <dl className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-3 text-sm">
            <dt className="text-muted">Reference</dt>
            <dd className="text-right font-medium text-ink">{trip.id}</dd>
            <dt className="text-muted">Nightly rate</dt>
            <dd className="text-right font-medium text-ink">{formatCurrency(Math.round(trip.price / trip.nights))}</dd>
            <dt className="text-muted">Total</dt>
            <dd className="text-right font-medium text-ink">{formatCurrency(trip.price)}</dd>
          </dl>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold text-ink">{formatCurrency(trip.price)}</span>
          <Button variant="ghost" size="sm" onClick={() => setOpen((o) => !o)}>
            {open ? 'Hide details' : trip.status === 'upcoming' ? 'Manage' : 'View details'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function MyTripsPage() {
  const state = useAsync(getTrips, []);
  const [tab, setTab] = useState<TripStatus>('upcoming');

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-ink">My Trips</h1>

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === t.id
                ? 'bg-ink text-white'
                : 'bg-gray-100 text-muted hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AsyncBoundary
        state={state}
        loadingMessage="Loading trips…"
        errorMessage="Failed to load trips."
      >
        {(rows) => {
          const visible = rows.filter((t) => t.status === tab);
          return visible.length === 0 ? (
            <p className="text-muted">No {tab} trips.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {visible.map((t) => (
                <TripCard key={t.id} trip={t} />
              ))}
            </div>
          );
        }}
      </AsyncBoundary>
    </div>
  );
}
