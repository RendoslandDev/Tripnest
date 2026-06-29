import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import { CardIcon, LogOutIcon } from '../../components/tenant/icons';
import { signOut } from '../../store/authStore';

function ToggleRow({ label, desc, value, onChange }: {
  label: string; desc: string; value: boolean; onChange: (v: boolean) => void;
}) {
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

export default function LandlordSettingsPage() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({ inquiries: true, bookings: true, payouts: true, reviews: false });
  const [autoAccept, setAutoAccept] = useState(false);
  const [saved, setSaved] = useState(false);
  const [payout, setPayout] = useState('MTN MoMo');
  const [editingPayout, setEditingPayout] = useState(false);
  const set = (k: keyof typeof prefs) => (v: boolean) => { setPrefs((p) => ({ ...p, [k]: v })); setSaved(false); };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-ink">Settings</h1>

      <Card className="p-6">
        <h2 className="mb-2 text-lg font-bold text-ink">Notifications</h2>
        <div className="divide-y divide-gray-100">
          <ToggleRow label="New inquiries" desc="Alert me when a guest sends a message" value={prefs.inquiries} onChange={set('inquiries')} />
          <ToggleRow label="Booking requests" desc="Alert me about new and changed bookings" value={prefs.bookings} onChange={set('bookings')} />
          <ToggleRow label="Payout updates" desc="Notify me when a payout is sent" value={prefs.payouts} onChange={set('payouts')} />
          <ToggleRow label="New reviews" desc="Notify me when a guest leaves a review" value={prefs.reviews} onChange={set('reviews')} />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-2 text-lg font-bold text-ink">Hosting</h2>
        <ToggleRow label="Instant Book" desc="Let trusted guests book without approval" value={autoAccept} onChange={(v) => { setAutoAccept(v); setSaved(false); }} />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-bold text-ink">Payout method</h2>
        <div className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand"><CardIcon size={16} /></span>
          {editingPayout ? (
            <select
              autoFocus
              value={payout}
              onChange={(e) => { setPayout(e.target.value); setEditingPayout(false); }}
              className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-brand"
            >
              <option>MTN MoMo</option>
              <option>Telecel Cash</option>
              <option>AirtelTigo Money</option>
              <option>Bank transfer</option>
            </select>
          ) : (
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-ink">{payout}</span>
              <span className="block text-xs text-muted">•••• 4567 · default</span>
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={() => setEditingPayout((v) => !v)}>
            {editingPayout ? 'Cancel' : 'Change'}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-bold text-ink">Account</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setSaved(true)}>Save changes</Button>
          {saved && <span className="text-sm font-medium text-brand">Saved</span>}
          <Button variant="ghost" className="text-rose-600 hover:bg-rose-50" onClick={() => { signOut(); navigate('/welcome'); }}>
            <LogOutIcon size={16} /> <span className="ml-1.5">Log out</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
