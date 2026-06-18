import { useDataStore } from '../store'

export function Citizens() {
  const { citizens, cards } = useDataStore()
  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Citizens</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Citizen', 'Nationality', 'Gender', 'DOB', 'Contact', 'Card Status'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {citizens.map(c => {
              const card = cards.find(x => x.citizenId === c.id)
              const statusClass: Record<string, string> = {
                'Active': 'badge-active', 'Pending': 'badge-pending',
                'Expiring Soon': 'badge-expiring', 'Inactive': 'badge-inactive', 'Revoked': 'badge-revoked',
              }
              return (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={c.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-slate-700">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-slate-400">{card?.cardId || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{c.nationality}</td>
                  <td className="px-5 py-3 text-slate-600">{c.gender}</td>
                  <td className="px-5 py-3 text-slate-600">{c.dateOfBirth}</td>
                  <td className="px-5 py-3 text-slate-600">{c.contactNumber}</td>
                  <td className="px-5 py-3">
                    {card ? <span className={`badge ${statusClass[card.status] || ''}`}>{card.status}</span> : <span className="text-slate-400 text-xs">No card</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ExpiredCards() {
  const { cards, citizens, updateCardStatus, addAuditLog } = useDataStore()
  const expiring = cards.filter(c => c.status === 'Expiring Soon' || c.status === 'Inactive')

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Expired / Expiring Cards</h1>
      {expiring.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          <p className="font-medium">No expiring or expired cards</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Citizen', 'Card ID', 'Expiry Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expiring.map(card => {
                const citizen = citizens.find(c => c.id === card.citizenId)
                if (!citizen) return null
                return (
                  <tr key={card.cardId} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <img src={citizen.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                        <span className="font-medium text-slate-700">{citizen.firstName} {citizen.lastName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">{card.cardId}</td>
                    <td className="px-5 py-3 text-slate-600">{card.expiryDate}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${card.status === 'Expiring Soon' ? 'badge-expiring' : 'badge-inactive'}`}>{card.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => {
                          updateCardStatus(card.cardId, 'Active')
                          addAuditLog({ action: 'ID Renewed', performedBy: 'Officer', targetId: card.cardId, timestamp: new Date().toLocaleString(), details: 'Card renewed' })
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Renew
                      </button>
                    </td>
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
  const { cards } = useDataStore()
  const byStatus = ['Active', 'Expiring Soon', 'Inactive', 'Revoked', 'Pending'].map(s => ({
    status: s,
    count: cards.filter(c => c.status === s).length
  }))

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
      <div className="grid grid-cols-3 gap-4">
        {byStatus.map(({ status, count }) => (
          <div key={status} className="card p-5">
            <p className="text-3xl font-bold text-slate-800">{count}</p>
            <p className="text-sm font-medium text-slate-600 mt-1">{status} Cards</p>
            <div className="mt-3 h-1.5 bg-slate-100 rounded-full">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${cards.length ? (count / cards.length) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{cards.length ? Math.round((count / cards.length) * 100) : 0}% of total</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AuditLogs() {
  const { auditLogs } = useDataStore()
  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Audit Logs</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Action', 'Performed By', 'Target ID', 'Timestamp', 'Details'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {auditLogs.map(log => (
              <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded">{log.action}</span>
                </td>
                <td className="px-5 py-3 text-slate-700 font-medium">{log.performedBy}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{log.targetId}</td>
                <td className="px-5 py-3 text-slate-500 text-xs">{log.timestamp}</td>
                <td className="px-5 py-3 text-slate-500 text-xs">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Settings</h1>
      <div className="card p-6 max-w-lg">
        <p className="text-slate-500 text-sm">System settings and configuration options will appear here.</p>
      </div>
    </div>
  )
}
