export type Role = 'super_admin' | 'registration_officer' | 'verification_officer'

export type CardStatus = 'Active' | 'Expiring Soon' | 'Inactive' | 'Revoked' | 'Pending'
export type Gender = 'Male' | 'Female' | 'Other'
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  password: string
}

export interface Citizen {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string
  nationality: string
  gender: Gender
  maritalStatus: MaritalStatus
  address: string
  contactNumber: string
  photoUrl: string
}

export interface IDCard {
  cardId: string
  citizenId: string
  status: CardStatus
  dateCreated: string
  expiryDate: string
  issuedBy: string
}

export interface AuditLog {
  id: string
  action: string
  performedBy: string
  targetId: string
  timestamp: string
  details: string
}

export interface RegistrationFormData {
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string
  nationality: string
  gender: Gender
  maritalStatus: MaritalStatus
  address: string
  contactNumber: string
  photoUrl: string
}
