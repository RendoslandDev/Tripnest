import { useState } from 'react';
import './App.css';
import StatCards from './components/StatCards';
import UpcomingBooking from './components/upcomingbooking';
import MaintenanceTracker from './components/MaintenanaceTracker';
import SafetyCard from './components/safetyCard';
import QuickActions from './components/QuickActions';
import RecentMessages from './components/RecentMessages';
import Footer from './components/Footer';
import ViewBooking from './components/ViewBooking';
import ActiveBookings from './components/ActiveBookings';
import SavedProperties from './components/SavedProperties';
import MaintenanceDetails from './components/MaintenanceDetails';
import type { Booking } from './types';

import {
  statCards,
  upcomingBooking,
  maintenanceItems,
  quickActions,
  messages,
  trustUsers,
  paymentLogos,
  safetySettings,
} from './data/dashboarddata';

export default function App() {
  const [page, setPage] = useState<'dashboard' | 'booking' | 'activeBookings' | 'savedProperties' | 'maintenance'>('dashboard');
  const [selectedBooking, setSelectedBooking] = useState<Booking>(upcomingBooking);
  const [prevPage, setPrevPage] = useState<'dashboard' | 'activeBookings'>('dashboard');

  if (page === 'activeBookings') {
    return (
      <ActiveBookings
        onBack={() => setPage('dashboard')}
        onViewBooking={(booking) => {
          setSelectedBooking(booking);
          setPrevPage('activeBookings');
          setPage('booking');
        }}
      />
    );
  }

  if (page === 'booking') {
    return (
      <ViewBooking
        booking={selectedBooking}
        onBack={() => setPage(prevPage)}
      />
    );
  }

  if (page === 'savedProperties') {
    return <SavedProperties onBack={() => setPage('dashboard')} />;
  }

  if (page === 'maintenance') {
    return (
      <MaintenanceDetails
        items={maintenanceItems}
        onBack={() => setPage('dashboard')}
      />
    );
  }

  return (
    <>
      <h1 className="page-title">Dashboard Overview</h1>
      <StatCards
        cards={statCards}
        onActiveBookingsClick={() => setPage('activeBookings')}
        onSavedPropertiesClick={() => setPage('savedProperties')}
        onMaintenanceClick={() => setPage('maintenance')}
      />
      <div className="main-grid">
        <div className="left-col">
          <UpcomingBooking
            booking={upcomingBooking}
            onViewBooking={() => {
              setSelectedBooking(upcomingBooking);
              setPrevPage('dashboard');
              setPage('booking');
            }}
          />
          <MaintenanceTracker
            items={maintenanceItems}
            onViewAll={() => setPage('maintenance')}
          />
          <SafetyCard
            initialEnabled={safetySettings.smsAlertEnabled}
            initialContact={safetySettings.emergencyContact}
          />
        </div>
        <div className="right-col">
          <QuickActions actions={quickActions} />
          <RecentMessages messages={messages} />
        </div>
      </div>
      <Footer trustUsers={trustUsers} paymentLogos={paymentLogos} />
    </>
  );
}