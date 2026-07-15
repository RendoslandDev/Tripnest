import { apiGet, apiPut, apiUpload } from './client';

// Own-profile endpoints (api/profile). Email is not editable server-side; the
// PUT accepts name/phone/bio/username/preferredLanguage only.

export interface ProfileMeDto {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: number;
  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  tripNestId?: string | null;
  profilePhotoPath?: string | null;
  username?: string | null;
  bio?: string | null;
}

export function getMyProfile(): Promise<ProfileMeDto> {
  return apiGet<ProfileMeDto>('/api/profile/me');
}

export interface UpdateProfileInput {
  fullName?: string;
  phone?: string;
  bio?: string;
  username?: string;
  /** Language: 0 English, 1 Twi, 2 Ga, 3 French. */
  preferredLanguage?: number;
}

export function updateMyProfile(patch: UpdateProfileInput): Promise<unknown> {
  return apiPut('/api/profile/me', patch);
}

/** Returns the stored photo path (servable once Core exposes /uploads). */
export async function uploadProfilePhoto(photo: File): Promise<string> {
  const form = new FormData();
  form.append('photo', photo);
  const res = await apiUpload<{ photoPath: string }>('/api/profile/photo', form);
  return res.photoPath;
}
