import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar';
import { LogOutIcon, MailIcon, PlusIcon, TrashIcon } from '../../components/tenant/icons';
import { signOut, useSession } from '../../store/authStore';

const INPUT =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand';
const BTN_OUTLINE =
  'inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50';

const LockIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ size = 16, off = false }: { size?: number; off?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
    {off && <line x1="3" y1="3" x2="21" y2="21" />}
  </svg>
);

const GoogleIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.28V6.61H1.27a12 12 0 0 0 0 10.78l4.01-3.11z" />
    <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77z" />
  </svg>
);

const AnalyticsIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="13" width="4" height="7" rx="1.2" fill="#E37400" />
    <rect x="10" y="8" width="4" height="12" rx="1.2" fill="#F9AB00" />
    <rect x="16" y="3" width="4" height="17" rx="1.2" fill="#F9AB00" />
  </svg>
);

function SectionHeading({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="mt-0.5 text-sm text-muted">{desc}</p>
    </div>
  );
}

function PasswordField({ label }: { label: string }) {
  const [value, setValue] = useState('••••••••••');
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3.5 focus-within:border-brand">
        <span className="text-muted"><LockIcon /></span>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent px-2.5 py-2.5 text-sm text-ink outline-none"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="text-muted transition-colors hover:text-ink"
          aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          <EyeIcon off={show} />
        </button>
      </div>
    </label>
  );
}

function IntegrationRow({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 px-5 py-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink">{title}</span>
        <span className="block truncate text-sm text-muted">{desc}</span>
      </span>
      <span className="shrink-0 rounded-full border border-brand px-4 py-1.5 text-xs font-semibold text-brand">
        Connected
      </span>
    </div>
  );
}

export default function LandlordSettingsPage() {
  const navigate = useNavigate();
  const session = useSession();

  const [firstInitial = '', ...restName] = (session?.name ?? '').split(' ');
  const [firstName, setFirstName] = useState(firstInitial);
  const [lastName, setLastName] = useState(restName.join(' '));
  const [email, setEmail] = useState(session?.email ?? '');

  return (
    <div className="mx-auto max-w-3xl">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-xl font-semibold text-ink">Account</h1>
        <p className="mt-0.5 text-sm text-muted">
          Real-time information and activities of your property.
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {/* Profile picture */}
        <section className="flex flex-wrap items-center gap-5 py-8">
          <Avatar name={session?.name ?? 'TripNest Host'} size={88} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">Profile picture</p>
            <p className="text-sm text-muted">PNG, JPEG under 15MB</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button type="button" className={BTN_OUTLINE}>Upload new picture</button>
            <button type="button" className={BTN_OUTLINE}>Delete</button>
          </div>
        </section>

        {/* Full name */}
        <section className="py-8">
          <h2 className="mb-4 text-base font-semibold text-ink">Full name</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted">First name</span>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted">Last name</span>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={INPUT} />
            </label>
          </div>
        </section>

        {/* Contact email */}
        <section className="py-8">
          <SectionHeading title="Contact email" desc="Manage your account's email address for the invoices." />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <label className="block w-full sm:max-w-sm">
              <span className="mb-1.5 block text-sm text-muted">Email</span>
              <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3.5 focus-within:border-brand">
                <span className="text-muted"><MailIcon size={15} /></span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-2.5 py-2.5 text-sm text-ink outline-none"
                />
              </div>
            </label>
            <button type="button" className={BTN_OUTLINE}>
              <PlusIcon size={15} /> Add another email
            </button>
          </div>
        </section>

        {/* Password */}
        <section className="py-8">
          <SectionHeading title="Password" desc="Modify your current password." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PasswordField label="Current password" />
            <PasswordField label="New password" />
          </div>
        </section>

        {/* Integrated account */}
        <section className="py-8">
          <SectionHeading title="Integrated account" desc="Manage your current integrated accounts." />
          <div className="space-y-3">
            <IntegrationRow
              icon={<AnalyticsIcon />}
              title="Google analytics"
              desc="Navigate the Google Analytics interface and reports."
            />
            <IntegrationRow
              icon={<GoogleIcon />}
              title="Google"
              desc="Use Google for the faster login methods in your account."
            />
          </div>
        </section>

        {/* Account security */}
        <section className="py-8">
          <SectionHeading title="Account security" desc="Manage your account security." />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={BTN_OUTLINE}
              onClick={() => {
                signOut();
                navigate('/welcome');
              }}
            >
              <LogOutIcon size={15} /> Log out
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
            >
              <TrashIcon size={15} /> Delete my account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
