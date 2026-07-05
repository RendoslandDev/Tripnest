import { useState } from 'react'
import { Search } from 'lucide-react'
import { useDataStore } from '../store'
import IDCardFront from '../components/id-card/IDCardFront'
import IDCardBack from '../components/id-card/IDCardBack'

const StatusBadge = ({ status }: { status: string }) => {
  const cls: Record<string, string> = {
    'Active': 'badge-active', 'Expiring Soon': 'badge-expiring',
    'Inactive': 'badge-inactive', 'Revoked': 'badge-revoked', 'Pending': 'badge-pending',
  }
  return <span className={`badge ${cls[status] || 'badge-inactive'}`}>{status}</span>
}

export default function SearchID() {
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const { cards, citizens } = useDataStore()

  const results = searched && query
    ? cards.filter(c =>
        c.cardId.toLowerCase().includes(query.toLowerCase()) ||
        (() => {
          const cit = citizens.find(x => x.id === c.citizenId)
          return cit ? `${cit.firstName} ${cit.lastName}`.toLowerCase().includes(query.toLowerCase()) : false
        })()
      )
    : []

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Search ID</h1>

      <div className="card p-5 flex gap-3">
        <input
          className="input flex-1"
          placeholder="Enter Card ID (e.g. GHA-2026-000001) or citizen name"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setSearched(true)}
        />
        <button className="btn-primary" onClick={() => setSearched(true)}>
          <Search size={16} /> Search
        </button>
      </div>

      {searched && results.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          <Search size={40} className="mx-auto mb-3 text-slate-300" />
          <p className="font-medium">No records found for "{query}"</p>
          <p className="text-sm mt-1">Try a different Card ID or citizen name.</p>
        </div>
      )}

      {results.map(card => {
        const citizen = citizens.find(c => c.id === card.citizenId)
        if (!citizen) return null
        return (
          <div key={card.cardId} className="card p-6 space-y-5">
            {/* Citizen summary */}
            <div className="flex gap-5 items-start">
              <img src={citizen.photoUrl} alt="" className="w-20 h-20 rounded-xl object-cover border border-slate-200" />
              <div className="grid grid-cols-3 gap-x-8 gap-y-2 flex-1 text-sm">
                {[
                  ['Full Name', `${citizen.firstName} ${citizen.middleName ? citizen.middleName + ' ' : ''}${citizen.lastName}`],
                  ['Nationality', citizen.nationality],
                  ['Card ID', card.cardId],
                  ['Gender', citizen.gender],
                  ['Date Created', card.dateCreated],
                  ['Date of Birth', citizen.dateOfBirth],
                  ['Status', null],
                  ['Expiry Date', card.expiryDate],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <p className="text-xs text-slate-400 font-medium">{k}</p>
                    {k === 'Status'
                      ? <StatusBadge status={card.status} />
                      : <p className="font-semibold text-slate-800">{v}</p>
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Card previews */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">ID Card</p>
              <div className="flex gap-4 flex-wrap">
                <IDCardFront citizen={citizen} card={card} />
                <IDCardBack card={card} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
