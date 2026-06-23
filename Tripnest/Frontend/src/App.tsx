import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MarketplaceLayout from './layouts/MarketplaceLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LandlordHome from './pages/landlord/LandlordHome';
import PagePlaceholder from './components/PagePlaceholder';
import type { ReactNode } from 'react';
import { TENANT_NAV_ITEMS } from './components/tenant/navConfig';
import HomePage from './pages/tenant/HomePage';
import SearchPage from './pages/tenant/SearchPage';
import SavedPage from './pages/tenant/SavedPage';
import PropertyDetailPage from './pages/tenant/PropertyDetailPage';
import BookingsPage from './pages/tenant/BookingsPage';
import AgreementsPage from './pages/tenant/AgreementsPage';
import PaymentsPage from './pages/tenant/PaymentsPage';
import MessagesPage from './pages/tenant/MessagesPage';
import NotificationsPage from './pages/tenant/NotificationsPage';
import ServiceDirectory from './pages/tenant/ServiceDirectory';
import MaintenancePage from './pages/tenant/MaintenancePage';
import ProfilePage from './pages/tenant/ProfilePage';
import SettingsPage from './pages/tenant/SettingsPage';
import HelpPage from './pages/tenant/HelpPage';
import OverviewPage from './pages/OverviewPage';
import ReservationPage from './pages/ReservationPage';
import CalendarPage from './pages/CalendarPage';
import PricingPage from './pages/PricingPage';
import StatementsPage from './pages/StatementsPage';

const TENANT_PAGES: Record<string, ReactNode> = {
  '/': <HomePage />,
  '/search': <SearchPage />,
  '/saved': <SavedPage />,
  '/bookings': <BookingsPage />,
  '/agreements': <AgreementsPage />,
  '/payments': <PaymentsPage />,
  '/messages': <MessagesPage />,
  '/notifications': <NotificationsPage />,
  '/caretakers': (
    <ServiceDirectory category="Caretakers" title="Caretakers" subtitle="Verified, on-site caretakers you can rely on." />
  ),
  '/house-help': (
    <ServiceDirectory category="House Help" title="House Help" subtitle="Trusted cleaners and housekeepers near you." />
  ),
  '/maintenance': <MaintenancePage />,
  '/agents': (
    <ServiceDirectory category="Agents" title="Agents" subtitle="Verified agents to help you find the right home." />
  ),
  '/profile': <ProfilePage />,
  '/settings': <SettingsPage />,
  '/help': <HelpPage />,
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tenant marketplace */}
        <Route path="/" element={<MarketplaceLayout />}>
          {TENANT_NAV_ITEMS.map((item) => {
            const element: ReactNode = TENANT_PAGES[item.path] ?? (
              <PagePlaceholder title={item.label} />
            );
            return item.path === '/' ? (
              <Route key={item.path} index element={element} />
            ) : (
              <Route key={item.path} path={item.path.slice(1)} element={element} />
            );
          })}
          <Route path="property/:id" element={<PropertyDetailPage />} />
        </Route>

        {/* Landlord marketplace (separate surface, to be designed) */}
        <Route path="/landlord" element={<LandlordHome />} />

        {/* Host management dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="reservations" element={<ReservationPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="statements" element={<StatementsPage />} />
          <Route path="listings" element={<PagePlaceholder title="Listings" />} />
          <Route path="tasks" element={<PagePlaceholder title="Tasks" />} />
          <Route path="my-trips" element={<PagePlaceholder title="My Trips" />} />
          <Route path="users" element={<PagePlaceholder title="Users" />} />
          <Route path="owner-exchange" element={<PagePlaceholder title="Owner Exchange" />} />
          <Route path="resources" element={<PagePlaceholder title="Resources" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
