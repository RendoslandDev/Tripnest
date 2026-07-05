import type { PropertyTour, TourChapter, TourSegment } from '../types';
import { properties } from '../data/properties';
import { buildTour } from '../data/tours';
import { getPropertyById } from './properties';
import { getClipsForProperty } from '../lib/clipStore';

// Service layer for property virtual tours. The tour is derived from the
// property (walkthrough video metadata, including generation status, rides
// inside PropertyTour). Live listings are fetched from the backend so their
// uploaded photos feed the walkthrough; demo listings fall back to mock data.
// Veo-generated clips stored in this browser upgrade photo rooms to video.

// Blob object URLs handed out per tour, so VirtualTour can release them on
// close instead of leaking one URL per generated clip per open.
const tourUrls = new Map<string, string[]>();

export function releaseTourMedia(propertyId: string): void {
  tourUrls.get(propertyId)?.forEach((url) => URL.revokeObjectURL(url));
  tourUrls.delete(propertyId);
}

export async function getPropertyTour(id: string): Promise<PropertyTour | undefined> {
  const property = (await getPropertyById(id)) ?? properties.find((p) => p.id === id);
  if (!property) return undefined;
  const tour = buildTour(property);

  // Overlay locally generated walkthrough clips (photo index i → room i,
  // matching buildTour's photo assignment). Authored ready clips win.
  releaseTourMedia(property.id); // a re-open replaces the previous URL set
  try {
    const generated = await getClipsForProperty(property.id);
    if (generated.size > 0) {
      const urls: string[] = [];
      tour.rooms = tour.rooms.map((room, i) => {
        const clip = generated.get(i);
        if (!clip || room.clip?.status === 'ready') return room;
        const url = URL.createObjectURL(clip.blob);
        urls.push(url);
        return {
          ...room,
          clip: {
            url,
            status: 'ready' as const,
            provider: clip.provider ?? 'local',
            // WebM from MediaRecorder often lacks duration metadata, so
            // carry the nominal length for progress/synthesis math.
            durationSec: 8,
            sourcePhotos: clip.sourcePhoto ? [clip.sourcePhoto] : room.clip?.sourcePhotos,
            generatedAt: clip.generatedAt,
          },
        };
      });
      tourUrls.set(property.id, urls);
    }
  } catch {
    // IndexedDB unavailable (private mode etc.) — photos still show.
  }

  // No authored full video but enough per-room clips: synthesize the
  // continuous walkthrough as a sequential playlist with chapters.
  if (!tour.fullVideo) {
    const readyRooms = tour.rooms.filter((r) => r.clip?.status === 'ready' && r.clip.url);
    if (readyRooms.length >= 2) {
      const segments: TourSegment[] = [];
      const chapters: TourChapter[] = [];
      let start = 0;
      for (const room of readyRooms) {
        const durationSec = room.clip?.durationSec ?? 8; // Veo clips are 8s
        segments.push({ roomId: room.id, url: room.clip!.url!, durationSec });
        chapters.push({ roomId: room.id, startSec: start });
        start += durationSec;
      }
      tour.fullVideo = {
        status: 'ready',
        provider: 'google-flow',
        durationSec: start,
        chapters,
        segments,
      };
    }
  }
  return tour;
}
