import type { Booking, Property, Reservation } from '../types';
import { bookings as seedBookings } from '../data/bookings';
import { reservations as seedReservations } from '../data/reservations';
import { formatDateShort, formatDateFull, nightsBetween } from '../lib/format';

// ---------------------------------------------------------------------------
// In-memory booking store. Seeded from mock data; new bookings created through
// the checkout flow are appended here so they surface in the tenant Bookings
// list and (mapped) in the host Reservations dashboard. Swap the seed + the
// createBooking body for real API calls once the backend is live.
// ---------------------------------------------------------------------------

let bookingsState: Booking[] = [...seedBookings];
let reservationsState: Reservation[] = [...seedReservations];

export function getBookingsSnapshot(): Booking[] {
  return bookingsState;
}

export function getReservationsSnapshot(): Reservation[] {
  return reservationsState;
}

const SERVICE_FEE_RATE = 0.05;

export interface PriceBreakdown {
  nights: number;
  perNight: number;
  subtotal: number;
  serviceFee: number;
  total: number;
}

/** Prorate a per-period listing price across the selected nights. */
export function quotePrice(
  property: Pick<Property, 'price' | 'period'>,
  checkInISO: string,
  checkOutISO: string,
): PriceBreakdown {
  const nights = nightsBetween(checkInISO, checkOutISO);
  const nightsPerPeriod = property.period === 'month' ? 30 : 7;
  const perNight = Math.round(property.price / nightsPerPeriod);
  const subtotal = perNight * nights;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  return { nights, perNight, subtotal, serviceFee, total: subtotal + serviceFee };
}

export interface NewBookingInput {
  property: Property;
  checkInISO: string;
  checkOutISO: string;
  guests: number;
}

let bookingSeq = 2000;

/** Create a booking from a checkout selection and add it to both surfaces. */
export function createBooking(input: NewBookingInput): Booking {
  const { property, checkInISO, checkOutISO, guests } = input;
  const quote = quotePrice(property, checkInISO, checkOutISO);

  const booking: Booking = {
    id: `BK-${++bookingSeq}`,
    property: property.title,
    propertyId: property.id,
    location: property.location,
    checkIn: formatDateShort(checkInISO),
    checkOut: formatDateShort(checkOutISO),
    guests,
    amount: property.price,
    period: property.period,
    status: 'upcoming',
  };
  bookingsState = [booking, ...bookingsState];

  // Mirror into the host Reservations dashboard (structural mapping).
  const nextResId = reservationsState.reduce((max, r) => Math.max(max, r.id), 0) + 1;
  const reservation: Reservation = {
    id: nextResId,
    property: property.title,
    location: property.location,
    status: 'upcoming',
    checkIn: formatDateShort(checkInISO),
    checkOut: formatDateShort(checkOutISO),
    checkInFull: formatDateFull(checkInISO),
    checkOutFull: formatDateFull(checkOutISO),
    nights: quote.nights,
    guests,
    nightlyRate: quote.perNight,
    managementFeePercent: 20,
    tripType: 'Reservation',
    bookedThrough: 'TripNest',
    reviews: [],
  };
  reservationsState = [reservation, ...reservationsState];

  return booking;
}
