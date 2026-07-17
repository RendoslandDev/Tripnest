import { Shield, UserRound } from 'lucide-react'
import { fmtDate } from '../../lib/format'

export interface CardCitizenInfo {
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string
  nationality: string
  gender: string
  maritalStatus: string
  nin?: string
}

export interface CardInfo {
  cardId: string
  dateCreated: string
  expiryDate: string
}

interface Props {
  citizen: CardCitizenInfo
  card: CardInfo
  photoSrc?: string | null
}

export default function IDCardFront({ citizen, card, photoSrc }: Props) {
  return (
    <div
      id="id-card-front"
      className="w-[340px] h-[210px] rounded-xl overflow-hidden relative text-white"
      style={{ background: 'linear-gradient(135deg, #0F1C3F 0%, #1E40AF 100%)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">
            <Shield size={12} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold leading-none">TRIPNEST <span className="text-blue-300">ID</span></p>
            <p className="text-[9px] text-blue-200">REGISTRATION AUTHORITY</p>
          </div>
        </div>
        {/* Ghana flag colors */}
        <div className="flex gap-0.5">
          <div className="w-4 h-3 bg-red-500 rounded-sm" />
          <div className="w-4 h-3 bg-yellow-400 rounded-sm" />
          <div className="w-4 h-3 bg-green-500 rounded-sm" />
        </div>
      </div>

      {/* Body */}
      <div className="flex px-4 pt-2 gap-3">
        {photoSrc ? (
          <img
            src={photoSrc}
            alt="citizen"
            className="w-16 h-20 object-cover rounded-md border-2 border-blue-400/50 flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-20 rounded-md border-2 border-blue-400/50 flex-shrink-0 bg-blue-900/40 flex items-center justify-center">
            <UserRound size={28} className="text-blue-300" />
          </div>
        )}
        <div className="flex-1 space-y-1">
          <div>
            <p className="text-[9px] text-blue-300 uppercase">Full Name</p>
            <p className="text-sm font-bold leading-tight">
              {citizen.firstName} {citizen.middleName ? citizen.middleName + ' ' : ''}{citizen.lastName}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {[
              ['Date of Birth', fmtDate(citizen.dateOfBirth)],
              ['Nationality', citizen.nationality],
              ['Gender', citizen.gender],
              ['Marital Status', citizen.maritalStatus],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[8px] text-blue-300 uppercase">{k}</p>
                <p className="text-[10px] font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[9px] text-blue-300 uppercase">Card ID</p>
            <p className="text-sm font-bold text-yellow-300 font-mono">{card.cardId}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-1.5 bg-blue-900/50 flex justify-between text-[9px] text-blue-200">
        <span>Date Created: <strong className="text-white">{fmtDate(card.dateCreated)}</strong></span>
        <span>Expiry Date: <strong className="text-white">{fmtDate(card.expiryDate)}</strong></span>
      </div>
    </div>
  )
}
