import { useState } from 'react';
import type { Listing, ListingStatus } from '../types';
import { getListings } from '../api/listings';
import { useAsync } from '../hooks/useAsync';
import AsyncBoundary from '../components/AsyncBoundary';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge, { type BadgeTone } from '../components/ui/Badge';
import { formatCurrency } from '../lib/format';

const STATUS_TONE: Record<ListingStatus, BadgeTone> = {
  published: 'green',
  unlisted: 'gray',
  draft: 'amber',
  snoozed: 'blue',
};

const STATUS_LABEL: Record<ListingStatus, string> = {
  published: 'Published',
  unlisted: 'Unlisted',
  draft: 'Draft',
  snoozed: 'Snoozed',
};

function ListingCard({ listing, onRename, onToggleStatus }: {
  listing: Listing;
  onRename: (id: string, title: string) => void;
  onToggleStatus: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(listing.title);

  const saveTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) onRename(listing.id, title.trim());
    setEditing(false);
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-32 w-full" style={{ backgroundColor: listing.coverColor }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {editing ? (
              <form onSubmit={saveTitle} className="flex gap-2">
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2 py-1 text-sm outline-none focus:border-brand"
                />
                <Button type="submit" size="sm">Save</Button>
              </form>
            ) : (
              <p className="truncate font-semibold text-ink">{listing.title}</p>
            )}
            <p className="text-sm text-muted">{listing.location}</p>
          </div>
          <Badge tone={STATUS_TONE[listing.status]}>{STATUS_LABEL[listing.status]}</Badge>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted">
          <span>{listing.type}</span>
          <span>·</span>
          <span>{listing.beds} bd</span>
          <span>·</span>
          <span>{listing.baths} ba</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold text-ink">
            {formatCurrency(listing.nightlyRate)}
            <span className="font-normal text-muted"> / night</span>
          </span>
          {listing.reviews > 0 && (
            <span className="text-sm text-muted">
              ★ {listing.rating} ({listing.reviews})
            </span>
          )}
        </div>

        <p className="mt-2 text-xs text-muted">{listing.occupancyRate}% occupancy</p>

        <div className="mt-4 flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditing((v) => !v)}>
            {editing ? 'Cancel' : 'Edit'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onToggleStatus(listing.id)}>
            {listing.status === 'published' ? 'Unlist' : 'Publish'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function AddListingForm({ onAdd }: { onAdd: (title: string, location: string, rate: number) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [rate, setRate] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;
    onAdd(title.trim(), location.trim(), Number(rate) || 0);
    setTitle('');
    setLocation('');
    setRate('');
    setOpen(false);
  };

  if (!open) return <Button onClick={() => setOpen(true)}>Add listing</Button>;

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title"
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand" />
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location"
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand" />
      <input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="numeric" placeholder="Rate"
        className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand" />
      <Button type="submit" size="sm">Save</Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
    </form>
  );
}

function ListingsView({ initial }: { initial: Listing[] }) {
  const [listings, setListings] = useState(initial);

  const addListing = (title: string, location: string, rate: number) => {
    const listing: Listing = {
      id: `draft-${Date.now()}`,
      title,
      location,
      type: 'Apartment',
      status: 'draft',
      nightlyRate: rate,
      beds: 1,
      baths: 1,
      occupancyRate: 0,
      rating: 0,
      reviews: 0,
      coverColor: '#e6f4ea',
    };
    setListings((ls) => [listing, ...ls]);
  };

  const rename = (id: string, title: string) =>
    setListings((ls) => ls.map((l) => (l.id === id ? { ...l, title } : l)));

  const toggleStatus = (id: string) =>
    setListings((ls) =>
      ls.map((l) =>
        l.id === id
          ? { ...l, status: l.status === 'published' ? 'unlisted' : 'published' }
          : l,
      ),
    );

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold text-ink">Listings</h1>
        <AddListingForm onAdd={addListing} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} onRename={rename} onToggleStatus={toggleStatus} />
        ))}
      </div>
    </>
  );
}

export default function ListingsPage() {
  const state = useAsync(getListings, []);

  return (
    <AsyncBoundary
      state={state}
      loadingMessage="Loading listings…"
      errorMessage="Failed to load listings."
      emptyMessage="No listings yet."
      isEmpty={(rows) => rows.length === 0}
    >
      {(rows) => <ListingsView initial={rows} />}
    </AsyncBoundary>
  );
}
