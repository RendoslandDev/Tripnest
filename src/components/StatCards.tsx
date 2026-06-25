import type { StatCard } from '../types';

interface Props {
  cards: StatCard[];
  onActiveBookingsClick: () => void;
  onSavedPropertiesClick: () => void;
  onMaintenanceClick: () => void;
}

export default function StatCards({ cards, onActiveBookingsClick, onSavedPropertiesClick, onMaintenanceClick }: Props) {
  return (
    <div className="toprow">
      {cards.map((card) => (
        <div key={card.label} className={`stat-card${card.alert ? ' stat-card--alert' : ''}`}>
          <p className="stat-label">
            <i className={`ti ${card.icon}`}></i> {card.label}
          </p>
          <h3 className={`stat-num${card.alert ? ' stat-num--red' : ''}`}>{card.value}</h3>
          {card.sub && <p className="stat-sub">{card.sub}</p>}
          {card.link && (
            
             <a className={`stat-link${card.alert ? ' stat-link--red' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={
                card.label === 'Active Bookings'   ? onActiveBookingsClick :
                card.label === 'Saved Properties'  ? onSavedPropertiesClick :
                card.label === 'Open Maintenance'  ? onMaintenanceClick :
                undefined
              }
            >
              {card.link}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}