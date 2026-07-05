import { useEffect, useRef, useState } from 'react';
import type { Listing } from '../../types';
import { createListing, uploadListingPhotos, type NewListingInput } from '../../api/listings';
import { cacheListingPhotos } from '../../lib/listingPhotos';
import { generateWalkthroughClips } from '../../lib/walkthroughGenerator';
import Card from '../ui/Card';
import Button from '../ui/Button';

import ListingFields, { FieldLabel } from './ListingFormFields';

/**
 * Full add-property form posting to the real API. Renders as a trigger button
 * that opens a modal; calls onCreated with the saved listing so callers can
 * refresh their lists.
 */
interface PickedPhoto {
  file: File;
  preview: string; // object URL, revoked on removal/unmount
}

export default function AddListingModal({ onCreated }: { onCreated: (listing: Listing) => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  // Set when the listing saved but its photos didn't — blocks a duplicate resubmit.
  const [photosFailed, setPhotosFailed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<NewListingInput>({
    title: '',
    description: '',
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    monthlyRent: 0,
    dailyRate: undefined,
    propertyType: 'Apartment',
    stayType: 0,
    cancellationPolicy: 1,
    amenities: '',
  });

  const set = <K extends keyof NewListingInput>(key: K, value: NewListingInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Release preview object URLs when the modal unmounts.
  useEffect(() => () => {
    setPhotos((current) => {
      current.forEach((p) => URL.revokeObjectURL(p.preview));
      return current;
    });
  }, []);

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const picked = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setPhotos((p) => [...p, ...picked]);
    // Allow re-selecting the same files after a removal.
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (preview: string) => {
    setPhotos((p) => {
      const target = p.find((x) => x.preview === preview);
      if (target) URL.revokeObjectURL(target.preview);
      return p.filter((x) => x.preview !== preview);
    });
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
    let listing: Listing;
    try {
      listing = await createListing({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        amenities: form.amenities?.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the listing. Please try again.');
      setSaving(false);
      return;
    }
    try {
      if (photos.length > 0) {
        const files = photos.map((p) => p.file);
        await uploadListingPhotos(listing.id, files);
        await cacheListingPhotos(listing.id, files);
        // Kick off Veo walkthrough-video generation in the background; the
        // tour shows the photos (marked "generating") until clips land.
        void generateWalkthroughClips(listing.id, files);
      }
      onCreated(listing);
      setOpen(false);
    } catch (err) {
      // The listing exists; only the photos failed. Surface that without
      // letting a resubmit create a duplicate.
      onCreated(listing);
      setPhotosFailed(true);
      setError(
        err instanceof Error
          ? `Listing created, but the photos could not be uploaded: ${err.message}`
          : 'Listing created, but the photos could not be uploaded. You can add them later.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <Button variant="dark" onClick={() => setOpen(true)}>
        + Add listing
      </Button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Add a new listing"
    >
      <Card className="my-8 w-full max-w-xl p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">Add a new listing</h2>
            <p className="mt-0.5 text-sm text-muted">
              Guests can book it as soon as it's published and verified.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-1 text-xl leading-none text-muted transition-colors hover:bg-gray-100 hover:text-ink"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <ListingFields form={form} set={set} autoFocusTitle />

          <div>
            <FieldLabel>Photos</FieldLabel>
            <p className="mb-2 text-xs text-muted">
              Add photos of every room — they power the listing gallery and the AI video
              walkthrough guests use to tour the property.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => addPhotos(e.target.files)}
              className="hidden"
              aria-label="Add listing photos"
            />
            <div className="flex flex-wrap gap-2">
              {photos.map((p) => (
                <div key={p.preview} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                  <img src={p.preview} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(p.preview)}
                    aria-label="Remove photo"
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs leading-none text-white hover:bg-black/80"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 text-muted transition-colors hover:border-brand hover:text-brand"
              >
                <span className="text-xl leading-none">+</span>
                <span className="text-[11px]">Add photos</span>
              </button>
            </div>
            {photos.length > 0 && (
              <p className="mt-1.5 text-xs text-muted">
                {photos.length} photo{photos.length === 1 ? '' : 's'} selected
              </p>
            )}
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            {photosFailed ? (
              <Button type="button" onClick={() => setOpen(false)}>
                Close
              </Button>
            ) : (
              <>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!canSubmit}>
                  {saving ? 'Creating…' : 'Create listing'}
                </Button>
              </>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
