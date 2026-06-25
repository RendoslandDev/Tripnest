import type { Booking } from '../types';

interface Props {
  booking: Booking;
  onViewBooking: () => void;
}

export default function UpcomingBooking({ booking, onViewBooking }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <h4>Upcoming Booking</h4>
        <a className="view-all" style={{ cursor: 'pointer' }}>View all →</a>
      </div>
      <div className="booking-row">
        <img src={booking.imgSrc} width={72} height={100} className="booking-img" alt={booking.title} />
        <div className="booking-info">
          <span className="badge badge--green">{booking.status}</span>
          <h4>{booking.title}</h4>
          <p>TN-ID: {booking.id}</p>
          <p>{booking.location}</p>
          <div className="booking-meta">
            <span><i className="ti ti-calendar"></i>{" "}{booking.dateRange}</span>
          </div>
          <div className="booking-meta">
            <span><i className="ti ti-users"></i>{" "}{booking.guests} Guests</span>
            <strong>GHC {booking.pricePerMonth.toLocaleString()} / month</strong>
          </div>
          <button className="btn btn--green" onClick={onViewBooking}>View Booking</button>
        </div>
      </div>
    </div>
  );
}