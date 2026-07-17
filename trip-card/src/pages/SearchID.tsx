import { useEffect, useState } from 'react'
import { Search, Download } from 'lucide-react'
import { api, ApiError } from '../api/client'
import { fmtDate, displayCardStatus, STATUS_BADGE_CLASS } from '../lib/format'
import { useCitizenPhoto } from '../hooks/useCitizenPhoto'
import IDCardFront from '../components/id-card/IDCardFront'
import IDCardBack from '../components/id-card/IDCardBack'
import type { Citizen, IdCard } from '../types'

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`badge ${STATUS_BADGE_CLASS[status] || 'badge-inactive'}`}>{status}</span>
)

function CitizenResult({ citizen }: { citizen: Citizen }) {
  const photo = useCitizenPhoto(citizen.id, !!citizen.photoPath)
  const [card, setCard] = useState<IdCard | null>(null)
  const [downloading, setDownloading] = useState(false)

  // Fetch full card details (search only returns a summary without dateCreated).
  useEffect(() => {
    if (citizen.idCard) {
      api.idCards.get(citizen.idCard.cardId).then(setCard).catch(() => null)
    }
  }, [citizen.idCard])

  const summary = citizen.idCard
  const status = summary ? displayCardStatus(summary.status, summary.expiryDate) : null

  const downloadPdf = async () => {
    if (!summary) return
    setDownloading(true)
    try {
      const blob = await api.idCards.downloadPdf(summary.cardId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${summary.cardId}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="card p-6 space-y-5">
      {/* Citizen summary */}
      <div className="flex gap-5 items-start">
        {photo
          ? <img src={photo} alt="" className="w-20 h-20 rounded-xl object-cover border border-slate-200" />
          : <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {citizen.firstName[0]}{citizen.lastName[0]}
            </div>}
        <div className="grid grid-cols-3 gap-x-8 gap-y-2 flex-1 text-sm">
          {([
            ['Full Name', `${citizen.firstName} ${citizen.middleName ? citizen.middleName + ' ' : ''}${citizen.lastName}`],
            ['NIN', citizen.nin],
            ['Card ID', summary?.cardId ?? 'Not issued'],
            ['Gender', citizen.gender],
            ['Nationality', citizen.nationality],
            ['Date of Birth', fmtDate(citizen.dateOfBirth)],
            ['Status', null],
            ['Expiry Date', summary ? fmtDate(summary.expiryDate) : '—'],
            ['Contact', citizen.contactNumber],
          ] as [string, string | null][]).map(([k, v]) => (
            <div key={k}>
              <p className="text-xs text-slate-400 font-medium">{k}</p>
              {k === 'Status'
                ? (status ? <StatusBadge status={status} /> : <span className="text-slate-400 text-xs">No card</span>)
                : <p className="font-semibold text-slate-800">{v}</p>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Card previews */}
      {summary && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">ID Card</p>
            <button onClick={downloadPdf} disabled={downloading} className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 cursor-pointer">
              <Download size={13} /> {downloading ? 'Downloading…' : 'Download PDF'}
            </button>
          </div>
          <div className="flex gap-4 flex-wrap">
            <IDCardFront
              citizen={citizen}
              card={{
                cardId: summary.cardId,
                dateCreated: card?.dateCreated ?? '',
                expiryDate: summary.expiryDate,
              }}
              photoSrc={photo}
            />
            <IDCardBack card={{ cardId: summary.cardId }} nin={citizen.nin} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchID() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Citizen[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    try {
      setResults(await api.citizens.search(query.trim()))
      setSearched(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Search ID</h1>

      <div className="card p-5 flex gap-3">
        <input
          className="input flex-1"
          placeholder="Enter NIN (e.g. GHA-123456789-0), citizen name or phone number"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <button className="btn-primary" onClick={search} disabled={loading}>
          <Search size={16} /> {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-xl">{error}</p>
      )}

      {searched && !loading && results.length === 0 && !error && (
        <div className="card p-8 text-center text-slate-500">
          <Search size={40} className="mx-auto mb-3 text-slate-300" />
          <p className="font-medium">No records found for "{query}"</p>
          <p className="text-sm mt-1">Try a different NIN, name or phone number.</p>
        </div>
      )}

      {results.map(citizen => <CitizenResult key={citizen.id} citizen={citizen} />)}
    </div>
  )
}
