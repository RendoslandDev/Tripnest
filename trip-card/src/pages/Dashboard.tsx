import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, TrendingUp, Clock, XCircle, FilePlus, Search, ArrowRight } from 'lucide-react'
import { useDataStore, useAuthStore } from '../store'

const PIE_COLORS = ['#3B82F6', '#F59E0B', '#94A3B8', '#EF4444']

const BADGE_CLASS: Record<string, string> = {
  'Active': 'badge-active',
  'Expiring Soon': 'badge-expiring',
  'Inactive': 'badge-inactive',
  'Revoked': 'badge-revoked',
  'Pending': 'badge-pending',
}

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`badge ${BADGE_CLASS[status] || 'badge-inactive'}`}>{status}</span>
)

export default function Dashboard() {
  const { cards, citizens } = useDataStore()
  const { currentUser } = useAuthStore()
  const [greeting] = useState(() => {
    const h = new Date().getHours()
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  })

  const active = cards.filter(c => c.status === 'Active').length
  const expiring = cards.filter(c => c.status === 'Expiring Soon').length
  const inactive = cards.filter(c => c.status === 'Inactive').length
  const revoked = cards.filter(c => c.status === 'Revoked').length
  const pending = cards.filter(c => c.status === 'Pending').length
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

  const stats = [
    { label: 'Total IDs Issued', value: total, sub: 'All time', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Cards', value: active, sub: total ? `${Math.round(active / total * 100)}% of total` : '—', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Expiring Soon', value: expiring, sub: 'Next 30 days', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Inactive / Revoked', value: inactive + revoked, sub: 'All time', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ]

  return (
    <div className="p-8 space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 to-blue-800 text-white p-7 flex items-center justify-between shadow-lg shadow-blue-900/20">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{greeting}, {currentUser?.name.split(' ')[0]} 👋</h2>
          <p className="text-blue-200 text-sm mt-1">
            {pending > 0
              ? `You have ${pending} application${pending === 1 ? '' : 's'} waiting for approval.`
              : 'All applications are up to date. Nothing pending.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/issue-new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-blue-900 hover:bg-blue-50 transition-colors shadow-sm">
            <FilePlus size={16} /> Issue New ID
          </Link>
          <Link to="/search" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors">
            <Search size={16} /> Search
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-[28px] leading-none font-bold text-slate-900 tracking-tight">{value.toLocaleString()}</p>
              <p className="text-[13px] font-semibold text-slate-600 mt-2">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
            <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
              <Icon size={19} className={color} />
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Registrations */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <h2 className="font-bold text-slate-900 tracking-tight">Recent Registrations</h2>
            <Link to="/citizens" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50/70 border-y border-slate-100">
              <tr>
                <th className="th">Citizen</th>
                <th className="th">Card ID</th>
                <th className="th">Date Created</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(card => {
                const citizen = citizens.find(c => c.id === card.citizenId)
                if (!citizen) return null
                return (
                  <tr key={card.cardId} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <img src={citizen.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100" />
                        <span className="font-semibold text-slate-800">{citizen.firstName} {citizen.lastName}</span>
                      </div>
                    </td>
                    <td className="td font-mono text-xs">{card.cardId}</td>
                    <td className="td text-xs">{card.dateCreated}</td>
                    <td className="td"><StatusBadge status={card.status} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <h2 className="font-bold text-slate-900 tracking-tight mb-4">ID Statistics</h2>
          <div className="relative flex items-center justify-center" style={{ height: 170 }}>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={54} outerRadius={80} paddingAngle={3} cornerRadius={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{total}</p>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Total</p>
            </div>
          </div>
          <div className="space-y-2.5 mt-4">
            {pieData.map(({ name, value }, i) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-slate-600 font-medium">{name}</span>
                </div>
                <span className="text-slate-500 font-semibold">
                  {value} <span className="text-slate-400 font-normal">({total ? Math.round(value / total * 100) : 0}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
