import type { NotificationType } from '../../types';
import { getNotifications } from '../../api/notifications';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import Card from '../../components/ui/Card';
import {
  CalendarIcon, CardIcon, ToolIcon, MessageIcon, ShieldIcon,
} from '../../components/tenant/icons';

const ICONS: Record<NotificationType, React.ReactNode> = {
  booking: <CalendarIcon size={18} />,
  payment: <CardIcon size={18} />,
  maintenance: <ToolIcon size={18} />,
  message: <MessageIcon size={18} />,
  safety: <ShieldIcon size={18} />,
};

export default function NotificationsPage() {
  const state = useAsync(getNotifications, []);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold text-ink">Notifications</h1>

      <AsyncBoundary
        state={state}
        loadingMessage="Loading notifications…"
        errorMessage="Failed to load notifications."
        emptyMessage="You're all caught up."
        isEmpty={(rows) => rows.length === 0}
      >
        {(rows) => (
          <Card className="divide-y divide-gray-100 overflow-hidden">
            {rows.map((n) => (
              <div key={n.id} className={`flex gap-3 px-5 py-4 ${n.read ? '' : 'bg-brand-50/40'}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
                  {ICONS[n.type]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-ink">{n.title}</p>
                    <span className="shrink-0 text-xs text-muted">{n.time}</span>
                  </div>
                  <p className="text-sm text-muted">{n.body}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />}
              </div>
            ))}
          </Card>
        )}
      </AsyncBoundary>
    </div>
  );
}
