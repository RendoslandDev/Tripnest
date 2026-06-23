import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../../types';
import { formatCedi } from '../../lib/format';
import { AmenityIcon, ShieldIcon, StarIcon } from './icons';

interface PropertyCardProps {
  property: Property;
  initialSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export default function PropertyCard({ property, initialSaved = false, onToggleSave }: PropertyCardProps) {
  const [saved, setSaved] = useState(initialSaved);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setSaved((s) => !s);
    onToggleSave?.(property.id);
  };

  return (
    <Link
      to={`/property/${property.id}`}
      className="block overflow-hidden rounded-xl border border-gray-200 bg-white no-underline transition-shadow hover:shadow-md"
    >
      <div className="relative h-40 bg-gradient-to-br from-brand-50 to-gray-200">
        {property.verified && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-brand">
            <ShieldIcon size={12} /> Verified
          </span>
        )}
        <button
          aria-label={saved ? 'Unsave property' : 'Save property'}
          onClick={toggleSave}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 ${
            saved ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'
          }`}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {property.tag && (
          <span className="absolute bottom-3 left-3 rounded-md bg-ink/80 px-2 py-1 text-[11px] font-semibold text-white">
            {property.tag}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-[11px] font-medium text-muted">TN-ID: {property.id}</p>
        <h3 className="mt-0.5 font-semibold text-ink">{property.title}</h3>
        <p className="text-sm text-muted">{property.location}</p>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          {property.amenities.map((a) => (
            <span key={a} className="flex items-center gap-1 text-xs text-muted">
              <AmenityIcon name={a} /> {a}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-end justify-between">
          <p className="font-bold text-brand">
            {formatCedi(property.price)}
            <span className="text-xs font-normal text-muted"> / {property.period}</span>
          </p>
          <span className="flex items-center gap-1 text-xs text-ink">
            <StarIcon size={13} className="text-amber-400" />
            <span className="font-semibold">{property.rating}</span>
            <span className="text-muted">({property.reviews} reviews)</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
