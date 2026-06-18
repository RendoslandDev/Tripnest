import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, TrendingUp, Clock, XCircle } from 'lucide-react'
import { useDataStore, useAuthStore } from '../store'

const PIE_COLORS = ['#3B82F6', '#F59E0B', '#6B7280', '#EF4444']

const StatusBadge = ({ status }: { status: string }) => {
  const cls: Record<string, string> = {
    'Active': 'badge-active',
    'Expiring Soon': 'badge-expiring',
    'Inactive': 'badge-inactive',
    'Revoked': 'badge-revoked',
    'Pending': 'badge-pending',
  }
  return <span className={`badge ${cls[status] || 'badge-inactive'}`}>{status}</span>
}

export default function Dashboard() {
  const { cards, citizens } = useDataStore()
  const { currentUser } = useAuthStore()

  const active = cards.filter(c => c.status === 'Active').length
  const expiring = cards.filter(c => c.status === 'Expiring Soon').length
  const inactive = cards.filter(c => c.status === 'Inactive').length
  const revoked = cards.filter(c => c.status === 'Revoked').length
  const total = cards.length

  const pieData = [
    { name: 'Active', value: active },
    { name: 'Expiring Soon', value: expiring },
    { name: 'Inactive', value: inactive },
    { name: 'Revoked', value: revoked },
  ]

  const recent = [...cards]
    .filter(c => c.status !== 'Pending')
    .slice(-5)
    .reverse()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 text-xs">
            {currentUser?.name[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-xs">{currentUser?.name}</p>
            <p className="text-slate-500 text-[10px]">Registration Officer</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total IDs Issued', value: total, sub: 'All time', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Cards', value: active, sub: `${Math.round(active/total*100)}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Expiring Soon', value: expiring, sub: 'Next 30 days', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Inactive / Revoked', value: inactive + revoked, sub: 'All time', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div>
              <p className="text-2xl font-bold text-slate-800">{value.toLocaleString()}</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
            <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center`}>
              <Icon size={18} className={color} />
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-5">
        {/* Recent Registrations */}
        <div className="col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Recent Registrations</h2>
            <button className="text-xs text-blue-600 hover:underline">View all</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-100">
                <th className="text-left pb-2 font-medium">Full Name</th>
                <th className="text-left pb-2 font-medium">Card ID</th>
                <th className="text-left pb-2 font-medium">Date Created</th>
                <th className="text-left pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(card => {
                const citizen = citizens.find(c => c.id === card.citizenId)
                if (!citizen) return null
                return (
                  <tr key={card.cardId} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <img src={citizen.photoUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                        <span className="font-medium text-slate-700">{citizen.firstName} {citizen.lastName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 font-mono text-xs text-slate-600">{card.cardId}</td>
                    <td className="py-2.5 text-slate-500 text-xs">{card.dateCreated}</td>
                    <td className="py-2.5"><StatusBadge status={card.status} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">ID Statistics</h2>
          <div className="relative flex items-center justify-center" style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <p className="text-xl font-bold text-slate-800">{total}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </div>
          <div className="space-y-1.5 mt-2">
            {[
              { label: 'Active', value: active, pct: Math.round(active/total*100), color: '#3B82F6' },
              { label: 'Expiring Soon', value: expiring, pct: Math.round(expiring/total*100), color: '#F59E0B' },
              { label: 'Inactive', value: inactive, pct: Math.round(inactive/total*100), color: '#6B7280' },
              { label: 'Revoked', value: revoked, pct: Math.round(revoked/total*100), color: '#EF4444' },
            ].map(({ label, value, pct, color }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-slate-600">{label}</span>
                </div>
                <span className="text-slate-500">{value} ({pct}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
