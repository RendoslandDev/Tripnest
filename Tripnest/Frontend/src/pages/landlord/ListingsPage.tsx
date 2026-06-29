import { useState } from 'react';
import type { Listing, ListingStatus } from '../../types';
import { getListings } from '../../api/listings';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge, { type BadgeTone } from '../../components/ui/Badge';
import { formatCedi } from '../../lib/format';
import { StarIcon, MapPinIcon } from '../../components/tenant/icons';

const STATUS: Record<ListingStatus, { tone: BadgeTone; label: string }> = {
  published: { tone: 'green', label: 'Published' },
  unlisted: { tone: 'gray', label: 'Unlisted' },
  draft: { tone: 'amber', label: 'Draft' },
  snoozed: { tone: 'blue', label: 'Snoozed' },
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
      <div className="relative h-28" style={{ backgroundColor: listing.coverColor }}>
        <Badge tone={STATUS[listing.status].tone} className="absolute left-3 top-3">{STATUS[listing.status].label}</Badge>
      </div>
      <div className="p-4">
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
          <h3 className="font-semibold text-ink">{listing.title}</h3>
        )}
        <p className="flex items-center gap-1 text-sm text-muted">
          <MapPinIcon size={13} /> {listing.location}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <p className="font-bold text-brand">
            {formatCedi(listing.nightlyRate)}<span className="text-xs font-normal text-muted"> / night</span>
          </p>
          {listing.reviews > 0 && (
            <span className="flex items-center gap-1 text-xs text-ink">
              <StarIcon size={12} className="text-amber-400" /> {listing.rating} ({listing.reviews})
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted">{listing.occupancyRate}% occupancy</p>
        <div className="mt-3 flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditing((v) => !v)}>{editing ? 'Cancel' : 'Edit'}</Button>
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
    setTitle(''); setLocation(''); setRate(''); setOpen(false);
  };

  if (!open) return <Button onClick={() => setOpen(true)}>+ Add listing</Button>;

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
  const published = listings.filter((l) => l.status === 'published').length;
  const avgOccupancy = listings.length
    ? Math.round(listings.reduce((s, l) => s + l.occupancyRate, 0) / listings.length)
    : 0;

  const addListing = (title: string, location: string, rate: number) =>
    setListings((ls) => [
      { id: `draft-${Date.now()}`, title, location, type: 'Apartment', status: 'draft', nightlyRate: rate, beds: 1, baths: 1, occupancyRate: 0, rating: 0, reviews: 0, coverColor: '#e6f4ea' },
      ...ls,
    ]);
  const rename = (id: string, title: string) =>
    setListings((ls) => ls.map((l) => (l.id === id ? { ...l, title } : l)));
  const toggleStatus = (id: string) =>
    setListings((ls) => ls.map((l) => (l.id === id ? { ...l, status: l.status === 'published' ? 'unlisted' : 'published' } : l)));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">My Listings</h1>
          <p className="mt-1 text-sm text-muted">{published} published · {listings.length} total · {avgOccupancy}% avg occupancy</p>
        </div>
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

export default function LandlordListingsPage() {
  const state = useAsync(getListings, []);
  return (
    <AsyncBoundary state={state} loadingMessage="Loading listings…" errorMessage="Failed to load listings." emptyMessage="No listings yet." isEmpty={(r) => r.length === 0}>
      {(rows) => <ListingsView initial={rows} />}
    </AsyncBoundary>
  );
}
