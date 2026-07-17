// Mirrors TripNest.Id backend DTOs (camelCase over the wire).

export type Role = 'SuperAdmin' | 'RegistrationOfficer' | 'VerificationOfficer'

export type CardStatus = 'Active' | 'Revoked'
// Derived on the client from status + expiry date for display purposes.
export type DisplayCardStatus = 'Active' | 'Expiring Soon' | 'Expired' | 'Revoked'

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected'
export type Gender = 'Male' | 'Female' | 'Other'
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed'

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  statusCode: number
  data?: T
  errors?: string[]
}

export interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface AuthOfficer {
  officerId: string
  fullName: string
  role: Role
}

export interface LoginResponse {
  token: string
  officerId: string
  fullName: string
  role: Role
  expiryAt: string
}

export interface IdCardSummary {
  id: string
  cardId: string
  status: CardStatus
  expiryDate: string
}

export interface Citizen {
  id: string
  nin: string
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  gender: string
  nationality: string
  maritalStatus: string
  address: string
  contactNumber: string
  photoPath: string
  createdAt: string
  idCard?: IdCardSummary | null
}

export interface CreateCitizenRequest {
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  gender: string
  nationality: string
  maritalStatus: string
  address: string
  contactNumber: string
}

export interface IdCard {
  id: string
  cardId: string
  citizenId: string
  status: CardStatus
  dateCreated: string
  expiryDate: string
  citizenFullName: string
  qrCodePath?: string | null
  barcodePath?: string | null
}

export interface Application {
  id: string
  citizenId: string
  citizenName: string
  nin: string
  status: ApplicationStatus
  rejectionReason?: string | null
  submittedAt: string
  reviewedAt?: string | null
  reviewedByOfficerId?: string | null
}

export interface Officer {
  id: string
  fullName: string
  email: string
  role: Role
  isActive: boolean
  createdAt: string
}

export interface AuditLog {
  id: string
  officerId: string
  officerName: string
  action: string
  entity: string
  entityId: string
  details: string
  performedAt: string
}

export interface DashboardStats {
  totalIds: number
  activeCards: number
  expiringSoon: number
  inactiveRevoked: number
  pendingVerifications: number
}

export interface RecentRegistration {
  id: string
  fullName: string
  dateOfBirth: string
  gender: string
  createdAt: string
}

export interface RegistrationFormData {
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  gender: Gender
  maritalStatus: MaritalStatus
  address: string
  contactNumber: string
}
