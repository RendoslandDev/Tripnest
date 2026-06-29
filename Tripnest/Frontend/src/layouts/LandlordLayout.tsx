import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LandlordSidebar from '../components/landlord/LandlordSidebar';
import TopBar from '../components/tenant/TopBar';
import Footer from '../components/tenant/Footer';
import ChatButton from '../components/tenant/ChatButton';

/** Shell for the landlord marketplace: sidebar + top bar + content + footer. */
export default function LandlordLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LandlordSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenu={() => setOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ChatButton />
    </div>
  );
}
