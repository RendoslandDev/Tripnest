import { useDataStore, useAuthStore } from '../store'

export default function PendingApproval() {
  const { cards, citizens, updateCardStatus, addAuditLog } = useDataStore()
  const { currentUser } = useAuthStore()

  const pending = cards.filter(c => c.status === 'Pending')

  const approve = (cardId: string) => {
    updateCardStatus(cardId, 'Active')
    addAuditLog({
      action: 'ID Approved',
      performedBy: currentUser?.name || 'Officer',
      targetId: cardId,
      timestamp: new Date().toLocaleString(),
      details: `ID card approved and activated`,
    })
  }

  const reject = (cardId: string) => {
    updateCardStatus(cardId, 'Inactive')
    addAuditLog({
      action: 'ID Rejected',
      performedBy: currentUser?.name || 'Officer',
      targetId: cardId,
      timestamp: new Date().toLocaleString(),
      details: `ID card application rejected`,
    })
  }

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Pending Approval</h1>

      {pending.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          <p className="font-medium text-lg">No pending applications</p>
          <p className="text-sm mt-1">All submitted IDs have been reviewed.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Full Name', 'Card ID', 'Date Submitted', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pending.map(card => {
                const citizen = citizens.find(c => c.id === card.citizenId)
                if (!citizen) return null
                return (
                  <tr key={card.cardId} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={citizen.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                        <span className="font-medium text-slate-700">{citizen.firstName} {citizen.lastName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">{card.cardId}</td>
                    <td className="px-5 py-3 text-slate-500">{card.dateCreated}</td>
                    <td className="px-5 py-3">
                      <span className="badge badge-pending">Pending</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => approve(card.cardId)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => reject(card.cardId)}
                          className="px-3 py-1 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
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
