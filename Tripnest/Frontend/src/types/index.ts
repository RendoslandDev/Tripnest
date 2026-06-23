// ---------------------------------------------------------------------------
// Shared domain types for the TripNest management dashboard.
// ---------------------------------------------------------------------------

export type ReservationStatus = 'upcoming' | 'complete' | 'canceled';

/** Routes that live inside the management dashboard sidebar. */
export type NavPage =
  | 'overview'
  | 'reservations'
  | 'calendar'
  | 'pricing'
  | 'statements'
  | 'listings'
  | 'tasks'
  | 'my-trips'
  | 'users'
  | 'owner-exchange'
  | 'resources';

export interface Review {
  name: string;
  date: string;
  stars: number;
  text: string;
}

export interface Reservation {
  id: number;
  property: string;
  location: string;
  status: ReservationStatus;
  checkIn: string;
  checkOut: string;
  checkInFull: string;
  checkOutFull: string;
  nights: number;
  guests: number;
  nightlyRate: number;
  managementFeePercent: number;
  tripType: string;
  bookedThrough: string;
  reviews: Review[];
}

export interface CalendarBooking {
  startDate: number;
  endDate: number;
  label: string;
}

export interface CalendarMonth {
  label: string;
  prices: Record<number, number>;
  weekendDays: number[];
  discountDays: number[];
  ownerDays: number[];
  maintenanceDays: number[];
  bookings: CalendarBooking[];
  minNights: number;
}

export interface OverviewSummary {
  monthlyEarnings: number;
  occupancyRate: number;
  upcomingCount: number;
  avgNightlyRate: number;
  recent: Reservation[];
}

export interface PricingSettings {
  baseRate: number;
  weekendRate: number;
  weeklyDiscountPercent: number;
  monthlyDiscountPercent: number;
  minNights: number;
  cleaningFee: number;
}

export interface PropertyAgent {
  name: string;
  role: string;
  phone: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  period: 'month' | 'week';
  rating: number;
  reviews: number;
  verified: boolean;
  tag?: string;
  amenities: string[];
  type: string;
  beds: number;
  baths: number;
  description: string;
  agent: PropertyAgent;
}

export interface TenantDashboard {
  stats: {
    activeBookings: number;
    rentPaid: number;
    savedProperties: number;
    openMaintenance: number;
  };
  upcoming: {
    title: string;
    propertyId: string;
    location: string;
    dates: string;
    price: number;
    period: 'month' | 'week';
    status: string;
  };
  maintenance: {
    pending: number;
    inProgress: number;
    resolved: number;
    latest: { title: string; reportedOn: string; status: string };
  };
  messages: { id: number; name: string; role: string; preview: string; time: string }[];
  emergencyContact: string;
}

export interface Conversation {
  id: number;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export interface ChatMessage {
  id: number;
  fromMe: boolean;
  text: string;
  time: string;
}

export type NotificationType = 'booking' | 'payment' | 'maintenance' | 'message' | 'safety';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  role: string;
  location: string;
  rating: number;
  reviews: number;
  verified: boolean;
  rate: number;
  ratePeriod: string;
  skills: string[];
}

export type MaintenanceStatus = 'pending' | 'in-progress' | 'resolved';

export interface MaintenanceTicket {
  id: number;
  title: string;
  property: string;
  category: string;
  status: MaintenanceStatus;
  reportedOn: string;
}

export type BookingStatus = 'upcoming' | 'active' | 'past' | 'cancelled';

export interface Booking {
  id: string;
  property: string;
  propertyId: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amount: number;
  period: 'month' | 'week';
  status: BookingStatus;
}

export type AgreementStatus = 'active' | 'pending' | 'expired';

export interface Agreement {
  id: string;
  property: string;
  landlord: string;
  startDate: string;
  endDate: string;
  rent: number;
  period: 'month' | 'week';
  status: AgreementStatus;
}

export type PaymentStatus = 'paid' | 'due' | 'upcoming';

export interface Payment {
  id: string;
  description: string;
  property: string;
  date: string;
  amount: number;
  method: string;
  status: PaymentStatus;
}

export interface PaymentMethod {
  id: string;
  provider: string;
  number: string;
  primary: boolean;
}

export type StatementStatus = 'paid' | 'pending';

export interface Statement {
  id: number;
  month: string;
  period: string;
  grossRevenue: number;
  managementFee: number;
  netPayout: number;
  status: StatementStatus;
}
