import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, TrendingUp, Clock, XCircle, FilePlus, Search, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store'
import { api, ApiError } from '../api/client'
import { fmtDate } from '../lib/format'
import { CitizenAvatar } from '../components/CitizenPhoto'
import type { DashboardStats, RecentRegistration } from '../types'

const PIE_COLORS = ['#3B82F6', '#F59E0B', '#EF4444']

export default function Dashboard() {
  const { currentUser } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recent, setRecent] = useState<RecentRegistration[]>([])
  const [error, setError] = useState('')
  const [greeting] = useState(() => {
    const h = new Date().getHours()
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  })

  useEffect(() => {
    Promise.all([api.dashboard.stats(), api.dashboard.recentRegistrations()])
      .then(([s, r]) => { setStats(s); setRecent(r) })
      .catch(err => setError(err instanceof ApiError ? err.message : 'Failed to load dashboard'))
  }, [])

  const total = stats?.totalIds ?? 0
  const pending = stats?.pendingVerifications ?? 0

  const pieData = [
    { name: 'Active', value: stats?.activeCards ?? 0 },
    { name: 'Expiring Soon', value: stats?.expiringSoon ?? 0 },
    { name: 'Inactive / Revoked', value: stats?.inactiveRevoked ?? 0 },
  ]

  const statCards = [
    { label: 'Total IDs Issued', value: total, sub: 'All time', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Cards', value: stats?.activeCards ?? 0, sub: total ? `${Math.round((stats?.activeCards ?? 0) / total * 100)}% of total` : '—', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Expiring Soon', value: stats?.expiringSoon ?? 0, sub: 'Next 30 days', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Inactive / Revoked', value: stats?.inactiveRevoked ?? 0, sub: 'All time', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ]

  return (
    <div className="p-8 space-y-6">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-xl">{error}</p>
      )}

      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 to-blue-800 text-white p-7 flex items-center justify-between shadow-lg shadow-blue-900/20">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{greeting}, {currentUser?.fullName.split(' ')[0]} 👋</h2>
          <p className="text-blue-200 text-sm mt-1">
            {pending > 0
              ? `You have ${pending} application${pending === 1 ? '' : 's'} waiting for review.`
              : 'All applications are up to date. Nothing pending.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/issue-new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-blue-900 hover:bg-blue-50 transition-colors shadow-sm">
            <FilePlus size={16} /> Register Citizen
          </Link>
          <Link to="/search" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors">
            <Search size={16} /> Search
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
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
                <th className="th">Gender</th>
                <th className="th">Date of Birth</th>
                <th className="th">Registered</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(reg => (
                <tr key={reg.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <CitizenAvatar citizenId={reg.id} name={reg.fullName} />
                      <span className="font-semibold text-slate-800">{reg.fullName}</span>
                    </div>
                  </td>
                  <td className="td text-xs">{reg.gender}</td>
                  <td className="td text-xs">{fmtDate(reg.dateOfBirth)}</td>
                  <td className="td text-xs">{fmtDate(reg.createdAt)}</td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td className="td text-center text-slate-400 text-sm py-8" colSpan={4}>
                    No registrations yet — register the first citizen to get started.
                  </td>
                </tr>
              )}
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
