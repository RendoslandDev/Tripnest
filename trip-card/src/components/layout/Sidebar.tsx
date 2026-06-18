import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, FilePlus, Search, Clock, CreditCard,
  BarChart3, ScrollText, Settings, LogOut, Shield
} from 'lucide-react'
import { useAuthStore } from '../../store'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/citizens', icon: Users, label: 'Citizens' },
  { to: '/issue-new', icon: FilePlus, label: 'Issue New ID' },
  { to: '/search', icon: Search, label: 'Search ID' },
  { to: '/pending', icon: Clock, label: 'Pending Approval' },
  { to: '/expired', icon: CreditCard, label: 'Expired Cards' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/audit', icon: ScrollText, label: 'Audit Logs' },
  { to: '/settings', icon: Settings, label: 'Settings' },
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
    <aside className="w-60 min-h-screen bg-[#0F1C3F] flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">TRIPNEST <span className="text-blue-400">ID</span></p>
            <p className="text-blue-300 text-[10px] mt-0.5">Registration Authority</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 mb-2">
          <p className="text-white text-sm font-semibold">{currentUser?.name}</p>
          <p className="text-blue-300 text-xs">{ROLE_LABELS[currentUser?.role || '']}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-900/30 w-full transition-all"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
