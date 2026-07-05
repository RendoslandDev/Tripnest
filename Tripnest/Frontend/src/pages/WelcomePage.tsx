import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { login, register, useSession, type Role } from '../store/authStore';
import { HexIcon, UserIcon, KeyIcon, ShieldIcon, StarIcon } from '../components/tenant/icons';

// Poster-style background tiles (Ghanaian cities), echoing the inspiration wall.
const TILES: { city: string; from: string; to: string }[] = [
  { city: 'Tarkwa', from: '#0f5132', to: '#34d399' },
  { city: 'Accra', from: '#1e3a8a', to: '#60a5fa' },
  { city: 'Kumasi', from: '#9d174d', to: '#fb7185' },
  { city: 'Takoradi', from: '#7c2d12', to: '#fbbf24' },
  { city: 'Cape Coast', from: '#155e75', to: '#22d3ee' },
  { city: 'Tamale', from: '#4c1d95', to: '#a78bfa' },
  { city: 'Ho', from: '#065f46', to: '#6ee7b7' },
  { city: 'Sunyani', from: '#92400e', to: '#fcd34d' },
  { city: 'Koforidua', from: '#1e40af', to: '#93c5fd' },
  { city: 'Wa', from: '#831843', to: '#f9a8d4' },
  { city: 'Sekondi', from: '#0c4a6e', to: '#7dd3fc' },
  { city: 'Obuasi', from: '#3f6212', to: '#bef264' },
  { city: 'Tema', from: '#581c87', to: '#d8b4fe' },
  { city: 'Aburi', from: '#14532d', to: '#86efac' },
  { city: 'Elmina', from: '#9a3412', to: '#fdba74' },
  { city: 'Bolga', from: '#0f766e', to: '#5eead4' },
  { city: 'Axim', from: '#1d4ed8', to: '#bfdbfe' },
  { city: 'Nkawkaw', from: '#a16207', to: '#fde68a' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A poster tile showing a real photo, with a gradient fallback + city label. */
function Tile({ city, from, to }: { city: string; from: string; to: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5"
      style={{ backgroundImage: `linear-gradient(150deg, ${from}, ${to})` }}
    >
      <img
        src={`https://picsum.photos/seed/tripnest-${encodeURIComponent(city)}/440/560`}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
        <span className="text-sm font-bold uppercase tracking-wide text-white drop-shadow">{city}</span>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 8.5-20.5l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C39.9 36 44 30.6 44 24a20 20 0 0 0-.4-3.5z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M16.37 1.43c.08 1-.32 1.98-.95 2.69-.66.74-1.74 1.31-2.79 1.23-.1-.98.37-2 .96-2.64.66-.73 1.82-1.28 2.78-1.28zM20.4 17.2c-.55 1.27-.82 1.84-1.53 2.96-.99 1.57-2.39 3.53-4.12 3.54-1.54.02-1.94-1-4.03-.99-2.1.01-2.53 1.01-4.07.99-1.73-.01-3.05-1.78-4.04-3.35-2.77-4.4-3.06-9.56-1.35-12.3 1.21-1.95 3.12-3.09 4.92-3.09 1.83 0 2.98 1 4.49 1 1.47 0 2.36-1 4.48-1 1.6 0 3.3.87 4.51 2.38-3.96 2.17-3.32 7.83.26 9.86z" />
    </svg>
  );
}

function RoleOption({ active, icon, title, desc, onClick }: {
  active: boolean; icon: React.ReactNode; title: string; desc: string; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-1 items-start gap-2.5 rounded-xl border p-3 text-left transition-colors ${
        active ? 'border-brand bg-brand-50' : 'border-gray-200 hover:bg-gray-50'
      }`}
    >
      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'}`}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className={`block text-sm font-semibold ${active ? 'text-brand' : 'text-ink'}`}>{title}</span>
        <span className="block text-xs text-muted">{desc}</span>
      </span>
    </button>
  );
}

export default function WelcomePage() {
  const navigate = useNavigate();
  const session = useSession();
  // Deep links from marketing surfaces (e.g. /welcome?mode=signup&role=landlord).
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'signin' | 'signup'>(
    params.get('mode') === 'signup' ? 'signup' : 'signin',
  );
  const [role, setRole] = useState<Role>(params.get('role') === 'landlord' ? 'landlord' : 'tenant');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed in → straight to the right surface.
  if (session) return <Navigate to={session.role === 'landlord' ? '/landlord' : '/'} replace />;

  const continueEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const addr = email.trim().toLowerCase();
    if (!EMAIL_RE.test(addr)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Enter your password (at least 6 characters).');
      return;
    }
    if (mode === 'signup' && (!fullName.trim() || !phone.trim())) {
      setError('Enter your full name and phone number.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const next = mode === 'signup'
        ? await register({ fullName: fullName.trim(), email: addr, password, phone: phone.trim(), role })
        : await login(addr, password);
      navigate(next.role === 'landlord' ? '/landlord' : '/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Is the TripNest API running?');
    } finally {
      setBusy(false);
    }
  };

  const social = () => setError('Social sign-in is not connected yet — use your email and password.');

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink">
      {/* Poster grid of real photos */}
      <div aria-hidden className="absolute inset-0 grid h-full auto-rows-fr grid-cols-3 gap-3 p-3 sm:grid-cols-4 lg:grid-cols-6">
        {TILES.map((t) => <Tile key={t.city} {...t} />)}
      </div>
      {/* Legibility wash + brand glow */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-ink/65 via-ink/40 to-brand/45" />
      <div aria-hidden className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Brand mark */}
      <div className="relative flex items-center gap-2 p-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand shadow-lg">
          <HexIcon size={20} />
        </span>
        <span className="text-lg font-bold text-white drop-shadow">TripNest</span>
      </div>

      {/* Card */}
      <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 pb-10">
        <div className="tn-card-in w-full max-w-md overflow-hidden rounded-[28px] bg-white/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/60 backdrop-blur-xl">
          <div className="h-1.5 bg-gradient-to-r from-brand via-emerald-400 to-brand" />
          <div className="p-6 sm:p-8">
          <div className="mb-5 text-center">
            <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-emerald-500 text-white shadow-lg">
              <HexIcon size={28} />
            </span>
            <h1 className="text-2xl font-bold text-ink">Welcome to TripNest</h1>
            <p className="mt-1 text-sm text-muted">Find · Stay · Thrive — verified homes across Ghana.</p>
            <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1"><ShieldIcon size={13} className="text-brand" /> Verified listings</span>
              <span className="flex items-center gap-1">
                <StarIcon size={13} className="text-amber-400" /> 4.9 · 1,200+ homes
              </span>
            </div>
          </div>

          {/* Role choice */}
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">I want to</p>
          <div className="mb-5 flex gap-3">
            <RoleOption
              active={role === 'tenant'}
              icon={<UserIcon size={16} />}
              title="Rent a home"
              desc="Find & book places"
              onClick={() => setRole('tenant')}
            />
            <RoleOption
              active={role === 'landlord'}
              icon={<KeyIcon size={16} />}
              title="List a property"
              desc="Host & earn"
              onClick={() => setRole('landlord')}
            />
          </div>

          {/* Email + password */}
          <form onSubmit={continueEmail} className="space-y-3">
            {mode === 'signup' && (
              <>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setError(null); }}
                  placeholder="Full name"
                  aria-label="Full name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(null); }}
                  placeholder="Phone (e.g. 024 123 4567)"
                  aria-label="Phone number"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand"
                />
              </>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="Email address"
              aria-label="Email address"
              className={`w-full rounded-xl border px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand ${
                error ? 'border-rose-400' : 'border-gray-300'
              }`}
            />
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder="Password"
                aria-label="Password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand ${
                  error ? 'border-rose-400' : 'border-gray-300'
                }`}
              />
              {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
            <p className="text-center text-xs text-muted">
              {mode === 'signup' ? 'Already have an account?' : 'New to TripNest?'}{' '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(null); }}
                className="font-semibold text-brand"
              >
                {mode === 'signup' ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3 text-xs font-medium text-muted">
            <span className="h-px flex-1 bg-gray-200" /> or <span className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Social */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={social}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gray-50"
            >
              <GoogleMark /> Continue with Google
            </button>
            <button
              type="button"
              onClick={social}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gray-50"
            >
              <AppleMark /> Continue with Apple
            </button>
          </div>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-muted">
            By continuing you agree to TripNest's{' '}
            <a href="#" className="font-semibold text-brand no-underline">Terms</a> and{' '}
            <a href="#" className="font-semibold text-brand no-underline">Privacy Policy</a>.
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
