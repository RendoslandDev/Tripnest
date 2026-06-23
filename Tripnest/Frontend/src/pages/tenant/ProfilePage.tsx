import { useState } from 'react';
import { currentUser } from '../../data/user';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';

function Field({
  label, value, onChange, type = 'text',
}: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
      />
    </label>
  );
}

export default function ProfilePage() {
  const [form, setForm] = useState(currentUser);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof typeof form) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold text-ink">Profile</h1>

      <Card className="mb-6 flex items-center gap-4 p-5">
        <Avatar name={form.name} size={64} />
        <div>
          <p className="text-lg font-semibold text-ink">{form.name}</p>
          <p className="text-sm text-muted">{form.role} · {form.location}</p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name" value={form.name} onChange={set('name')} />
          <Field label="Email" type="email" value={form.email} onChange={set('email')} />
          <Field label="Phone" value={form.phone} onChange={set('phone')} />
          <Field label="Location" value={form.location} onChange={set('location')} />
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Button onClick={() => setSaved(true)}>Save changes</Button>
          {saved && <span className="text-sm font-medium text-brand">Saved</span>}
        </div>
      </Card>
    </div>
  );
}
