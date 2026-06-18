import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import IssueNew from './pages/IssueNew'
import SearchID from './pages/SearchID'
import PendingApproval from './pages/PendingApproval'
import { Citizens, ExpiredCards, Reports, AuditLogs, Settings } from './pages/misc'
import DashboardLayout from './components/layout/DashboardLayout'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuthStore()
  return currentUser ? <>{children}</> : <Navigate to="/login" replace />
}``

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="citizens" element={<Citizens />} />
          <Route path="issue-new" element={<IssueNew />} />
          <Route path="search" element={<SearchID />} />
          <Route path="pending" element={<PendingApproval />} />
          <Route path="expired" element={<ExpiredCards />} />
          <Route path="reports" element={<Reports />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
