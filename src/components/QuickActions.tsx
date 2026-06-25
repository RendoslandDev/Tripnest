import type { QuickAction } from '../types';

interface Props { actions: QuickAction[]; }

export default function QuickActions({ actions }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <h4>Quick Actions</h4>
      </div>
      <div className="quick-list">
        {actions.map((action) => (
          <div key={action.label} className="quick-item" style={{ cursor: 'pointer' }}>
            <i className={`ti ${action.icon}`}></i>
            {action.label}
            {action.badgeCount !== undefined && (
              <span className={`badge badge--${action.badgeColor ?? 'red'} quick-badge`}>
                {action.badgeCount}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}