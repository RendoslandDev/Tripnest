import { useState } from 'react';
import type { Listing } from '../../types';
import {
  generateListingCopy, getListingProperty, updateListing,
  type ListingCopySuggestion, type NewListingInput,
} from '../../api/listings';
import { aiErrorMessage } from '../../api/assistant';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../AsyncBoundary';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ListingFields from './ListingFormFields';
import ListingCopySuggestionCard from './ListingCopySuggestionCard';
import { SparkleIcon } from '../tenant/icons';
import type { PropertyResponseDto } from '../../api/backend';

interface EditListingModalProps {
  listingId: string;
  onClose: () => void;
  onUpdated: (listing: Listing) => void;
}

function EditForm({ dto, onClose, onUpdated }: {
  dto: PropertyResponseDto;
  onClose: () => void;
  onUpdated: (listing: Listing) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<ListingCopySuggestion | null>(null);
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [form, setForm] = useState<NewListingInput>({
    title: dto.title,
    description: dto.description,
    location: dto.location,
    bedrooms: dto.bedrooms,
    bathrooms: dto.bathrooms,
    monthlyRent: dto.monthlyRent,
    dailyRate: dto.dailyRate ?? undefined,
    propertyType: dto.propertyType,
    stayType: dto.stayType,
    cancellationPolicy: dto.cancellationPolicy,
    amenities: dto.amenities ?? '',
  });

  const set = <K extends keyof NewListingInput>(key: K, value: NewListingInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const hasPhotos = Boolean(dto.photoPaths?.trim());

  const generate = async () => {
    setAiError(null);
    setGenerating(true);
    try {
      setSuggestion(await generateListingCopy(dto.propertyId));
    } catch (err) {
      setAiError(aiErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  };

  // Highlights are marketing bullets with no field of their own — fold them
  // into the description; nothing persists until the host saves the form.
  const suggestedDescription = (s: ListingCopySuggestion) =>
    s.highlights.length > 0
      ? `${s.description}\n\n${s.highlights.map((h) => `• ${h}`).join('\n')}`
      : s.description;

  const applyTitle = () => { if (suggestion) set('title', suggestion.title); };
  const applyDescription = () => { if (suggestion) set('description', suggestedDescription(suggestion)); };
  const applyAll = () => {
    if (!suggestion) return;
    setForm((f) => ({ ...f, title: suggestion.title, description: suggestedDescription(suggestion) }));
    setSuggestion(null);
  };

  const canSubmit =
    form.title.trim().length > 0 &&
    form.description.trim().length > 0 &&
    form.location.trim().length > 0 &&
    form.monthlyRent > 0 &&
    !saving;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSaving(true);
    try {
      const listing = await updateListing(dto.propertyId, {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        amenities: form.amenities?.trim(),
        latitude: dto.latitude,
        longitude: dto.longitude,
      });
      onUpdated(listing);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <ListingFields form={form} set={set} autoFocusTitle />

      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => void generate()}
          disabled={generating || saving || !hasPhotos}
        >
          <span className="flex items-center gap-1.5">
            <SparkleIcon size={15} />
            {generating ? 'Writing your listing…' : 'Write it for me'}
          </span>
        </Button>
        {!hasPhotos && (
          <p className="mt-1 text-xs text-muted">
            Upload photos first — the AI writes from your pictures.
          </p>
        )}
        {aiError && (
          <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600" role="alert">
            {aiError}
          </p>
        )}
      </div>

      {suggestion && (
        <ListingCopySuggestionCard
          suggestion={suggestion}
          onApplyTitle={applyTitle}
          onApplyDescription={applyDescription}
          onApplyAll={applyAll}
          onDismiss={() => setSuggestion(null)}
        />
      )}

      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}

/** Edit form for an existing listing, pre-filled from the backend record. */
export default function EditListingModal({ listingId, onClose, onUpdated }: EditListingModalProps) {
  const state = useAsync(() => getListingProperty(listingId), [listingId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Edit listing"
    >
      <Card className="my-8 w-full max-w-xl p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">Edit listing</h2>
            <p className="mt-0.5 text-sm text-muted">
              Changes are saved to your live listing right away.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xl leading-none text-muted transition-colors hover:bg-gray-100 hover:text-ink"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <AsyncBoundary
          state={state}
          loadingMessage="Loading listing…"
          errorMessage="Couldn't load this listing."
        >
          {(dto) => <EditForm dto={dto} onClose={onClose} onUpdated={onUpdated} />}
        </AsyncBoundary>
      </Card>
    </div>
  );
}
