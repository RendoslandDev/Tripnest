import { useLocation, useNavigate } from 'react-router-dom';
import {
  MenuIcon, SearchIcon, MapPinIcon, BellIcon, MailIcon, ChevronDownIcon,
} from './icons';
import { currentUser } from '../../data/user';
import Avatar from '../ui/Avatar';

interface TopBarProps {
  onMenu: () => void;
}

function IconButton({ children, count, label }: { children: React.ReactNode; count?: number; label: string }) {
  return (
    <button aria-label={label} className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">
      {children}
      {count != null && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

export default function TopBar({ onMenu }: TopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLandlord = location.pathname.startsWith('/landlord');

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
      <button
        onClick={onMenu}
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-gray-100 lg:hidden"
      >
        <MenuIcon size={22} />
      </button>

      <div className="relative hidden max-w-xl flex-1 sm:block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          <SearchIcon size={18} />
        </span>
        <input
          type="search"
          placeholder="Search location, property ID or keyword..."
          className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-ink outline-none focus:border-brand"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
        <span className="hidden items-center gap-1.5 text-sm text-muted md:flex">
          <MapPinIcon size={16} className="text-brand" />
          {currentUser.location}
        </span>

        <IconButton label="Notifications" count={6}><BellIcon size={20} /></IconButton>
        <IconButton label="Messages" count={3}><MailIcon size={20} /></IconButton>

        <div className="flex rounded-lg border border-gray-200 p-0.5 text-sm font-medium">
          <button
            onClick={() => navigate('/')}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              isLandlord ? 'text-gray-600' : 'bg-brand-50 text-brand'
            }`}
          >
            Tenant
          </button>
          <button
            onClick={() => navigate('/landlord')}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              isLandlord ? 'bg-brand-50 text-brand' : 'text-gray-600'
            }`}
          >
            Landlord
          </button>
        </div>

        <button className="flex items-center gap-1.5">
          <Avatar name={currentUser.name} size={36} />
          <ChevronDownIcon size={16} className="hidden text-muted sm:block" />
        </button>
      </div>
    </header>
  );
}
