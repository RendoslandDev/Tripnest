import { useState } from 'react';
import { currentUser } from '../../data/user';
import { useSession, signIn } from '../../store/authStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
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

function Confirmed({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2 text-sm text-ink">
      <CheckIcon size={15} className="text-brand" /> {label}
    </li>
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
      signIn({ ...session, name: form.name.trim() || session.name, email: form.email.trim() || session.email });
    }
    setEditing(false);
    setSaved(true);
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-ink">Profile</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]">
        {/* Identity card */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Card className="p-6 text-center shadow-sm">
            <div className="relative mx-auto w-fit">
              <Avatar name={form.name} size={112} className="text-3xl" />
              <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand text-white">
                <ShieldIcon size={14} />
              </span>
            </div>
            <p className="mt-3 text-xl font-bold text-ink">{firstName}</p>
            <p className="text-sm text-muted">{roleLabel} · TripNest member</p>

            <div className="mt-5 grid grid-cols-2 divide-x divide-gray-100 border-y border-gray-100 py-4">
              <div>
                <p className="text-lg font-bold text-ink">12</p>
                <p className="text-xs text-muted">Reviews</p>
              </div>
              <div>
                <p className="flex items-center justify-center gap-1 text-lg font-bold text-ink">
                  <StarIcon size={14} className="text-amber-400" /> 4.9
                </p>
                <p className="text-xs text-muted">Rating</p>
              </div>
            </div>

            <div className="mt-4 text-left">
              <p className="mb-2 text-sm font-semibold text-ink">{firstName}'s confirmed information</p>
              <ul className="space-y-1.5">
                <Confirmed label="Identity" />
                <Confirmed label="Email address" />
                <Confirmed label="Phone number" />
              </ul>
            </div>

            {!editing && (
              <Button className="mt-5 w-full" onClick={() => { setEditing(true); setSaved(false); }}>
                Edit profile
              </Button>
            )}
          </Card>
        </div>

        {/* About */}
        <div className="min-w-0">
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
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-ink">About {firstName}</h2>
                {saved && <p className="mt-1 text-sm font-medium text-brand">Profile updated</p>}
                <p className="mt-3 text-ink">{form.bio}</p>
                <div className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                  <InfoItem icon={<MapPinIcon size={18} />} label={`Lives in ${form.location}`} />
                  <InfoItem icon={<BadgeIcon size={18} />} label={`Speaks ${form.languages}`} />
                  <InfoItem icon={<ClockIcon size={18} />} label="Joined TripNest in 2025" />
                  <InfoItem icon={<ShieldIcon size={18} />} label={form.work} />
                  <InfoItem icon={<MailIcon size={18} />} label={form.email} />
                  <InfoItem icon={<PhoneIcon size={18} />} label={form.phone} />
                </div>
              </section>

              <section className="border-t border-gray-100 pt-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink">
                  <StarIcon size={18} className="text-amber-400" /> What hosts say about {firstName}
                </h3>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
