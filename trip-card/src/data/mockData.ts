import type { User, Citizen, IDCard, AuditLog } from '../types'

export const USERS: User[] = [
  { id: 'u1', name: 'Reg. Officer', email: 'officer@tripnest.gh', role: 'registration_officer', password: 'officer123' },
  { id: 'u2', name: 'Super Admin', email: 'admin@tripnest.gh', role: 'super_admin', password: 'admin123' },
  { id: 'u3', name: 'Verify Officer', email: 'verify@tripnest.gh', role: 'verification_officer', password: 'verify123' },
]

export const CITIZENS: Citizen[] = [
  { id: 'c1', firstName: 'Kofi', lastName: 'Mensah', dateOfBirth: '15/03/1990', nationality: 'Ghanaian', gender: 'Male', maritalStatus: 'Single', address: '12 Accra Road, Accra, Greater Accra', contactNumber: '024 123 4567', photoUrl: 'https://i.pravatar.cc/150?img=11' },
  { id: 'c2', firstName: 'Ama', lastName: 'Serwaa', dateOfBirth: '22/07/1985', nationality: 'Ghanaian', gender: 'Female', maritalStatus: 'Married', address: '45 Kumasi Street, Kumasi, Ashanti', contactNumber: '020 234 5678', photoUrl: 'https://i.pravatar.cc/150?img=45' },
  { id: 'c3', firstName: 'Yaw', lastName: 'Ofori', dateOfBirth: '08/11/1978', nationality: 'Ghanaian', gender: 'Male', maritalStatus: 'Married', address: '7 Cape Coast Ave, Cape Coast, Central', contactNumber: '027 345 6789', photoUrl: 'https://i.pravatar.cc/150?img=52' },
  { id: 'c4', firstName: 'Akosua', lastName: 'Darko', dateOfBirth: '30/01/1995', nationality: 'Ghanaian', gender: 'Female', maritalStatus: 'Single', address: '23 Takoradi Rd, Takoradi, Western', contactNumber: '026 456 7890', photoUrl: 'https://i.pravatar.cc/150?img=47' },
  { id: 'c5', firstName: 'Kwame', lastName: 'Boateng', dateOfBirth: '14/09/1992', nationality: 'Ghanaian', gender: 'Male', maritalStatus: 'Single', address: '56 Tamale Road, Tamale, Northern', contactNumber: '023 567 8901', photoUrl: 'https://i.pravatar.cc/150?img=14' },
  { id: 'c6', firstName: 'Abena', lastName: 'Owusu', dateOfBirth: '03/06/2000', nationality: 'Ghanaian', gender: 'Female', maritalStatus: 'Single', address: '19 Ho Street, Ho, Volta', contactNumber: '024 678 9012', photoUrl: 'https://i.pravatar.cc/150?img=44' },
  { id: 'c7', firstName: 'Michael', lastName: 'Essel', dateOfBirth: '17/04/1988', nationality: 'Ghanaian', gender: 'Male', maritalStatus: 'Divorced', address: '88 Sunyani Rd, Sunyani, Bono', contactNumber: '028 789 0123', photoUrl: 'https://i.pravatar.cc/150?img=33' },
  { id: 'c8', firstName: 'Nana', lastName: 'Yeboah', dateOfBirth: '25/12/1997', nationality: 'Ghanaian', gender: 'Female', maritalStatus: 'Single', address: '11 Bolgatanga Ave, Bolgatanga, UE', contactNumber: '020 890 1234', photoUrl: 'https://i.pravatar.cc/150?img=48' },
  { id: 'c9', firstName: 'John', middleName: 'Kwame', lastName: 'Mensah', dateOfBirth: '01/12/2000', nationality: 'Ghanaian', gender: 'Male', maritalStatus: 'Single', address: '123 Main Street, Tarkwa, Western Region', contactNumber: '024 123 4567', photoUrl: 'https://i.pravatar.cc/150?img=13' },
]

export const ID_CARDS: IDCard[] = [
  { cardId: 'GHA-2026-000123', citizenId: 'c1', status: 'Active', dateCreated: '09-Jun-2026', expiryDate: '09-Jun-2031', issuedBy: 'u1' },
  { cardId: 'GHA-2026-000124', citizenId: 'c2', status: 'Active', dateCreated: '09-Jun-2026', expiryDate: '09-Jun-2031', issuedBy: 'u1' },
  { cardId: 'GHA-2026-000125', citizenId: 'c3', status: 'Active', dateCreated: '08-Jun-2026', expiryDate: '08-Jun-2031', issuedBy: 'u1' },
  { cardId: 'GHA-2026-000126', citizenId: 'c4', status: 'Active', dateCreated: '08-Jun-2026', expiryDate: '08-Jun-2031', issuedBy: 'u1' },
  { cardId: 'GHA-2026-000127', citizenId: 'c5', status: 'Active', dateCreated: '07-Jun-2026', expiryDate: '07-Jun-2031', issuedBy: 'u1' },
  { cardId: 'GHA-2026-000210', citizenId: 'c6', status: 'Pending', dateCreated: '09-Jun-2026', expiryDate: '09-Jun-2031', issuedBy: 'u1' },
  { cardId: 'GHA-2026-000211', citizenId: 'c7', status: 'Pending', dateCreated: '09-Jun-2026', expiryDate: '09-Jun-2031', issuedBy: 'u1' },
  { cardId: 'GHA-2026-000212', citizenId: 'c8', status: 'Pending', dateCreated: '08-Jun-2026', expiryDate: '08-Jun-2031', issuedBy: 'u1' },
  { cardId: 'GHA-2026-000001', citizenId: 'c9', status: 'Active', dateCreated: '09/06/2026', expiryDate: '09/06/2031', issuedBy: 'u1' },
]

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'a1', action: 'ID Issued', performedBy: 'Reg. Officer', targetId: 'GHA-2026-000123', timestamp: '09 Jun 2026, 09:12', details: 'New ID card issued for Kofi Mensah' },
  { id: 'a2', action: 'ID Approved', performedBy: 'Verify Officer', targetId: 'GHA-2026-000122', timestamp: '09 Jun 2026, 08:45', details: 'Pending ID approved for citizen' },
  { id: 'a3', action: 'Login', performedBy: 'Reg. Officer', targetId: '-', timestamp: '09 Jun 2026, 08:30', details: 'Officer logged in from 192.168.1.10' },
  { id: 'a4', action: 'ID Revoked', performedBy: 'Super Admin', targetId: 'GHA-2026-000088', timestamp: '08 Jun 2026, 16:20', details: 'Card revoked due to reported loss' },
  { id: 'a5', action: 'ID Renewed', performedBy: 'Verify Officer', targetId: 'GHA-2026-000045', timestamp: '08 Jun 2026, 14:05', details: 'Expired card renewed for 5 years' },
]
