import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import { LogOutIcon } from '../../components/tenant/icons';

function ToggleRow({
  label, desc, value, onChange,
}: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="font-medium text-ink">{label}</p>
        <p className="text-sm text-muted">{desc}</p>
      </div>
      <Toggle on={value} onChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  const [prefs, setPrefs] = useState({ email: true, sms: true, push: false });
  const set = (key: keyof typeof prefs) => (value: boolean) =>
    setPrefs((p) => ({ ...p, [key]: value }));

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-ink">Settings</h1>

      <Card className="p-6">
        <h2 className="mb-2 text-lg font-bold text-ink">Notifications</h2>
        <div className="divide-y divide-gray-100">
          <ToggleRow label="Email notifications" desc="Booking and payment updates by email" value={prefs.email} onChange={set('email')} />
          <ToggleRow label="SMS safety alerts" desc="Instant safety alerts by SMS" value={prefs.sms} onChange={set('sms')} />
          <ToggleRow label="Push notifications" desc="Alerts on your device" value={prefs.push} onChange={set('push')} />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-bold text-ink">Preferences</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Language</span>
            <select className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand">
              <option>English</option>
              <option>Twi</option>
              <option>Ga</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Currency</span>
            <select className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand">
              <option>GH₵ (Cedi)</option>
              <option>USD</option>
            </select>
          </label>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-bold text-ink">Account</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost">Change password</Button>
          <Button variant="ghost" className="text-rose-600 hover:bg-rose-50">
            <LogOutIcon size={16} /> <span className="ml-1.5">Log out</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
