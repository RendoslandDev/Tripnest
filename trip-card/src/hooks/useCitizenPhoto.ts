import { useEffect, useState } from 'react'
import { api } from '../api/client'

// Photos are served behind JWT auth, so <img src> can't hit the API directly.
// Fetch once per citizen and cache the object URL for the session.
const photoCache = new Map<string, Promise<string | null>>()

function loadPhoto(citizenId: string): Promise<string | null> {
  let cached = photoCache.get(citizenId)
  if (!cached) {
    cached = api.citizens
      .photoBlob(citizenId)
      .then(blob => URL.createObjectURL(blob))
      .catch(() => null)
    photoCache.set(citizenId, cached)
  }
  return cached
}

export function useCitizenPhoto(citizenId?: string, hasPhoto = true): string | null {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!citizenId || !hasPhoto) return
    let alive = true
    loadPhoto(citizenId).then(u => { if (alive) setUrl(u) })
    return () => { alive = false }
  }, [citizenId, hasPhoto])

  return url
}
