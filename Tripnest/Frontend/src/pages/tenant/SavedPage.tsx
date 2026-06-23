import { useState } from 'react';
import { getSavedProperties } from '../../api/properties';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import PropertyCard from '../../components/tenant/PropertyCard';

export default function SavedPage() {
  const state = useAsync(getSavedProperties, []);
  const [removed, setRemoved] = useState<string[]>([]);

  const remove = (id: string) => setRemoved((r) => [...r, id]);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-ink">Saved Listings</h1>

      <AsyncBoundary
        state={state}
        loadingMessage="Loading saved listings…"
        errorMessage="Failed to load saved listings."
      >
        {(saved) => {
          const items = saved.filter((p) => !removed.includes(p.id));
          return items.length === 0 ? (
            <p className="text-muted">You haven’t saved any listings yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <PropertyCard key={p.id} property={p} initialSaved onToggleSave={remove} />
              ))}
            </div>
          );
        }}
      </AsyncBoundary>
    </div>
  );
}
