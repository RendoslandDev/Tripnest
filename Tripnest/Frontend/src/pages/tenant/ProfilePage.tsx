import { useState } from 'react';
import { currentUser } from '../../data/user';
import { useSession, updateSession } from '../../store/authStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import {
  ShieldIcon, CheckIcon, StarIcon, MapPinIcon, MailIcon, PhoneIcon, BadgeIcon, ClockIcon,
} from '../../components/tenant/icons';

function Field({ label, value, onChange, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
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

function InfoItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-muted">{icon}</span>
      <span className="text-sm text-ink">{label}</span>
    </div>
  );
}

function VerifiedChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand">
      <CheckIcon size={14} /> {label}
    </span>
  );
}

const REVIEWS = [
  { id: 1, name: 'Kwame Mensah', role: 'Agent', date: 'May 2025', text: 'Great communicator and respectful of the property. Would happily host again!' },
  { id: 2, name: 'Nana Adwoa', role: 'Caretaker', date: 'Apr 2025', text: 'Easy check-in and left the place spotless. A model TripNest guest.' },
];

export default function ProfilePage() {
  const session = useSession();
  const roleLabel = session ? session.role[0].toUpperCase() + session.role.slice(1) : currentUser.role;

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const baseName = session?.name ?? currentUser.name;
  const [form, setForm] = useState({
    name: baseName,
    email: session?.email ?? currentUser.email,
    phone: currentUser.phone,
    location: currentUser.location,
    work: 'Student at UMaT',
    languages: 'English, Twi',
    bio: `Hi, I'm ${baseName.split(' ')[0]}!  |\n I'm on TripNest to find safe, verified homes and connect with trusted hosts across Ghana.`,
  });

  const set = (key: keyof typeof form) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const firstName = form.name.split(' ')[0];

  const save = () => {
    if (session) {
      updateSession({ name: form.name.trim() || session.name, email: form.email.trim() || session.email });
    }
    setEditing(false);
    setSaved(true);
  };

  return (
    <div className="max-w-4xl">
      {/* Cover + identity header */}
      <div>
        <div className="relative h-40 overflow-hidden rounded-xl bg-gradient-to-r from-brand to-emerald-700 sm:h-48">
          <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/5" />
          <div className="absolute -left-12 -bottom-24 h-56 w-56 rounded-full bg-white/5" />
        </div>

        <div className="px-4 sm:px-8">
          <div className="relative -mt-14 w-fit">
            <Avatar name={form.name} size={112} className="text-3xl ring-4 ring-white" />
            <span className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand text-white">
              <ShieldIcon size={15} />
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-ink sm:text-3xl">{form.name}</h1>
                <Badge tone="green">✓ Verified</Badge>
              </div>
              <p className="mt-0.5 text-muted">{roleLabel} · {form.location}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink">
                <span className="flex items-center gap-1 font-semibold">
                  <StarIcon size={15} className="text-amber-400" /> 4.9 rating
                </span>
                <span className="text-muted">12 reviews</span>
                <span className="flex items-center gap-1 text-muted">
                  <ClockIcon size={14} /> Joined 2025
                </span>
              </div>
              {saved && <p className="mt-2 text-sm font-medium text-brand">Profile updated</p>}
            </div>
            {!editing && (
              <Button onClick={() => { setEditing(true); setSaved(false); }}>
                Edit profile
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {editing ? (
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold text-ink">Edit your profile</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" value={form.name} onChange={set('name')} />
              <Field label="Email" type="email" value={form.email} onChange={set('email')} />
              <Field label="Phone" value={form.phone} onChange={set('phone')} />
              <Field label="Location" value={form.location} onChange={set('location')} />
              <Field label="Work" value={form.work} onChange={set('work')} />
              <Field label="Languages" value={form.languages} onChange={set('languages')} />
            </div>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium text-ink">About you</span>
              <textarea
                value={form.bio}
                onChange={(e) => set('bio')(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
            <div className="mt-5 flex gap-2">
              <Button onClick={save}>Save changes</Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </Card>
        ) : (
          <>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-ink">About {firstName}</h2>
              <p className="mt-3 text-ink">{form.bio}</p>
              <div className="mt-4 grid grid-cols-1 gap-x-8 border-t border-gray-100 pt-3 sm:grid-cols-2">
                <InfoItem icon={<MapPinIcon size={18} />} label={`Lives in ${form.location}`} />
                <InfoItem icon={<BadgeIcon size={18} />} label={`Speaks ${form.languages}`} />
                <InfoItem icon={<ShieldIcon size={18} />} label={form.work} />
                <InfoItem icon={<MailIcon size={18} />} label={form.email} />
                <InfoItem icon={<PhoneIcon size={18} />} label={form.phone} />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <ShieldIcon size={18} className="text-brand" /> {firstName}'s confirmed information
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <VerifiedChip label="Identity" />
                <VerifiedChip label="Email address" />
                <VerifiedChip label="Phone number" />
              </div>
            </Card>

            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink">
                <StarIcon size={18} className="text-amber-400" /> What hosts say about {firstName}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {REVIEWS.map((r) => (
                  <Card key={r.id} className="p-5">
                    <p className="text-sm text-ink">"{r.text}"</p>
                    <div className="mt-4 flex items-center gap-3">
                      <Avatar name={r.name} size={40} />
                      <div>
                        <p className="text-sm font-semibold text-ink">{r.name}</p>
                        <p className="text-xs text-muted">{r.role} · {r.date}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
