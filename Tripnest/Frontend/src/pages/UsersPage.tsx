import { useState } from 'react';
import type { TeamRole, TeamUser, TeamUserStatus } from '../types';
import { getTeamUsers } from '../api/teamUsers';
import { useAsync } from '../hooks/useAsync';
import AsyncBoundary from '../components/AsyncBoundary';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge, { type BadgeTone } from '../components/ui/Badge';

const STATUS_TONE: Record<TeamUserStatus, BadgeTone> = {
  active: 'green',
  invited: 'amber',
  suspended: 'red',
};

const ROLE_LABEL: Record<TeamRole, string> = {
  owner: 'Owner',
  'co-host': 'Co-host',
  cleaner: 'Cleaner',
  maintenance: 'Maintenance',
  agent: 'Agent',
};

const ROLES: TeamRole[] = ['co-host', 'cleaner', 'maintenance', 'agent'];

function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

function InviteForm({ onInvite }: { onInvite: (name: string, email: string, role: TeamRole) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamRole>('co-host');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onInvite(name.trim(), email.trim(), role);
    setName('');
    setEmail('');
    setRole('co-host');
    setOpen(false);
  };

  if (!open) return <Button onClick={() => setOpen(true)}>Invite user</Button>;

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email"
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand" />
      <select value={role} onChange={(e) => setRole(e.target.value as TeamRole)}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand">
        {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
      </select>
      <Button type="submit" size="sm">Send invite</Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
    </form>
  );
}

function UsersView({ initial }: { initial: TeamUser[] }) {
  const [users, setUsers] = useState(initial);

  const invite = (name: string, email: string, role: TeamRole) =>
    setUsers((us) => [
      { id: `u-${Date.now()}`, name, email, role, status: 'invited', initials: initials(name), lastActive: 'Just now', properties: 0 },
      ...us,
    ]);

  // Owners can't be suspended; everyone else toggles active <-> suspended.
  const toggleManage = (id: string) =>
    setUsers((us) =>
      us.map((u) =>
        u.id === id && u.role !== 'owner'
          ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' }
          : u,
      ),
    );

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold text-ink">Users</h1>
        <InviteForm onInvite={invite} />
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-muted">
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Properties</th>
              <th className="px-6 py-3 font-semibold">Last active</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{u.name}</p>
                      <p className="truncate text-sm text-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-ink">{ROLE_LABEL[u.role]}</td>
                <td className="px-6 py-4">
                  <Badge tone={STATUS_TONE[u.status]}>{u.status}</Badge>
                </td>
                <td className="px-6 py-4 text-ink">{u.properties}</td>
                <td className="px-6 py-4 text-muted">{u.lastActive}</td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleManage(u.id)}
                    disabled={u.role === 'owner'}
                  >
                    {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export default function UsersPage() {
  const state = useAsync(getTeamUsers, []);

  return (
    <AsyncBoundary
      state={state}
      loadingMessage="Loading users…"
      errorMessage="Failed to load users."
      emptyMessage="No users yet."
      isEmpty={(rows) => rows.length === 0}
    >
      {(rows) => <UsersView initial={rows} />}
    </AsyncBoundary>
  );
}
