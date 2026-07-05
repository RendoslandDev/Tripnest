import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'
import Sidebar from './Sidebar'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of registrations and card activity' },
  '/citizens': { title: 'Citizens', subtitle: 'All registered citizens in the system' },
  '/issue-new': { title: 'Issue New ID', subtitle: 'Register a citizen and generate an ID card' },
  '/search': { title: 'Search ID', subtitle: 'Look up and verify a citizen ID' },
  '/pending': { title: 'Pending Approval', subtitle: 'Applications awaiting review' },
  '/expired': { title: 'Expired Cards', subtitle: 'Cards that are expired or expiring soon' },
  '/reports': { title: 'Reports', subtitle: 'Card issuance statistics and breakdowns' },
  '/audit': { title: 'Audit Logs', subtitle: 'Trail of every action performed in the system' },
  '/settings': { title: 'Settings', subtitle: 'System configuration and preferences' },
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const page = PAGE_TITLES[pathname] || { title: 'TripNest ID', subtitle: '' }
  const [today] = useState(() =>
    new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  )

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200/70 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">{page.title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{page.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3.5 py-2 rounded-full">
            <CalendarDays size={14} />
            {today}
          </div>
        </header>

        <main className="flex-1 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
