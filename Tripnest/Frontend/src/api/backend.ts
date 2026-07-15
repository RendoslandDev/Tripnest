import type {
  Agreement,
  AgreementStatus,
  Booking,
  BookingStatus,
  ChatMessage,
  Conversation,
  ExchangePost,
  ExchangeReply,
  Inquiry,
  LandlordBooking,
  LandlordBookingStatus,
  LandlordTenant,
  Listing,
  ListingStatus,
  MaintenanceStatus,
  MaintenanceTicket,
  Notification,
  NotificationType,
  PaymentMethod,
  Property,
  Reservation,
  ReservationStatus,
  Resource,
  TenantStanding,
} from '../types';
import { assetUrl } from './client';
import { getCachedListingPhotos } from '../lib/listingPhotos';
import { exchangeCategoryFromInt, initialsOf, inquiryStatusFromInt, resourceCategoryFromInt } from '../lib/enums';
import { formatDateFull } from '../lib/format';

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

export interface AssistantReplyResponseDto {
  answer: string;
  escalated: boolean;
  supportTicketId?: string | null;
  supportConversationId?: string | null;
}

export interface AssistantHistoryItemDto {
  id: string;
  isFromUser: boolean;
  content: string;
  supportTicketId?: string | null;
  createdAt: string;
}

export interface VerificationStatusResponseDto {
  verificationId: string;
  ghanaCardNumber: string;
  status: number; // VerificationStatus: 0 NotStarted, 1 Pending, 2 Verified, 3 Rejected
  faceMatchScore?: number | null;
  livenessScore?: number | null;
  failureReason?: string | null;
  submittedAt: string;
  reviewedAt?: string | null;
}

export interface ExchangePostResponseDto {
  id: string;
  authorId: string;
  authorName?: string | null;
  title: string;
  body: string;
  category: number; // ExchangeCategory: 0 Tips, 1 Suppliers, 2 Regulation, 3 Marketplace, 4 General
  pinned: boolean;
  replyCount: number;
  createdAt: string;
}

export interface ExchangeReplyResponseDto {
  id: string;
  authorId: string;
  authorName?: string | null;
  body: string;
  createdAt: string;
}

export interface ResourceResponseDto {
  id: string;
  title: string;
  description: string;
  category: number; // ResourceCategory: 0 Guide, 1 Policy, 2 Template, 3 Video
  format: string;
  url: string;
  createdAt: string;
}

export interface LandlordBookingResponseDto {
  bookingId: string;
  propertyId: string;
  listing?: string | null;
  guest?: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  amount: number;
  status: number; // BookingStatus
  stage: string; // Upcoming | Active | Complete | Canceled
}

export interface GuestReviewItemDto {
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface ReservationDetailsResponseDto {
  bookingId: string;
  propertyId: string;
  listing?: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  tripType: string;
  bookedThrough: string;
  status: number;
  stage: string;
  guestId: string;
  guestName?: string | null;
  guestTripNestId?: string | null;
  nightlyRate: number;
  netRevenue: number;
  managementFeePercent: number;
  managementFee: number;
  ownerPayout: number;
  guestReviews: GuestReviewItemDto[];
}

export interface LandlordTenantResponseDto {
  tenantId: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  property?: string | null;
  since: string;
  leaseEnd: string;
  monthlyRent: number;
  standing: string; // current | ending-soon | overdue
}

export interface InquiryResponseDto {
  inquiryId: string;
  propertyId: string;
  propertyTitle?: string | null;
  guestName: string;
  message: string;
  status: number; // InquiryStatus: 0 New, 1 Replied, 2 Archived
  createdAt: string;
}

export interface PaymentMethodResponseDto {
  id: string;
  provider: string;
  maskedNumber: string;
  channel: string; // momo | card
  isPrimary: boolean;
}

export interface ReviewResponseDto {
  reviewId: string;
  reviewerId: string;
  revieweeId: string;
  propertyId: string;
  rating: number;
  comment: string;
  type: number; // ReviewType: 0 Property, 1 Tenant, 2 Landlord
  createdAt: string;
}

export interface ListingCopySuggestionDto {
  title: string;
  description: string;
  highlights: string[];
}

export interface SuggestedReplyResponseDto {
  reply: string;
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
  // Scam warnings arrive with no relatedEntityType; the title is the only signal.
  if (entity.includes('safety') || entity.includes('alert') || dto.title.toLowerCase().includes('safety')) return 'safety';
  if (entity.includes('booking')) return 'booking';
  if (entity.includes('escrow') || entity.includes('receipt') || entity.includes('payment')) return 'payment';
  if (entity.includes('maintenance') || entity.includes('service')) return 'maintenance';
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

export function mapExchangePost(dto: ExchangePostResponseDto): ExchangePost {
  const author = dto.authorName ?? `User ${dto.authorId.slice(0, 8)}`;
  return {
    id: dto.id,
    author,
    role: 'Host', // author roles aren't part of the exchange DTO
    initials: initialsOf(author),
    title: dto.title,
    body: dto.body,
    category: exchangeCategoryFromInt(dto.category),
    replies: dto.replyCount,
    createdAt: timeAgo(dto.createdAt),
    pinned: dto.pinned,
  };
}

export function mapExchangeReply(dto: ExchangeReplyResponseDto): ExchangeReply {
  const author = dto.authorName ?? `User ${dto.authorId.slice(0, 8)}`;
  return {
    id: dto.id,
    author,
    initials: initialsOf(author),
    body: dto.body,
    createdAt: timeAgo(dto.createdAt),
  };
}

export function mapResource(dto: ResourceResponseDto): Resource {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    category: resourceCategoryFromInt(dto.category),
    format: dto.format,
    url: assetUrl(dto.url),
  };
}

const LANDLORD_BOOKING_STATUS: Record<number, LandlordBookingStatus> = {
  0: 'pending',
  1: 'confirmed',
  2: 'checked-in',
  3: 'completed', // CheckedOut
  4: 'cancelled',
  5: 'completed',
};

export function mapLandlordBooking(dto: LandlordBookingResponseDto): LandlordBooking {
  return {
    id: dto.bookingId,
    guest: dto.guest ?? 'Guest',
    listing: dto.listing ?? 'Listing',
    checkIn: formatIsoDate(dto.checkIn),
    checkOut: formatIsoDate(dto.checkOut),
    nights: dto.nights,
    guests: dto.guests,
    amount: dto.amount,
    status: LANDLORD_BOOKING_STATUS[dto.status] ?? 'pending',
  };
}

const RESERVATION_STAGE: Record<string, ReservationStatus> = {
  Upcoming: 'upcoming',
  Active: 'upcoming',
  Complete: 'complete',
  Canceled: 'canceled',
};

/** Table row built from the bookings list; financials arrive with the details fetch. */
export function mapReservationRow(dto: LandlordBookingResponseDto): Reservation {
  return {
    id: dto.bookingId,
    property: dto.listing ?? 'Listing',
    location: '',
    status: RESERVATION_STAGE[dto.stage] ?? 'upcoming',
    checkIn: formatIsoDate(dto.checkIn),
    checkOut: formatIsoDate(dto.checkOut),
    checkInFull: formatDateFull(dto.checkIn),
    checkOutFull: formatDateFull(dto.checkOut),
    nights: dto.nights,
    guests: dto.guests,
    nightlyRate: dto.nights > 0 ? Math.round(dto.amount / dto.nights) : dto.amount,
    managementFeePercent: 0,
    tripType: 'Reservation',
    bookedThrough: 'TripNest',
    reviews: [],
  };
}

export function mapReservationDetails(dto: ReservationDetailsResponseDto): Reservation {
  return {
    id: dto.bookingId,
    property: dto.listing ?? 'Listing',
    location: '',
    status: RESERVATION_STAGE[dto.stage] ?? 'upcoming',
    checkIn: formatIsoDate(dto.checkIn),
    checkOut: formatIsoDate(dto.checkOut),
    checkInFull: formatDateFull(dto.checkIn),
    checkOutFull: formatDateFull(dto.checkOut),
    nights: dto.nights,
    guests: dto.guests,
    nightlyRate: dto.nightlyRate,
    managementFeePercent: dto.managementFeePercent,
    tripType: dto.tripType,
    bookedThrough: dto.bookedThrough,
    reviews: dto.guestReviews.map((r) => ({
      name: dto.guestName ?? 'Guest',
      date: formatIsoDate(r.createdAt),
      stars: r.rating,
      text: r.comment ?? '',
    })),
  };
}

export function mapLandlordTenant(dto: LandlordTenantResponseDto): LandlordTenant {
  return {
    id: dto.tenantId,
    name: dto.name ?? 'Tenant',
    property: dto.property ?? 'Property',
    email: dto.email ?? '',
    phone: dto.phone ?? '',
    since: formatIsoDate(dto.since),
    leaseEnd: formatIsoDate(dto.leaseEnd),
    monthlyRent: dto.monthlyRent,
    standing: (dto.standing as TenantStanding) || 'current',
  };
}

export function mapPaymentMethod(dto: PaymentMethodResponseDto): PaymentMethod {
  return {
    id: dto.id,
    provider: dto.provider,
    number: dto.maskedNumber,
    primary: dto.isPrimary,
  };
}

export function mapInquiry(dto: InquiryResponseDto): Inquiry {
  return {
    id: dto.inquiryId,
    guest: dto.guestName,
    listing: dto.propertyTitle ?? 'Listing',
    message: dto.message,
    date: timeAgo(dto.createdAt),
    status: inquiryStatusFromInt(dto.status),
  };
}

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
