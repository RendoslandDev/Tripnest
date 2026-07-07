import type {
  Agreement,
  AgreementStatus,
  Booking,
  BookingStatus,
  ChatMessage,
  Conversation,
  Listing,
  ListingStatus,
  MaintenanceStatus,
  MaintenanceTicket,
  Notification,
  NotificationType,
  Property,
} from '../types';
import { assetUrl } from './client';
import { getCachedListingPhotos } from '../lib/listingPhotos';

// ---------------------------------------------------------------------------
// Wire types for TripNest.Core responses (camelCase JSON; enums arrive as
// numbers — the backend does not register JsonStringEnumConverter) plus the
// adapters that reshape them into the UI types in src/types. Pages keep
// consuming the frontend types; only this layer knows about the API's shape.
// ---------------------------------------------------------------------------

export interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginResponseDto {
  userId: string;
  fullName: string;
  email: string;
  role: number; // UserRole: 0 Tenant, 1 Landlord, 2 Agent, 3 Caretaker, 4 Admin, 5 Guest
  accessToken: string;
  refreshToken: string;
  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  tripNestId?: string | null;
}

export interface PropertyResponseDto {
  propertyId: string;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  monthlyRent: number;
  dailyRate?: number | null;
  propertyType: string;
  stayType: number;
  cancellationPolicy: number;
  amenities?: string | null;
  photoPaths?: string | null;
  status: number; // PropertyStatus: 0 Draft, 1 Active, 2 Inactive, 3 Archived
  createdAt: string;
  updatedAt: string;
}

export interface BookingResponseDto {
  bookingId: string;
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: number; // BookingStatus: 0 Pending, 1 Confirmed, 2 CheckedIn, 3 CheckedOut, 4 Cancelled, 5 Completed
  createdAt: string;
}

export interface NotificationResponseDto {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityId?: string | null;
  relatedEntityType?: string | null;
  createdAt: string;
  readAt?: string | null;
}

export interface ConversationResponseDto {
  conversationId: string;
  user1Id: string;
  user2Id: string;
  propertyId?: string | null;
  createdAt: string;
  lastMessageAt?: string | null;
}

export interface MessageResponseDto {
  messageId: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: number;
  createdAt: string;
  isRead: boolean;
  readAt?: string | null;
}

export interface AgreementResponseDto {
  agreementId: string;
  bookingId: string;
  termsContent: string;
  status: number; // AgreementStatus: 0 Draft, 1 Pending, 2 Signed, 3 Expired, 4 Terminated
  createdAt: string;
  signedAt?: string | null;
  tenantSignature?: string | null;
  landlordSignature?: string | null;
  expiryDate?: string | null;
}

export interface MaintenanceResponseDto {
  maintenanceId: string;
  propertyId: string;
  reportedByUserId: string;
  description: string;
  status: number; // MaintenanceStatus: 0 Reported, 1 Assigned, 2 InProgress, 3 Completed, 4 Cancelled
  photoPath?: string | null;
  createdAt: string;
  completedAt?: string | null;
  resolution?: string | null;
}

export interface WishlistItemDto {
  id: string;
  propertyId: string;
  addedAt: string;
}

export interface TenantDashboardDto {
  activeBookings: number;
  completedStays: number;
  cancelledBookings: number;
  upcomingCheckIns: number;
  recentBookings: {
    id: string;
    propertyId: string;
    checkInDate: string;
    checkOutDate: string;
    status: number;
    totalAmount: number;
  }[];
  totalSpent: number;
}

export interface LandlordEarningsDto {
  totalEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
}

export interface ReceiptResponseDto {
  receiptId: string;
  bookingId: string;
  userId: string;
  amount: number;
  description?: string | null;
  paymentMethod?: string | null;
  createdAt: string;
}

export interface BlockedDateDto {
  id: string;
  startDate: string;
  endDate: string;
  reason?: string | null;
}

// --- shared formatting helpers ----------------------------------------------

const dateShort = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export function formatIsoDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateShort.format(d);
}

/** "5m ago" style relative timestamp for feeds. */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatIsoDate(iso);
}

// --- adapters ----------------------------------------------------------------

export function mapProperty(dto: PropertyResponseDto): Property {
  return {
    id: dto.propertyId,
    title: dto.title,
    location: dto.location,
    price: dto.monthlyRent,
    period: 'month',
    // Ratings live behind /api/reviews & /api/trustscore; default until wired.
    rating: 0,
    reviews: 0,
    verified: dto.status === 1,
    amenities: dto.amenities ? dto.amenities.split(',').map((a) => a.trim()).filter(Boolean) : [],
    type: dto.propertyType,
    beds: dto.bedrooms,
    baths: dto.bathrooms,
    description: dto.description,
    agent: { name: 'TripNest Host', role: 'Landlord', phone: '' },
    coords: { lat: dto.latitude, lng: dto.longitude },
    // Core doesn't return uploaded photos yet; fall back to this browser's
    // cached copies (see src/lib/listingPhotos.ts).
    photos: dto.photoPaths
      ? dto.photoPaths.split(',').map((p) => assetUrl(p.trim())).filter(Boolean)
      : getCachedListingPhotos(dto.propertyId),
  };
}

export function mapBookingStatus(status: number, checkInIso: string): BookingStatus {
  switch (status) {
    case 2: return 'active'; // CheckedIn
    case 3: // CheckedOut
    case 5: return 'past'; // Completed
    case 4: return 'cancelled';
    default: // Pending / Confirmed
      return new Date(checkInIso).getTime() < Date.now() ? 'past' : 'upcoming';
  }
}

export function mapBooking(dto: BookingResponseDto, property?: Property): Booking {
  return {
    id: dto.bookingId,
    property: property?.title ?? 'Property',
    propertyId: dto.propertyId,
    location: property?.location ?? '',
    checkIn: formatIsoDate(dto.checkInDate),
    checkOut: formatIsoDate(dto.checkOutDate),
    guests: 1, // not tracked by the backend booking model
    amount: dto.totalAmount,
    period: 'month',
    status: mapBookingStatus(dto.status, dto.checkInDate),
  };
}

function notificationType(dto: NotificationResponseDto): NotificationType {
  const entity = (dto.relatedEntityType ?? '').toLowerCase();
  if (entity.includes('booking')) return 'booking';
  if (entity.includes('escrow') || entity.includes('receipt') || entity.includes('payment')) return 'payment';
  if (entity.includes('maintenance') || entity.includes('service')) return 'maintenance';
  if (entity.includes('safety') || entity.includes('alert')) return 'safety';
  return 'message';
}

export function mapNotification(dto: NotificationResponseDto): Notification {
  return {
    id: dto.notificationId,
    type: notificationType(dto),
    title: dto.title,
    body: dto.message,
    time: timeAgo(dto.createdAt),
    read: dto.isRead,
  };
}

export function mapConversation(dto: ConversationResponseDto, myUserId: string): Conversation {
  const otherId = dto.user1Id === myUserId ? dto.user2Id : dto.user1Id;
  return {
    id: dto.conversationId,
    // The conversation DTO carries ids only; profile names need a lookup.
    name: `User ${otherId.slice(0, 8)}`,
    role: dto.propertyId ? 'Property chat' : 'Direct',
    lastMessage: '',
    time: dto.lastMessageAt ? timeAgo(dto.lastMessageAt) : timeAgo(dto.createdAt),
    unread: 0,
  };
}

export function mapMessage(dto: MessageResponseDto, myUserId: string): ChatMessage {
  return {
    id: dto.messageId,
    fromMe: dto.senderId === myUserId,
    text: dto.content,
    time: timeAgo(dto.createdAt),
  };
}

const AGREEMENT_STATUS: Record<number, AgreementStatus> = {
  0: 'pending', // Draft
  1: 'pending',
  2: 'active', // Signed
  3: 'expired',
  4: 'expired', // Terminated
};

export function mapAgreement(dto: AgreementResponseDto, booking?: Booking): Agreement {
  return {
    id: dto.agreementId,
    property: booking?.property ?? `Booking ${dto.bookingId.slice(0, 8)}`,
    landlord: 'TripNest Host',
    startDate: booking?.checkIn ?? formatIsoDate(dto.createdAt),
    endDate: booking?.checkOut ?? (dto.expiryDate ? formatIsoDate(dto.expiryDate) : '—'),
    rent: booking?.amount ?? 0,
    period: 'month',
    status: AGREEMENT_STATUS[dto.status] ?? 'pending',
  };
}

const MAINTENANCE_STATUS: Record<number, MaintenanceStatus> = {
  0: 'pending', // Reported
  1: 'pending', // Assigned
  2: 'in-progress',
  3: 'resolved', // Completed
  4: 'resolved', // Cancelled
};

export function mapMaintenance(dto: MaintenanceResponseDto, property?: Property): MaintenanceTicket {
  return {
    id: dto.maintenanceId,
    title: dto.description,
    property: property?.title ?? 'My residence',
    propertyId: dto.propertyId,
    category: 'General',
    status: MAINTENANCE_STATUS[dto.status] ?? 'pending',
    reportedOn: formatIsoDate(dto.createdAt),
  };
}

const LISTING_STATUS: Record<number, ListingStatus> = {
  0: 'draft',
  1: 'published',
  2: 'unlisted',
  3: 'snoozed', // Archived
};

const COVER_COLORS = ['#0f5132', '#1e3a8a', '#9d174d', '#7c2d12', '#155e75', '#4c1d95', '#92400e'];

export function mapListing(dto: PropertyResponseDto): Listing {
  let hash = 0;
  for (const ch of dto.propertyId) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return {
    id: dto.propertyId,
    title: dto.title,
    location: dto.location,
    type: dto.propertyType,
    status: LISTING_STATUS[dto.status] ?? 'draft',
    nightlyRate: dto.dailyRate ?? Math.round(dto.monthlyRent / 30),
    beds: dto.bedrooms,
    baths: dto.bathrooms,
    occupancyRate: 0,
    rating: 0,
    reviews: 0,
    coverColor: COVER_COLORS[Math.abs(hash) % COVER_COLORS.length],
  };
}
