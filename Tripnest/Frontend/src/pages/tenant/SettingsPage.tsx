import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import {
  BellIcon,
  SettingsIcon,
  KeyIcon,
  LogOutIcon,
  ChevronRightIcon,
} from '../../components/tenant/icons';
import { signOut } from '../../store/authStore';

function SectionHeader({
  icon, title, desc,
}: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-gray-100 px-6 py-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand">
        {icon}
      </span>
      <div>
        <h2 className="text-base font-bold text-ink">{title}</h2>
        <p className="text-sm text-muted">{desc}</p>
      </div>
    </div>
  );
}

function ToggleRow({
  label, desc, value, onChange,
}: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="font-medium text-ink">{label}</p>
        <p className="text-sm text-muted">{desc}</p>
      </div>
      <Toggle on={value} onChange={onChange} />
    </div>
  );
}

const SELECT_CLASS =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({ email: true, sms: true, push: false });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const set = (key: keyof typeof prefs) => (value: boolean) =>
    setPrefs((p) => ({ ...p, [key]: value }));

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(false);
    setPasswordSaved(true);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Settings</h1>
        <p className="mt-1 text-muted">Manage your account and preferences</p>
      </div>

      <Card className="overflow-hidden">
        <SectionHeader
          icon={<BellIcon size={20} />}
          title="Notifications"
          desc="Choose how TripNest keeps you in the loop"
        />
        <div className="divide-y divide-gray-100 px-6 py-2">
          <ToggleRow label="Email notifications" desc="Booking and payment updates by email" value={prefs.email} onChange={set('email')} />
          <ToggleRow label="SMS safety alerts" desc="Instant safety alerts by SMS" value={prefs.sms} onChange={set('sms')} />
          <ToggleRow label="Push notifications" desc="Alerts on your device" value={prefs.push} onChange={set('push')} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <SectionHeader
          icon={<SettingsIcon size={20} />}
          title="Preferences"
          desc="Language and currency used across the app"
        />
        <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Language</span>
            <select className={SELECT_CLASS}>
              <option>English</option>
              <option>Twi</option>
              <option>Ga</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Currency</span>
            <select className={SELECT_CLASS}>
              <option>GH₵ (Cedi)</option>
              <option>USD</option>
            </select>
          </label>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <SectionHeader
          icon={<KeyIcon size={20} />}
          title="Security"
          desc="Keep your account protected"
        />
        <div className="px-6 py-5">
          {changingPassword ? (
            <form onSubmit={savePassword} className="max-w-sm space-y-3">
              <input
                type="password"
                required
                placeholder="Current password"
                className={SELECT_CLASS}
              />
              <input
                type="password"
                required
                placeholder="New password"
                className={SELECT_CLASS}
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm">Update password</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setChangingPassword(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => { setChangingPassword(true); setPasswordSaved(false); }}
              className="flex w-full items-center justify-between rounded-lg py-1 text-left transition-colors hover:bg-gray-50"
            >   
              <div>
                <p className="font-medium text-ink">Change password</p>
                <p className="text-sm text-muted">
                  {passwordSaved ? 'Password updated' : 'Update your password regularly'}
                </p>
              </div>
              <ChevronRightIcon size={18} className="text-muted" />
            </button>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden border-rose-200">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-rose-600">Danger zone</h2>
            <p className="text-sm text-muted">Sign out of TripNest on this device</p>
          </div>
          <Button
            variant="ghost"
            className="border border-rose-200 text-rose-600 hover:bg-rose-50"
            onClick={() => { signOut(); navigate('/welcome'); }}
          >
            <LogOutIcon size={16} /> <span className="ml-1.5">Log out</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
