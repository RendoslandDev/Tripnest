import { useState } from 'react';

interface Property {
  id: string;
  title: string;
  location: string;
  guests: number;
  pricePerMonth: number;
  thumbBg: string;
  thumbColor: string;
}

const initialProperties: Property[] = [
  { id: 'prop-1', title: '3 Bed House',  location: 'Tarkwa',  guests: 6, pricePerMonth: 1800, thumbBg: '#e1f5ee', thumbColor: '#1a7f55' },
  { id: 'prop-2', title: 'Studio Apt',   location: 'Nsuaem',  guests: 2, pricePerMonth: 700,  thumbBg: '#e6f1fb', thumbColor: '#185fa5' },
  { id: 'prop-3', title: '2 Bed Flat',   location: 'Tarkwa',  guests: 4, pricePerMonth: 1100, thumbBg: '#faeeda', thumbColor: '#854f0b' },
  { id: 'prop-4', title: '4 Bed Villa',  location: 'Nsuaem',  guests: 8, pricePerMonth: 3200, thumbBg: '#fcebeb', thumbColor: '#a32d2d' },
  { id: 'prop-5', title: '1 Bed Apt',    location: 'Tarkwa',  guests: 2, pricePerMonth: 850,  thumbBg: '#e1f5ee', thumbColor: '#1a7f55' },
  { id: 'prop-6', title: '3 Bed Duplex', location: 'Nsuaem',  guests: 6, pricePerMonth: 2100, thumbBg: '#e6f1fb', thumbColor: '#185fa5' },
];

interface Props {
  onBack: () => void;
}

export default function SavedProperties({ onBack }: Props) {
  const [saved, setSaved] = useState<string[]>(initialProperties.map((p) => p.id));

  function toggleSave(id: string) {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  const visibleProperties = initialProperties.filter((p) => saved.includes(p.id));

  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', color: '#1a1a1a' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <button
          onClick={onBack}
          style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '16px', flexShrink: 0 }}
        >
          <i className="ti ti-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 600, flex: 1 }}>Saved Properties</h1>
        <span className="badge badge--green">{visibleProperties.length} saved</span>
      </div>

      {visibleProperties.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
          <i className="ti ti-heart-off" style={{ fontSize: '48px', opacity: 0.3 }}></i>
          <p style={{ marginTop: '12px', fontSize: '14px' }}>No saved properties yet.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {visibleProperties.map((property) => (
          <div key={property.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ height: '90px', background: property.thumbBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-building" style={{ fontSize: '30px', color: property.thumbColor, opacity: 0.4 }}></i>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{property.title}</p>
                <button
                  onClick={() => toggleSave(property.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e24b4a', fontSize: '16px', padding: 0 }}
                  title="Remove from saved"
                >
                  <i className="ti ti-heart-filled"></i>
                </button>
              </div>
              <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>
                <i className="ti ti-map-pin" style={{ fontSize: '11px' }}></i>{' '}{property.location}
              </p>
              <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>
                <i className="ti ti-users" style={{ fontSize: '11px' }}></i>{' '}Up to {property.guests} guests
              </p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a7f55' }}>
                GHC {property.pricePerMonth.toLocaleString()}/mo
              </p>
              <button
                style={{ width: '100%', marginTop: '8px', padding: '8px', border: 'none', borderRadius: '8px', background: '#1a7f55', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                View property
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}