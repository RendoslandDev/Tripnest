import { Link } from 'react-router-dom';
import type { Listing, ListingStatus, OverviewSummary } from '../../types';
import { getListings } from '../../api/listings';
import { getOverview } from '../../api/overview';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge, { type BadgeTone } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { formatCedi } from '../../lib/format';
import { useSession } from '../../store/authStore';
import {
  KeyIcon, CardIcon, CalendarIcon, StarIcon, PlusIcon, MapPinIcon, ChevronRightIcon,
} from '../../components/tenant/icons';

const STATUS_BADGE: Record<ListingStatus, { tone: BadgeTone; label: string }> = {
  published: { tone: 'green', label: 'Published' },
  unlisted: { tone: 'gray', label: 'Unlisted' },
  draft: { tone: 'blue', label: 'Draft' },
  snoozed: { tone: 'amber', label: 'Snoozed' },
};

const INQUIRIES = [
  { id: 1, name: 'Ama Serwaa', listing: 'Sunlit Loft near Osu', preview: 'Is the loft available from August?', time: '2h ago' },
  { id: 2, name: 'Kojo Antwi', listing: 'Garden Studio, East Legon', preview: 'Could I schedule a viewing this weekend?', time: '5h ago' },
  { id: 3, name: 'Efua Boateng', listing: 'Hillside Family House', preview: 'Are utilities included in the rent?', time: '1d ago' },
];

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="border-gray-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <span className="flex items-center gap-2 text-gray-400">{icon}</span>
      <p className="mt-3 text-2xl font-bold tracking-tight text-ink">{value}</p>
      <p className="mt-0.5 text-xs text-muted">{label}</p>
    </Card>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const status = STATUS_BADGE[listing.status];
  return (
    <Card className="overflow-hidden">
      <div className="relative h-28" style={{ backgroundColor: listing.coverColor }}>
        <Badge tone={status.tone} className="absolute left-3 top-3">{status.label}</Badge>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-ink">{listing.title}</h3>
        <p className="flex items-center gap-1 text-sm text-muted">
          <MapPinIcon size={13} /> {listing.location}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <p className="font-bold text-brand">
            {formatCedi(listing.nightlyRate)}
            <span className="text-xs font-normal text-muted"> / night</span>
          </p>
          <span className="flex items-center gap-1 text-xs text-ink">
            <StarIcon size={13} className="text-amber-400" />
            <span className="font-semibold">{listing.rating}</span>
            <span className="text-muted">({listing.reviews})</span>
          </span>
        </div>
        <p className="mt-2 text-xs text-muted">{listing.occupancyRate}% occupancy</p>
      </div>
    </Card>
  );
}

function Home({ listings, overview }: { listings: Listing[]; overview: OverviewSummary }) {
  const session = useSession();
  const firstName = (session?.name ?? 'there').split(' ')[0];
  const published = listings.filter((l) => l.status === 'published').length;
  const avgOccupancy = listings.length
    ? Math.round(listings.reduce((sum, l) => sum + l.occupancyRate, 0) / listings.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Welcome back, {firstName}</h1>
          <p className="mt-1 text-muted">Here's how your properties are performing.</p>
        </div>
        <Button variant="dark" className="gap-2 rounded-xl">
          <PlusIcon size={16} /> List a property
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Active listings" value={`${published}/${listings.length}`} icon={<KeyIcon size={18} />} />
        <Stat label="Monthly earnings" value={formatCedi(Math.round(overview.monthlyEarnings))} icon={<CardIcon size={18} />} />
        <Stat label="Avg. occupancy" value={`${avgOccupancy}%`} icon={<CalendarIcon size={18} />} />
        <Stat label="Upcoming check-ins" value={String(overview.upcomingCount)} icon={<CalendarIcon size={18} />} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink">Your listings</h2>
            <Link to="/landlord/listings" className="text-sm font-semibold text-brand no-underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>

        <aside className="min-w-0 space-y-5">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-ink">Recent inquiries</h3>
              <Link to="/landlord/inquiries" className="text-xs font-semibold text-brand no-underline">
                View all
              </Link>
            </div>
            <ul className="space-y-3">
              {INQUIRIES.map((q) => (
                <li key={q.id} className="flex items-center gap-3">
                  <Avatar name={q.name} size={36} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{q.name}</span>
                    <span className="block truncate text-xs text-muted">{q.preview}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted">{q.time}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-ink">This month's payout</h3>
            <p className="mt-2 text-3xl font-bold text-brand">
              {formatCedi(Math.round(overview.monthlyEarnings))}
            </p>
            <p className="mt-1 text-xs text-muted">
              Net of management fees · avg. {formatCedi(overview.avgNightlyRate)}/night
            </p>
            <Link to="/landlord/earnings" className="no-underline">
              <Button variant="ghost" size="sm" className="mt-3 gap-1">
                Earnings breakdown <ChevronRightIcon size={14} />
              </Button>
            </Link>
          </Card>

          <Card className="border-ink bg-ink p-5 text-white">
            <h3 className="font-bold">Grow your portfolio</h3>
            <p className="mt-1 text-sm text-white/70">
              Verified listings get 3× more inquiries. Add your next property today.
            </p>
            <Button className="mt-3 rounded-xl bg-white text-ink hover:bg-white/90" size="sm">
              List a property
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default function LandlordHome() {
  const listings = useAsync(getListings, []);
  const overview = useAsync(getOverview, []);

  return (
    <AsyncBoundary
      state={listings}
      loadingMessage="Loading your portfolio…"
      errorMessage="Failed to load your portfolio."
    >
      {(listingData) => (
        <AsyncBoundary state={overview} loadingMessage="Loading your portfolio…" errorMessage="Failed to load your portfolio.">
          {(overviewData) => <Home listings={listingData} overview={overviewData} />}
        </AsyncBoundary>
      )}
    </AsyncBoundary>
  );
}
