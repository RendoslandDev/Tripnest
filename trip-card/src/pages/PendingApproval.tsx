import { useEffect, useState } from 'react'
import { useAuthStore } from '../store'
import { api, ApiError } from '../api/client'
import { fmtDateTime } from '../lib/format'
import { CitizenAvatar } from '../components/CitizenPhoto'
import type { Application } from '../types'

export default function PendingApproval() {
  const { currentUser } = useAuthStore()
  const [pending, setPending] = useState<Application[]>([])
  const [busyId, setBusyId] = useState('')
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const load = () =>
    api.applications.pending()
      .then(setPending)
      .catch(err => setMessage({
        type: 'err',
        text: err instanceof ApiError && err.status === 403
          ? 'Only Super Admins and Verification Officers can review applications.'
          : err instanceof ApiError ? err.message : 'Failed to load applications',
      }))

  useEffect(() => { load() }, [])

  const canIssue = currentUser?.role === 'SuperAdmin' || currentUser?.role === 'RegistrationOfficer'

  const approve = async (app: Application) => {
    setBusyId(app.id)
    setMessage(null)
    try {
      await api.applications.review(app.id, 'Approved')
      let text = `Application for ${app.citizenName} approved.`
      // Approval only makes the citizen eligible; issuing is a separate
      // registration-side permission, so attempt it when this role has it.
      if (canIssue) {
        try {
          const card = await api.idCards.issue(app.citizenId)
          text = `Application approved and card ${card.cardId} issued for ${app.citizenName}.`
        } catch (err) {
          text += ` Card not issued yet: ${err instanceof ApiError ? err.message : 'issue failed'}`
        }
      } else {
        text += ' A registration officer can now issue the card.'
      }
      setMessage({ type: 'ok', text })
      await load()
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof ApiError ? err.message : 'Approval failed' })
    } finally {
      setBusyId('')
    }
  }

  const reject = async (app: Application) => {
    const reason = window.prompt(`Reason for rejecting ${app.citizenName}'s application:`)
    if (!reason?.trim()) return
    setBusyId(app.id)
    setMessage(null)
    try {
      await api.applications.review(app.id, 'Rejected', reason.trim())
      setMessage({ type: 'ok', text: `Application for ${app.citizenName} rejected.` })
      await load()
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof ApiError ? err.message : 'Rejection failed' })
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Pending Approval</h1>

      {message && (
        <p className={`text-sm px-3.5 py-2.5 rounded-xl border ${
          message.type === 'ok'
            ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
            : 'text-red-600 bg-red-50 border-red-100'
        }`}>{message.text}</p>
      )}

      {pending.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          <p className="font-medium text-lg">No pending applications</p>
          <p className="text-sm mt-1">All submitted applications have been reviewed.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Full Name', 'NIN', 'Date Submitted', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pending.map(app => (
                <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <CitizenAvatar citizenId={app.citizenId} name={app.citizenName} />
                      <span className="font-medium text-slate-700">{app.citizenName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">{app.nin}</td>
                  <td className="px-5 py-3 text-slate-500">{fmtDateTime(app.submittedAt)}</td>
                  <td className="px-5 py-3">
                    <span className="badge badge-pending">{app.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => approve(app)}
                        disabled={busyId === app.id}
                        className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {busyId === app.id ? 'Working…' : 'Approve'}
                      </button>
                      <button
                        onClick={() => reject(app)}
                        disabled={busyId === app.id}
                        className="px-3 py-1 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
