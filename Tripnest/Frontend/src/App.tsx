import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MarketplaceLayout from './layouts/MarketplaceLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LandlordLayout from './layouts/LandlordLayout';
import RequireAuth from './components/RequireAuth';
import { useSession } from './store/authStore';
import WelcomePage from './pages/WelcomePage';
import LandlordHome from './pages/landlord/LandlordHome';
import EarningsPage from './pages/landlord/EarningsPage';
import LandlordListingsPage from './pages/landlord/ListingsPage';
import InquiriesPage from './pages/landlord/InquiriesPage';
import LandlordBookingsPage from './pages/landlord/BookingsPage';
import TenantsPage from './pages/landlord/TenantsPage';
import ReviewsPage from './pages/landlord/ReviewsPage';
import LandlordSettingsPage from './pages/landlord/SettingsPage';
import LandlordHelpPage from './pages/landlord/HelpPage';
import PagePlaceholder from './components/PagePlaceholder';
import type { ReactNode } from 'react';
import { TENANT_NAV_ITEMS } from './components/tenant/navConfig';
import { lazy, Suspense } from 'react';
import HomePage from './pages/tenant/HomePage';
import SearchPage from './pages/tenant/SearchPage';
import ExplorePage from './pages/tenant/ExplorePage';

// Map page pulls in Leaflet — load it on demand to keep the main bundle lean.
const NearbyPage = lazy(() => import('./pages/tenant/NearbyPage'));
import SavedPage from './pages/tenant/SavedPage';
import PropertyDetailPage from './pages/tenant/PropertyDetailPage';
import CheckoutPage from './pages/tenant/CheckoutPage';
import PaymentCallbackPage from './pages/tenant/PaymentCallbackPage';
import BookingsPage from './pages/tenant/BookingsPage';
import AgreementsPage from './pages/tenant/AgreementsPage';
import PaymentsPage from './pages/tenant/PaymentsPage';
import MessagesPage from './pages/tenant/MessagesPage';
import NotificationsPage from './pages/tenant/NotificationsPage';
import ServiceDirectory from './pages/tenant/ServiceDirectory';
import ProviderDetailPage from './pages/tenant/ProviderDetailPage';
import MaintenancePage from './pages/tenant/MaintenancePage';
import TenantDashboardPage from './pages/tenant/DashboardPage';
import ProfilePage from './pages/tenant/ProfilePage';
import SettingsPage from './pages/tenant/SettingsPage';
import HelpPage from './pages/tenant/HelpPage';
import OverviewPage from './pages/OverviewPage';
import ReservationPage from './pages/ReservationPage';
import CalendarPage from './pages/CalendarPage';
import PricingPage from './pages/PricingPage';
import StatementsPage from './pages/StatementsPage';
import ListingsPage from './pages/ListingsPage';
import TasksPage from './pages/TasksPage';
import MyTripsPage from './pages/MyTripsPage';
import UsersPage from './pages/UsersPage';
import OwnerExchangePage from './pages/OwnerExchangePage';
import ResourcesPage from './pages/ResourcesPage';

/** Visitors are onboarded through Explore first; signed-in users get their home. */
function Landing() {
  const session = useSession();
  return session ? <HomePage /> : <Navigate to="/explore" replace />;
}

const TENANT_PAGES: Record<string, ReactNode> = {
  '/': <Landing />,
  '/overview': <TenantDashboardPage />,
  '/search': <SearchPage />,
  '/nearby': (
    <Suspense fallback={<p className="text-muted">Loading map…</p>}>
      <NearbyPage />
    </Suspense>
  ),
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

// Marketplace pages that need a signed-in user. Everything else (home,
// search, nearby, property pages, service directories) is open to guests.
const AUTH_ONLY_TENANT_PATHS = new Set([
  '/overview', '/saved', '/bookings', '/agreements', '/payments', '/messages',
  '/notifications', '/maintenance', '/profile', '/settings',
]);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Onboarding: Explore introduces TripNest, then hands off to auth */}
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/welcome" element={<WelcomePage />} />

        {/* Tenant marketplace — browsing is public; personal pages need a login */}
        <Route path="/" element={<MarketplaceLayout />}>
          {TENANT_NAV_ITEMS.map((item) => {
            let element: ReactNode = TENANT_PAGES[item.path] ?? (
              <PagePlaceholder title={item.label} />
            );
            if (AUTH_ONLY_TENANT_PATHS.has(item.path)) {
              element = <RequireAuth>{element}</RequireAuth>;
            }
            return item.path === '/' ? (
              <Route key={item.path} index element={element} />
            ) : (
              <Route key={item.path} path={item.path.slice(1)} element={element} />
            );
          })}
          <Route path="property/:id" element={<PropertyDetailPage />} />
          <Route path="providers/:id" element={<ProviderDetailPage />} />
          <Route path="checkout/:id" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
          <Route path="payment/callback" element={<RequireAuth><PaymentCallbackPage /></RequireAuth>} />
        </Route>

        {/* Landlord marketplace — only landlord accounts */}
        <Route path="/landlord" element={<RequireAuth role="landlord"><LandlordLayout /></RequireAuth>}>
          <Route index element={<LandlordHome />} />
          <Route path="reservations" element={<ReservationPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="statements" element={<StatementsPage />} />
          <Route path="listings" element={<LandlordListingsPage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
          <Route path="bookings" element={<LandlordBookingsPage />} />
          <Route path="earnings" element={<EarningsPage />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="settings" element={<LandlordSettingsPage />} />
          <Route path="help" element={<LandlordHelpPage />} />
        </Route>

        {/* Host management dashboard — landlord-only */}
        <Route path="/dashboard" element={<RequireAuth role="landlord"><DashboardLayout /></RequireAuth>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="reservations" element={<ReservationPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="statements" element={<StatementsPage />} />
          <Route path="listings" element={<ListingsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="my-trips" element={<MyTripsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="owner-exchange" element={<OwnerExchangePage />} />
          <Route path="resources" element={<ResourcesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
