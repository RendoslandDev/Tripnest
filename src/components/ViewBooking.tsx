import { useState } from 'react';
import type { Booking } from '../types';

interface Props {
  booking: Booking;
  onBack: () => void;
}

function statusBadgeClass(status: string): string {
  if (status === 'Confirmed') return 'badge badge--green';
  if (status === 'Pending')   return 'badge badge--amber';
  return 'badge badge--red';
}

export default function ViewBooking({ booking, onBack }: Props) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', color: '#1a1a1a' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <button
          onClick={onBack}
          style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '16px', flexShrink: 0 }}
        >
          <i className="ti ti-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 600, flex: 1 }}>Booking Details</h1>
        <span className={statusBadgeClass(booking.status)}>{booking.status}</span>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '12px' }}>
        <div style={{ width: '100%', height: '160px', background: '#e1f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img
            src={booking.imgSrc}
            alt={booking.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.style.display = 'none';
              t.parentElement!.innerHTML = `<i class="ti ti-building" style="font-size:56px;color:#1a7f55;opacity:0.3"></i>`;
            }}
          />
        </div>

        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{booking.title}</h2>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                <i className="ti ti-map-pin" style={{ fontSize: '12px' }}></i>{' '}{booking.location}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#1a7f55' }}>GHC {booking.pricePerMonth.toLocaleString()}</p>
              <p style={{ fontSize: '11px', color: '#6b7280' }}>per month</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#1a7f55' }}></div>
              <p style={{ fontSize: '13px', fontWeight: 600 }}>{booking.dateRange.split('—')[0].trim()}</p>
              <p style={{ fontSize: '11px', color: '#6b7280' }}>Check-in</p>
            </div>
            <div style={{ flex: 1, height: '2px', background: '#e5e7eb', marginTop: '6px' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#e5e7eb' }}></div>
              <p style={{ fontSize: '13px', fontWeight: 600 }}>{booking.dateRange.split('—')[1].trim()}</p>
              <p style={{ fontSize: '11px', color: '#6b7280' }}>Check-out</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '12px' }}>
        <h3 className="card-title">Booking info</h3>
        {[
          { label: 'Booking ID',    value: `TN-${booking.id}` },
          { label: 'Guests',        value: `${booking.guests} guests` },
          { label: 'Date range',    value: booking.dateRange },
          { label: 'Price',         value: `GHC ${booking.pricePerMonth.toLocaleString()} / month`, green: true },
        ].map((row) => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{row.label}</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: row.green ? '#1a7f55' : '#1a1a1a' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '12px' }}>
        <h3 className="card-title">Agent</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#faeeda', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: '#854f0b' }}>
            KA
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', fontWeight: 600 }}>Kwame Asante</p>
            <p style={{ fontSize: '11px', color: '#6b7280' }}>Property Agent</p>
          </div>
          <button style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1a7f55', fontSize: '16px' }}>
            <i className="ti ti-phone"></i>
          </button>
          <button style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1a7f55', fontSize: '16px' }}>
            <i className="ti ti-message"></i>
          </button>
        </div>
      </div>

      <button
        className="btn btn--green"
        style={{ marginBottom: '10px' }}
        onClick={() => window.print()}
      >
        <i className="ti ti-download"></i>{' '}Download receipt
      </button>
      <button
        style={{ width: '100%', padding: '9px', border: '1px solid #e24b4a', borderRadius: '8px', background: '#fff', color: '#a32d2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
        onClick={() => setShowCancelModal(true)}
      >
        Cancel booking
      </button>

      {showCancelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '340px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Cancel booking?</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px', lineHeight: 1.5 }}>
              Are you sure you want to cancel <strong>{booking.title}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{ flex: 1, padding: '9px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#6b7280' }}
              >
                Keep booking
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{ flex: 1, padding: '9px', border: 'none', borderRadius: '8px', background: '#e24b4a', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}