import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TenantSidebar from '../components/tenant/TenantSidebar';
import TopBar from '../components/tenant/TopBar';
import Footer from '../components/tenant/Footer';
import ChatButton from '../components/tenant/ChatButton';

/** Shell for the tenant marketplace: sidebar + top bar + content + footer. */
export default function MarketplaceLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopHidden, setDesktopHidden] = useState(false);

  // The hamburger collapses the sidebar on large screens (more room for
  // content) and opens the drawer on small ones.
  const toggleSidebar = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setDesktopHidden((v) => !v);
    } else {
      setMobileOpen(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TenantSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} desktopHidden={desktopHidden} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenu={toggleSidebar} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ChatButton />
    </div>
  );
}
