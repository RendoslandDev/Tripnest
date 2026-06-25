import type { MaintenanceItem } from '../types';

interface Props {
  items: MaintenanceItem[];
  onViewAll: () => void;
}

function badgeClass(status: string): string {
  if (status === 'Pending')     return 'badge badge--amber';
  if (status === 'In Progress') return 'badge badge--blue';
  return 'badge badge--green';
}

export default function MaintenanceTracker({ items, onViewAll }: Props) {
  const pending      = items.filter((i) => i.status === 'Pending').length;
  const inProgress   = items.filter((i) => i.status === 'In Progress').length;
  const resolved     = items.filter((i) => i.status === 'Resolved').length;
  const pendingItems = items.filter((i) => i.status === 'Pending');

  return (
    <div className="card">
      <div className="card-header">
        <h4>Maintenance Tracker</h4>
        <a className="view-all" style={{ cursor: 'pointer' }} onClick={onViewAll}>View all →</a>
      </div>
      <div className="maint-tabs">
        <span className="maint-tab maint-tab--amber">
          <i className="ti ti-clock"></i>{' '}Pending <strong>{pending}</strong>
        </span>
        <span className="maint-tab maint-tab--blue">
          <i className="ti ti-refresh"></i>{' '}In Progress <strong>{inProgress}</strong>
        </span>
        <span className="maint-tab maint-tab--green">
          <i className="ti ti-check"></i>{' '}Resolved <strong>{resolved}</strong>
        </span>
      </div>
      {pendingItems.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#6b7280' }}>No pending items.</p>
      ) : (
        pendingItems.map((item) => (
          <div key={item.id} className="maint-item">
            <div>
              <p>{item.description}</p>
              <small>Reported: {item.reportedDate}</small>
            </div>
            <span className={badgeClass(item.status)}>{item.status}</span>
          </div>
        ))
      )}
    </div>
  );
}