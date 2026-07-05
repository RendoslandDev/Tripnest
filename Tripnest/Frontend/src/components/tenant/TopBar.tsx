import { useNavigate } from 'react-router-dom';
import {
  MenuIcon, SearchIcon, BellIcon, MailIcon,
} from './icons';
import { useSession } from '../../store/authStore';
import Avatar from '../ui/Avatar';

interface TopBarProps {
  onMenu: () => void;
}

/** Circular hairline icon button, Wander-style. */
function IconButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-ink transition-colors hover:bg-gray-50"
    >
      {children}
    </button>
  );
}

export default function TopBar({ onMenu }: TopBarProps) {
  const navigate = useNavigate();
  const session = useSession();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3 sm:px-6">
      <button
        onClick={onMenu}
        aria-label="Toggle sidebar"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-gray-100"
      >
        <MenuIcon size={22} />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          <SearchIcon size={17} />
        </span>
        <input
          type="search"
          placeholder="Search location, property or keyword…"
          onKeyDown={(e) => e.key === 'Enter' && navigate('/search')}
          className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-gray-400 focus:border-ink"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
        {session ? (
          <>
            <IconButton label="Notifications" onClick={() => navigate('/notifications')}><BellIcon size={18} /></IconButton>
            <IconButton label="Messages" onClick={() => navigate('/messages')}><MailIcon size={18} /></IconButton>
            <button onClick={() => navigate('/profile')} aria-label="Account" className="ml-0.5">
              <Avatar name={session.name} size={40} />
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/welcome')}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
