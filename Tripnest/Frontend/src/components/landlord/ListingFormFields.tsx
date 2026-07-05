import type { NewListingInput } from '../../api/listings';

// Field set shared by the add- and edit-listing modals.

const INPUT =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand';

const PROPERTY_TYPES = ['Apartment', 'House', 'Room', 'Studio', 'Hostel', 'Villa'];

const STAY_TYPES = [
  { value: 0, label: 'Short term (nights)' },
  { value: 1, label: 'Long term (months)' },
  { value: 2, label: 'Student housing' },
];

const CANCELLATION_POLICIES = [
  { value: 0, label: 'Flexible — full refund up to 24h before' },
  { value: 1, label: 'Moderate — full refund 5+ days before' },
  { value: 2, label: 'Strict — 50% refund 7+ days before' },
];

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-1.5 block text-sm font-medium text-ink">{children}</span>;
}

interface ListingFieldsProps {
  form: NewListingInput;
  set: <K extends keyof NewListingInput>(key: K, value: NewListingInput[K]) => void;
  autoFocusTitle?: boolean;
}

export default function ListingFields({ form, set, autoFocusTitle = false }: ListingFieldsProps) {
  return (
    <>
      <label className="block">
        <FieldLabel>Title</FieldLabel>
        <input
          autoFocus={autoFocusTitle}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="2-Bedroom Apartment near KNUST"
          className={INPUT}
        />
      </label>

      <label className="block">
        <FieldLabel>Description</FieldLabel>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          placeholder="What makes this place great to stay in?"
          className={`${INPUT} resize-y`}
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <FieldLabel>Location</FieldLabel>
          <input
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="Tarkwa, Western Region"
            className={INPUT}
          />
        </label>
        <label className="block">
          <FieldLabel>Property type</FieldLabel>
          <select
            value={form.propertyType}
            onChange={(e) => set('propertyType', e.target.value)}
            className={INPUT}
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <label className="block">
          <FieldLabel>Bedrooms</FieldLabel>
          <input
            type="number"
            min={0}
            value={form.bedrooms}
            onChange={(e) => set('bedrooms', Math.max(0, Number(e.target.value)))}
            className={INPUT}
          />
        </label>
        <label className="block">
          <FieldLabel>Bathrooms</FieldLabel>
          <input
            type="number"
            min={0}
            value={form.bathrooms}
            onChange={(e) => set('bathrooms', Math.max(0, Number(e.target.value)))}
            className={INPUT}
          />
        </label>
        <label className="block col-span-2 sm:col-span-1">
          <FieldLabel>Rent / month</FieldLabel>
          <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3 focus-within:border-brand">
            <span className="text-xs text-muted">GH₵</span>
            <input
              type="number"
              min={0}
              value={form.monthlyRent || ''}
              onChange={(e) => set('monthlyRent', Math.max(0, Number(e.target.value)))}
              className="w-full bg-transparent px-2 py-2.5 text-sm text-ink outline-none"
            />
          </div>
        </label>
        <label className="block col-span-2 sm:col-span-1">
          <FieldLabel>Rate / night</FieldLabel>
          <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3 focus-within:border-brand">
            <span className="text-xs text-muted">GH₵</span>
            <input
              type="number"
              min={0}
              value={form.dailyRate ?? ''}
              onChange={(e) => set('dailyRate', e.target.value === '' ? undefined : Math.max(0, Number(e.target.value)))}
              placeholder="auto"
              className="w-full bg-transparent px-2 py-2.5 text-sm text-ink outline-none"
            />
          </div>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <FieldLabel>Stay type</FieldLabel>
          <select
            value={form.stayType}
            onChange={(e) => set('stayType', Number(e.target.value))}
            className={INPUT}
          >
            {STAY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <FieldLabel>Cancellation policy</FieldLabel>
          <select
            value={form.cancellationPolicy}
            onChange={(e) => set('cancellationPolicy', Number(e.target.value))}
            className={INPUT}
          >
            {CANCELLATION_POLICIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <FieldLabel>Amenities</FieldLabel>
        <input
          value={form.amenities}
          onChange={(e) => set('amenities', e.target.value)}
          placeholder="Wifi, Kitchen, Air conditioning (comma-separated)"
          className={INPUT}
        />
      </label>
    </>
  );
}
