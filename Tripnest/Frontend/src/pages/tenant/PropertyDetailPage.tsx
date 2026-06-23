import { Link, useParams } from 'react-router-dom';
import type { Property } from '../../types';
import { getPropertyById } from '../../api/properties';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { formatCedi } from '../../lib/format';
import { AmenityIcon, ShieldIcon, StarIcon, MapPinIcon } from '../../components/tenant/icons';

function Gallery() {
  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="col-span-4 h-56 rounded-xl bg-gradient-to-br from-brand-50 to-gray-200 sm:h-72" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 rounded-lg bg-gradient-to-br from-brand-50 to-gray-200" />
      ))}
    </div>
  );
}

function BookingWidget({ property }: { property: Property }) {
  return (
    <Card className="sticky top-20 p-5">
      <p className="text-2xl font-bold text-brand">
        {formatCedi(property.price)}
        <span className="text-sm font-normal text-muted"> / {property.period}</span>
      </p>

      <div className="mt-4 space-y-2">
        <div className="rounded-lg border border-gray-200 px-3 py-2">
          <p className="text-[11px] text-muted">Check in – Check out</p>
          <p className="text-sm font-medium text-ink">May 20 – May 27</p>
        </div>
        <div className="rounded-lg border border-gray-200 px-3 py-2">
          <p className="text-[11px] text-muted">Guests</p>
          <p className="text-sm font-medium text-ink">2 Guests</p>
        </div>
      </div>

      <Button className="mt-4 w-full">
        {property.tag === 'Instant Book' ? 'Instant Book' : 'Request to Book'}
      </Button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
        <ShieldIcon size={13} className="text-brand" /> Secure payment via Mobile Money
      </p>
    </Card>
  );
}

function Detail({ property }: { property: Property }) {
  return (
    <div>
      <Link to="/search" className="text-sm font-semibold text-brand no-underline">
        ← Back to search
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          <Gallery />

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-ink">{property.title}</h1>
              {property.verified && (
                <Badge tone="green">
                  <span className="inline-flex items-center gap-1">
                    <ShieldIcon size={12} /> Verified
                  </span>
                </Badge>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-muted">
              <MapPinIcon size={15} /> {property.location}
              <span className="mx-1">·</span>
              <StarIcon size={13} className="text-amber-400" />
              <span className="font-semibold text-ink">{property.rating}</span>
              <span>({property.reviews} reviews)</span>
            </p>
            <p className="mt-1 text-xs text-muted">TN-ID: {property.id}</p>
          </div>

          <div className="flex flex-wrap gap-4 border-y border-gray-100 py-4 text-sm text-ink">
            <span>{property.type}</span>
            <span>· {property.beds} bed{property.beds > 1 ? 's' : ''}</span>
            <span>· {property.baths} bath{property.baths > 1 ? 's' : ''}</span>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-ink">About this place</h2>
            <p className="text-muted">{property.description}</p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-ink">Amenities</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {property.amenities.map((a) => (
                <span key={a} className="flex items-center gap-2 text-sm text-ink">
                  <span className="text-brand"><AmenityIcon name={a} size={16} /></span> {a}
                </span>
              ))}
            </div>
          </div>

          <Card className="flex items-center gap-3 p-4">
            <Avatar name={property.agent.name} size={44} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{property.agent.name}</p>
              <p className="text-sm text-muted">{property.agent.role} · {property.agent.phone}</p>
            </div>
            <Button variant="ghost" size="sm">Contact</Button>
          </Card>
        </div>

        <aside className="min-w-0">
          <BookingWidget property={property} />
        </aside>
      </div>
    </div>
  );
}

export default function PropertyDetailPage() {
  const { id = '' } = useParams();
  const state = useAsync(() => getPropertyById(id), [id]);

  return (
    <AsyncBoundary
      state={state}
      loadingMessage="Loading property…"
      errorMessage="Failed to load property."
    >
      {(property) =>
        property ? (
          <Detail property={property} />
        ) : (
          <div>
            <p className="text-muted">Property not found.</p>
            <Link to="/search" className="text-sm font-semibold text-brand no-underline">
              ← Back to search
            </Link>
          </div>
        )
      }
    </AsyncBoundary>
  );
}
