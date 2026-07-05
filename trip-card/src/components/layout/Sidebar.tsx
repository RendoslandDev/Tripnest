import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, FilePlus, Search, Clock, CreditCard,
  BarChart3, ScrollText, Settings, LogOut, Shield
} from 'lucide-react'
import { useAuthStore } from '../../store'

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [{ to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }],
  },
  {
    title: 'Registry',
    items: [
      { to: '/citizens', icon: Users, label: 'Citizens' },
      { to: '/issue-new', icon: FilePlus, label: 'Issue New ID' },
      { to: '/search', icon: Search, label: 'Search ID' },
    ],
  },
  {
    title: 'Workflow',
    items: [
      { to: '/pending', icon: Clock, label: 'Pending Approval' },
      { to: '/expired', icon: CreditCard, label: 'Expired Cards' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { to: '/reports', icon: BarChart3, label: 'Reports' },
      { to: '/audit', icon: ScrollText, label: 'Audit Logs' },
    ],
  },
  {
    title: 'System',
    items: [{ to: '/settings', icon: Settings, label: 'Settings' }],
  },
]

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  registration_officer: 'Registration Officer',
  verification_officer: 'Verification Officer',
}

export default function Sidebar() {
  const { currentUser, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="w-64 h-screen sticky top-0 bg-navy-950 flex flex-col border-r border-white/5">
      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/50">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-[15px] leading-none tracking-tight">
              TRIPNEST <span className="text-blue-400">ID</span>
            </p>
            <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest">Registration Authority</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map(group => (
          <div key={group.title}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {currentUser?.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold truncate">{currentUser?.name}</p>
            <p className="text-slate-500 text-[11px] truncate">{ROLE_LABELS[currentUser?.role || '']}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
