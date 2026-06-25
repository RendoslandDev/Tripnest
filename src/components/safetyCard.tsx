import { useState } from 'react';

interface Props {
  initialEnabled: boolean;
  initialContact: string;
}

export default function SafetyCard({ initialEnabled, initialContact }: Props) {
  const [isOn, setIsOn]         = useState(initialEnabled);
  const [contact, setContact]   = useState(initialContact);
  const [editing, setEditing]   = useState(false);
  const [inputVal, setInputVal] = useState(initialContact);

  function savePhone() {
    if (inputVal.trim()) setContact(inputVal.trim());
    setEditing(false);
  }

  function cancelPhone() {
    setInputVal(contact);
    setEditing(false);
  }

  return (
    <div className="card">
      <h4 className="card-title">Safety First</h4>

      {/* Toggle row */}
      <div className="safety-row">
        <div>
          <p className="safety-label">SMS Safety Alert</p>
          <small>We'll alert your emergency contact</small>
        </div>
        <div
          className="toggle"
          role="switch"
          aria-checked={isOn}
          tabIndex={0}
          onClick={() => setIsOn((prev) => !prev)}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setIsOn((prev) => !prev); } }}
        >
          <div className="toggle-track" style={{ background: isOn ? '#1a7f55' : '#d1d5db' }}>
            <div className="toggle-thumb" style={{ right: isOn ? '2px' : 'auto', left: isOn ? 'auto' : '2px' }}></div>
          </div>
          <span className="toggle-on" style={{ color: isOn ? '#1a7f55' : '#9ca3af' }}>
            {isOn ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      <hr className="divider" />

      {/* Emergency contact */}
      <p className="emg-label">Emergency Contact</p>

      {!editing ? (
        <div className="emg-num">
          {contact}
          <button
            onClick={() => { setInputVal(contact); setEditing(true); }}
            style={{ background: 'none', border: 'none', fontSize: '12px', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <i className="ti ti-pencil"></i> Edit
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '6px' }}>
          <input
            type="tel"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') savePhone(); if (e.key === 'Escape') cancelPhone(); }}
            placeholder="+233 24 000 0000"
            autoFocus
            style={{ flex: 1, padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
          />
          <button onClick={savePhone}
            style={{ background: '#1a7f55', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            Save
          </button>
          <button onClick={cancelPhone}
            style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer', color: '#6b7280' }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}