import type { Booking } from '../types';

interface Props {
  onBack: () => void;
  onViewBooking: (booking: Booking) => void;
}

const activeBookings: Booking[] = [
  {
    id: '38492-PROP',
    title: '2 Bedroom Apartment',
    location: 'Tarkwa, Nsuaem',
    status: 'Confirmed',
    dateRange: 'May 20 — May 27, 2025',
    guests: 2,
    pricePerMonth: 1200,
    imgSrc: '/Images/product1.png',
  },
  {
    id: '47291-PROP',
    title: '1 Bedroom Studio',
    location: 'Nsuaem Central',
    status: 'Pending',
    dateRange: 'Jun 1 — Jun 30, 2025',
    guests: 1,
    pricePerMonth: 900,
    imgSrc: '/Images/product1.png',
  },
];

export default function ActiveBookings({ onBack, onViewBooking }: Props) {
  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', color: '#1a1a1a' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <button
          onClick={onBack}
          style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '16px' }}
        >
          <i className="ti ti-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 600, flex: 1 }}>Active Bookings</h1>
        <span className="badge badge--green">{activeBookings.length} active</span>
      </div>

      {activeBookings.map((booking) => (
        <div key={booking.id} className="card" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '72px', height: '100px', borderRadius: '8px', background: booking.status === 'Confirmed' ? '#e1f5ee' : '#faeeda', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-building" style={{ fontSize: '26px', color: booking.status === 'Confirmed' ? '#1a7f55' : '#854f0b', opacity: 0.4 }}></i>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className={`badge ${booking.status === 'Confirmed' ? 'badge--green' : 'badge--amber'}`}>{booking.status}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a7f55' }}>GHC {booking.pricePerMonth.toLocaleString()}/mo</span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>{booking.title}</p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                <i className="ti ti-map-pin" style={{ fontSize: '11px' }}></i>{' '}{booking.location}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                <i className="ti ti-calendar" style={{ fontSize: '11px' }}></i>{' '}{booking.dateRange}
              </p>
              <p style={{ fontSize: '11px', color: '#9ca3af' }}>TN-ID: {booking.id}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  onClick={() => onViewBooking(booking)}
                  style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: '#1a7f55', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                >
                  <i className="ti ti-eye"></i>{' '}View booking
                </button>
                <button
                  style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: '#185fa5', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                >
                  <i className="ti ti-message"></i>{' '}Message agent
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}