import { useState } from 'react';
import type { MaintenanceItem } from '../types';

interface Props {
  items: MaintenanceItem[];
  onBack: () => void;
}

function badgeClass(status: string): string {
  if (status === 'Pending')     return 'badge badge--amber';
  if (status === 'In Progress') return 'badge badge--blue';
  return 'badge badge--green';
}

export default function MaintenanceDetails({ items, onBack }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [newIssue, setNewIssue] = useState('');

  const pending    = items.filter((i) => i.status === 'Pending');
  const inProgress = items.filter((i) => i.status === 'In Progress');
  const resolved   = items.filter((i) => i.status === 'Resolved');

  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', color: '#1a1a1a' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <button
          onClick={onBack}
          style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '16px', flexShrink: 0 }}
        >
          <i className="ti ti-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 600, flex: 1 }}>Maintenance Tracker</h1>
      </div>

      {/* ── Summary card ── */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <span className="maint-tab maint-tab--amber">
            <i className="ti ti-clock"></i>{' '}Pending <strong>{pending.length}</strong>
          </span>
          <span className="maint-tab maint-tab--blue">
            <i className="ti ti-refresh"></i>{' '}In Progress <strong>{inProgress.length}</strong>
          </span>
          <span className="maint-tab maint-tab--green">
            <i className="ti ti-check"></i>{' '}Resolved <strong>{resolved.length}</strong>
          </span>
        </div>
        <div style={{ height: '6px', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ flex: pending.length || 1, background: '#faeeda' }}></div>
          <div style={{ flex: inProgress.length || 1, background: '#e6f1fb' }}></div>
          <div style={{ flex: resolved.length || 1, background: '#e1f5ee' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#6b7280' }}>
          <span>{pending.length} pending</span>
          <span>{inProgress.length} in progress</span>
          <span>{resolved.length} resolved</span>
        </div>
      </div>

      {/* ── Pending ── */}
      {pending.length > 0 && (
        <>
          <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '8px' }}>Pending</p>
          {pending.map((item) => (
            <div key={item.id} className="maint-item" style={{ marginBottom: '8px' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>{item.description}</p>
                <p style={{ fontSize: '11px', color: '#6b7280' }}>Reported: {item.reportedDate}</p>
              </div>
              <span className={badgeClass(item.status)}>{item.status}</span>
            </div>
          ))}
        </>
      )}

      {/* ── In Progress ── */}
      {inProgress.length > 0 && (
        <>
          <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '8px', marginTop: '12px' }}>In Progress</p>
          {inProgress.map((item) => (
            <div key={item.id} className="maint-item" style={{ marginBottom: '8px' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>{item.description}</p>
                <p style={{ fontSize: '11px', color: '#6b7280' }}>Reported: {item.reportedDate}</p>
              </div>
              <span className={badgeClass(item.status)}>{item.status}</span>
            </div>
          ))}
        </>
      )}

      {/* ── Resolved ── */}
      {resolved.length > 0 && (
        <>
          <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '8px', marginTop: '12px' }}>Resolved</p>
          {resolved.map((item) => (
            <div key={item.id} className="maint-item" style={{ marginBottom: '8px', opacity: 0.65 }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>{item.description}</p>
                <p style={{ fontSize: '11px', color: '#6b7280' }}>Reported: {item.reportedDate}</p>
              </div>
              <span className={badgeClass(item.status)}>{item.status}</span>
            </div>
          ))}
        </>
      )}

      {/* ── Report button ── */}
      <button
        className="btn btn--green"
        style={{ marginTop: '8px' }}
        onClick={() => setShowModal(true)}
      >
        <i className="ti ti-plus"></i>{' '}Report new issue
      </button>

      {/* ── Report modal ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '340px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Report new issue</h3>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>Describe the issue and we will assign it to the caretaker.</p>
            <textarea
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              placeholder="e.g. Broken door handle in bedroom..."
              rows={4}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none', resize: 'none' }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button
                onClick={() => { setShowModal(false); setNewIssue(''); }}
                style={{ flex: 1, padding: '9px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#6b7280' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newIssue.trim()) {
                    alert(`Issue reported: ${newIssue}`);
                    setNewIssue('');
                    setShowModal(false);
                  }
                }}
                style={{ flex: 1, padding: '9px', border: 'none', borderRadius: '8px', background: '#1a7f55', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}