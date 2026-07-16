import { useState } from 'react';
import type { Listing, ListingStatus } from '../../types';
import { getListings } from '../../api/listings';
import { useAsync } from '../../hooks/useAsync';
import AddListingModal from '../../components/landlord/AddListingModal';
import EditListingModal from '../../components/landlord/EditListingModal';
import WalkthroughManagerModal from '../../components/landlord/WalkthroughManagerModal';
import TourEditorModal from '../../components/landlord/TourEditorModal';
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

function ListingCard({ listing, onUpdated }: {
  listing: Listing;
  onUpdated: (listing: Listing) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div className="relative h-28" style={{ backgroundColor: listing.coverColor }}>
        <Badge tone={STATUS[listing.status].tone} className="absolute left-3 top-3">{STATUS[listing.status].label}</Badge>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-ink">{listing.title}</h3>
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
          <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}>Edit</Button>
          <Button variant="ghost" size="sm" onClick={() => setManagerOpen(true)}>Videos</Button>
          <Button variant="ghost" size="sm" onClick={() => setTourOpen(true)}>Tour</Button>
        </div>
        {listing.status !== 'published' && (
          <p className="mt-2 text-xs text-muted">
            Goes live once TripNest verifies the listing.
          </p>
        )}
      </div>
      {editOpen && (
        <EditListingModal
          listingId={listing.id}
          onClose={() => setEditOpen(false)}
          onUpdated={onUpdated}
        />
      )}
      {managerOpen && (
        <WalkthroughManagerModal
          listingId={listing.id}
          listingTitle={listing.title}
          onClose={() => setManagerOpen(false)}
        />
      )}
      {tourOpen && (
        <TourEditorModal
          listingId={listing.id}
          listingTitle={listing.title}
          onClose={() => setTourOpen(false)}
        />
      )}
    </Card>
  );
}

function ListingsView({ initial }: { initial: Listing[] }) {
  const [listings, setListings] = useState(initial);
  const published = listings.filter((l) => l.status === 'published').length;
  const avgOccupancy = listings.length
    ? Math.round(listings.reduce((s, l) => s + l.occupancyRate, 0) / listings.length)
    : 0;

  const replace = (updated: Listing) =>
    setListings((ls) => ls.map((l) => (l.id === updated.id ? updated : l)));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">My Listings</h1>
          <p className="mt-1 text-sm text-muted">{published} published · {listings.length} total · {avgOccupancy}% avg occupancy</p>
        </div>
        <AddListingModal onCreated={(l) => setListings((ls) => [l, ...ls])} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} onUpdated={replace} />
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
