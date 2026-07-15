import { useEffect, useRef } from 'react';
import { signInWithGoogle, type Session } from '../store/authStore';

const GOOGLE_CLIENT_ID = (import.meta.env as Record<string, string | undefined>).VITE_GOOGLE_CLIENT_ID;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (opts: { client_id: string; callback: (r: { credential: string }) => void }) => void;
          renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
        };
      };
    };
  }
}

/**
 * Social sign-in options. Google is fully wired and lights up the moment VITE_GOOGLE_CLIENT_ID
 * (and the matching backend GoogleAuth:ClientId) are set; Apple/Facebook are placeholders until
 * their providers are configured.
 */
export default function SocialSignIn({ onSignedIn }: { onSignedIn: (s: Session) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const init = () => {
      const g = window.google;
      if (!g || !ref.current) return;
      g.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (resp) => {
          try {
            const session = await signInWithGoogle(resp.credential);
            onSignedIn(session);
          } catch { /* surfaced by the caller's error handling if needed */ }
        },
      });
      g.accounts.id.renderButton(ref.current, { theme: 'outline', size: 'large', width: 320, text: 'continue_with' });
    };

    if (window.google) { init(); return; }
    let script = document.getElementById('google-gsi') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'google-gsi';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', init);
    return () => script?.removeEventListener('load', init);
  }, [onSignedIn]);

  // Nothing to show until a provider is configured — keep the auth screen clean.
  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-muted">or continue with</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>
      <div ref={ref} className="flex justify-center" />
    </div>
  );
}
