import { useEffect, useRef, useState } from 'react'
import { Fingerprint, CreditCard, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '../store'
import { api, ApiError } from '../api/client'
import { fmtDate, fmtDateTime, displayCardStatus, STATUS_BADGE_CLASS } from '../lib/format'
import { CitizenAvatar } from '../components/CitizenPhoto'
import type { AuditLog, Citizen, DashboardStats, IdCard, Role } from '../types'

type Banner = { type: 'ok' | 'err'; text: string } | null

const BannerMsg = ({ banner }: { banner: Banner }) =>
  banner && (
    <p className={`text-sm px-3.5 py-2.5 rounded-xl border ${
      banner.type === 'ok'
        ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
        : 'text-red-600 bg-red-50 border-red-100'
    }`}>{banner.text}</p>
  )

const errText = (err: unknown, fallback: string) =>
  err instanceof ApiError ? [err.message, ...err.errors].join(' — ') : fallback

export function Citizens() {
  const { currentUser } = useAuthStore()
  const [citizens, setCitizens] = useState<Citizen[]>([])
  const [banner, setBanner] = useState<Banner>(null)
  const [busyId, setBusyId] = useState('')
  const fpInputRef = useRef<HTMLInputElement>(null)
  const fpTargetRef = useRef<Citizen | null>(null)

  const canRegister = currentUser?.role === 'SuperAdmin' || currentUser?.role === 'RegistrationOfficer'

  const load = () =>
    api.citizens.list(1, 100)
      .then(res => setCitizens(res.items))
      .catch(err => setBanner({ type: 'err', text: errText(err, 'Failed to load citizens') }))

  useEffect(() => { load() }, [])

  const issueCard = async (citizen: Citizen) => {
    setBusyId(citizen.id)
    setBanner(null)
    try {
      const card = await api.idCards.issue(citizen.id)
      setBanner({ type: 'ok', text: `Card ${card.cardId} issued for ${citizen.firstName} ${citizen.lastName}.` })
      await load()
    } catch (err) {
      setBanner({ type: 'err', text: errText(err, 'Card issue failed') })
    } finally {
      setBusyId('')
    }
  }

  const pickFingerprint = (citizen: Citizen) => {
    fpTargetRef.current = citizen
    fpInputRef.current?.click()
  }

  const enrollFingerprint = async (file: File) => {
    const citizen = fpTargetRef.current
    if (!citizen) return
    setBusyId(citizen.id)
    setBanner(null)
    try {
      await api.biometrics.enroll(citizen.id, file)
      setBanner({ type: 'ok', text: `Fingerprint enrolled for ${citizen.firstName} ${citizen.lastName}.` })
    } catch (err) {
      setBanner({ type: 'err', text: errText(err, 'Fingerprint enrollment failed') })
    } finally {
      setBusyId('')
      if (fpInputRef.current) fpInputRef.current.value = ''
    }
  }

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Citizens</h1>
      <BannerMsg banner={banner} />
      <input
        ref={fpInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) enrollFingerprint(f) }}
      />
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Citizen', 'NIN', 'Gender', 'DOB', 'Contact', 'Card Status', ...(canRegister ? ['Actions'] : [])].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {citizens.map(c => {
              const status = c.idCard ? displayCardStatus(c.idCard.status, c.idCard.expiryDate) : null
              return (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <CitizenAvatar citizenId={c.id} name={`${c.firstName} ${c.lastName}`} hasPhoto={!!c.photoPath} />
                      <div>
                        <p className="font-medium text-slate-700">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-slate-400">{c.idCard?.cardId || 'No card'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">{c.nin}</td>
                  <td className="px-5 py-3 text-slate-600">{c.gender}</td>
                  <td className="px-5 py-3 text-slate-600">{fmtDate(c.dateOfBirth)}</td>
                  <td className="px-5 py-3 text-slate-600">{c.contactNumber}</td>
                  <td className="px-5 py-3">
                    {status
                      ? <span className={`badge ${STATUS_BADGE_CLASS[status] || ''}`}>{status}</span>
                      : <span className="text-slate-400 text-xs">No card</span>}
                  </td>
                  {canRegister && (
                    <td className="px-5 py-3">
                      {!c.idCard && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => pickFingerprint(c)}
                            disabled={busyId === c.id}
                            title="Enroll fingerprint (image file)"
                            className="inline-flex items-center gap-1 px-2.5 py-1 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                          >
                            <Fingerprint size={12} /> Fingerprint
                          </button>
                          <button
                            onClick={() => issueCard(c)}
                            disabled={busyId === c.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            <CreditCard size={12} /> {busyId === c.id ? 'Working…' : 'Issue Card'}
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
            {citizens.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-slate-400" colSpan={7}>No citizens registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ExpiredCards() {
  const { currentUser } = useAuthStore()
  const [cards, setCards] = useState<IdCard[]>([])
  const [banner, setBanner] = useState<Banner>(null)
  const [busyId, setBusyId] = useState('')

  const canRenew = currentUser?.role === 'SuperAdmin' || currentUser?.role === 'RegistrationOfficer'

  const load = () =>
    api.idCards.expiring()
      .then(setCards)
      .catch(err => setBanner({ type: 'err', text: errText(err, 'Failed to load cards') }))

  useEffect(() => { load() }, [])

  const renew = async (card: IdCard) => {
    setBusyId(card.cardId)
    setBanner(null)
    try {
      const renewed = await api.idCards.renew(card.cardId)
      setBanner({ type: 'ok', text: `Card ${card.cardId} renewed until ${fmtDate(renewed.expiryDate)}.` })
      await load()
    } catch (err) {
      setBanner({ type: 'err', text: errText(err, 'Renewal failed') })
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Expired / Expiring Cards</h1>
      <BannerMsg banner={banner} />
      {cards.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          <p className="font-medium">No expiring or expired cards</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Citizen', 'Card ID', 'Expiry Date', 'Status', ...(canRenew ? ['Action'] : [])].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cards.map(card => {
                const status = displayCardStatus(card.status, card.expiryDate)
                return (
                  <tr key={card.cardId} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <CitizenAvatar citizenId={card.citizenId} name={card.citizenFullName} />
                        <span className="font-medium text-slate-700">{card.citizenFullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">{card.cardId}</td>
                    <td className="px-5 py-3 text-slate-600">{fmtDate(card.expiryDate)}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${STATUS_BADGE_CLASS[status] || 'badge-inactive'}`}>{status}</span>
                    </td>
                    {canRenew && (
                      <td className="px-5 py-3">
                        <button
                          onClick={() => renew(card)}
                          disabled={busyId === card.cardId}
                          className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {busyId === card.cardId ? 'Renewing…' : 'Renew'}
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function Reports() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [banner, setBanner] = useState<Banner>(null)

  useEffect(() => {
    api.dashboard.stats()
      .then(setStats)
      .catch(err => setBanner({ type: 'err', text: errText(err, 'Failed to load stats') }))
  }, [])

  const total = stats?.totalIds ?? 0
  const rows = [
    { label: 'Active Cards', count: stats?.activeCards ?? 0 },
    { label: 'Expiring Soon', count: stats?.expiringSoon ?? 0 },
    { label: 'Inactive / Revoked', count: stats?.inactiveRevoked ?? 0 },
    { label: 'Pending Applications', count: stats?.pendingVerifications ?? 0 },
    { label: 'Total IDs Issued', count: total },
  ]

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
      <BannerMsg banner={banner} />
      <div className="grid grid-cols-3 gap-4">
        {rows.map(({ label, count }) => (
          <div key={label} className="card p-5">
            <p className="text-3xl font-bold text-slate-800">{count}</p>
            <p className="text-sm font-medium text-slate-600 mt-1">{label}</p>
            <div className="mt-3 h-1.5 bg-slate-100 rounded-full">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${total ? Math.min(100, (count / total) * 100) : 0}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{total ? Math.round((count / total) * 100) : 0}% of issued cards</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [banner, setBanner] = useState<Banner>(null)

  useEffect(() => {
    api.audit.logs(page, 20)
      .then(res => { setLogs(res.logs); setTotalPages(res.pagination.totalPages) })
      .catch(err => setBanner({
        type: 'err',
        text: err instanceof ApiError && err.status === 403
          ? 'Audit logs are only visible to Super Admins.'
          : errText(err, 'Failed to load audit logs'),
      }))
  }, [page])

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Audit Logs</h1>
      <BannerMsg banner={banner} />
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Action', 'Performed By', 'Entity', 'Target ID', 'Timestamp', 'Details'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded">{log.action}</span>
                </td>
                <td className="px-5 py-3 text-slate-700 font-medium">{log.officerName}</td>
                <td className="px-5 py-3 text-slate-500 text-xs">{log.entity}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{log.entityId || '—'}</td>
                <td className="px-5 py-3 text-slate-500 text-xs">{fmtDateTime(log.performedAt)}</td>
                <td className="px-5 py-3 text-slate-500 text-xs">{log.details}</td>
              </tr>
            ))}
            {logs.length === 0 && !banner && (
              <tr><td className="px-5 py-8 text-center text-slate-400" colSpan={6}>No audit entries yet.</td></tr>
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 text-xs">
            <button className="btn-outline px-3 py-1.5" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span className="text-slate-500 font-medium">Page {page} of {totalPages}</span>
            <button className="btn-outline px-3 py-1.5" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  )
}

export function Settings() {
  const { currentUser } = useAuthStore()
  const [banner, setBanner] = useState<Banner>(null)

  // Change password
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwBusy, setPwBusy] = useState(false)

  // Register officer (SuperAdmin)
  const [officer, setOfficer] = useState({ fullName: '', email: '', password: '', role: 'RegistrationOfficer' as Role })
  const [regBusy, setRegBusy] = useState(false)

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwBusy(true)
    setBanner(null)
    try {
      await api.auth.changePassword(currentPw, newPw)
      setBanner({ type: 'ok', text: 'Password changed successfully.' })
      setCurrentPw(''); setNewPw('')
    } catch (err) {
      setBanner({ type: 'err', text: errText(err, 'Password change failed') })
    } finally {
      setPwBusy(false)
    }
  }

  const registerOfficer = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegBusy(true)
    setBanner(null)
    try {
      const created = await api.auth.registerOfficer(officer.fullName, officer.email, officer.password, officer.role)
      setBanner({ type: 'ok', text: `Officer ${created.fullName} (${created.role}) registered.` })
      setOfficer({ fullName: '', email: '', password: '', role: 'RegistrationOfficer' })
    } catch (err) {
      setBanner({ type: 'err', text: errText(err, 'Officer registration failed') })
    } finally {
      setRegBusy(false)
    }
  }

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
      <BannerMsg banner={banner} />

      <div className="card p-6 max-w-lg">
        <h2 className="font-bold text-slate-900 tracking-tight mb-1">Change Password</h2>
        <p className="text-xs text-slate-500 mb-5">Signed in as {currentUser?.fullName} ({currentUser?.role})</p>
        <form onSubmit={changePassword} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input type="password" className="input" value={currentPw} onChange={e => setCurrentPw(e.target.value)} required />
          </div>
          <div>
            <label className="label">New Password (min. 8 characters)</label>
            <input type="password" className="input" value={newPw} onChange={e => setNewPw(e.target.value)} minLength={8} required />
          </div>
          <button type="submit" className="btn-primary" disabled={pwBusy}>
            {pwBusy ? 'Saving…' : 'Change Password'}
          </button>
        </form>
      </div>

      {currentUser?.role === 'SuperAdmin' && (
        <div className="card p-6 max-w-lg">
          <h2 className="font-bold text-slate-900 tracking-tight mb-1 flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-600" /> Register Officer
          </h2>
          <p className="text-xs text-slate-500 mb-5">Create registration and verification officer accounts.</p>
          <form onSubmit={registerOfficer} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={officer.fullName} onChange={e => setOfficer(o => ({ ...o, fullName: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={officer.email} onChange={e => setOfficer(o => ({ ...o, email: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Password (min. 8 characters)</label>
              <input type="password" className="input" value={officer.password} onChange={e => setOfficer(o => ({ ...o, password: e.target.value }))} minLength={8} required />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" value={officer.role} onChange={e => setOfficer(o => ({ ...o, role: e.target.value as Role }))}>
                <option value="RegistrationOfficer">Registration Officer</option>
                <option value="VerificationOfficer">Verification Officer</option>
                <option value="SuperAdmin">Super Admin</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={regBusy}>
              {regBusy ? 'Registering…' : 'Register Officer'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
