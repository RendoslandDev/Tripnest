import { apiDelete, apiGet, apiUpload } from './client';

// Walkthrough video endpoints on TripNest.Core. Quirks the UI must respect:
// video bytes are unreachable today (no static serving / streaming endpoint),
// thumbnailUrl and durationSeconds are never populated, and review status is
// Agent/Admin-only — landlords can only see that videos were submitted.

export interface WalkthroughResponseDto {
  walkthroughId: string;
  propertyId: string;
  title: string;
  videoPath: string; // dead path until Core serves /uploads
  thumbnailUrl: string | null; // always null
  durationSeconds: number; // always 0
  createdAt: string;
}

export function getWalkthroughs(propertyId: string): Promise<WalkthroughResponseDto[]> {
  return apiGet<WalkthroughResponseDto[]>(`/api/properties/${propertyId}/walkthroughs`);
}

/** Upload a generated clip for review (owner only). */
export function uploadWalkthrough(
  propertyId: string,
  title: string,
  video: Blob,
): Promise<WalkthroughResponseDto> {
  const form = new FormData();
  form.append('title', title);
  // Extension must match the backend's allowlist (.mp4/.webm both pass).
  const webm = video.type.includes('webm');
  form.append('videoFile', new File(
    [video],
    webm ? 'walkthrough.webm' : 'walkthrough.mp4',
    { type: video.type || 'video/mp4' },
  ));
  return apiUpload<WalkthroughResponseDto>(`/api/properties/${propertyId}/walkthrough`, form);
}

export function deleteWalkthrough(propertyId: string, walkthroughId: string): Promise<unknown> {
  return apiDelete(`/api/properties/${propertyId}/walkthroughs/${walkthroughId}`);
}
