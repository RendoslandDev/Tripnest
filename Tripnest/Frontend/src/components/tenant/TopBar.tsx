import { useNavigate } from 'react-router-dom';
import {
  MenuIcon, BellIcon, MailIcon,
} from './icons';
import { useSession } from '../../store/authStore';
import Avatar from '../ui/Avatar';

interface TopBarProps {
  onMenu: () => void;
}

/** Circular hairline icon button, Wander-style. */
function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="
        flex h-10 w-10 items-center justify-center
        rounded-full
        border border-gray-100
        bg-white/80
        text-ink
        backdrop-blur-sm
        transition-all duration-300
        hover:bg-brand-50
        hover:text-brand
      "
    >
      {children}
    </button>
  );
}

export default function TopBar({ onMenu }: TopBarProps) {
  const navigate = useNavigate();
  const session = useSession();

  return (
    <div className="sticky top-3 z-30  sm:px-6">
    <header className="mx-auto flex max-w-lg items-center gap-3 rounded-full border border-gray-400 bg-white/85 px-4 py-3 backdrop-blur-xl shadow-[0_16px_40px_-16px_rgba(8,6,13,.35)]">

      <button
  onClick={onMenu}
  aria-label="Toggle sidebar"
  className="
    flex h-10 w-10 shrink-0 items-center justify-center
    rounded-full
    bg-brand text-white
    transition-all duration-300
    hover:scale-105
    hover:bg-brand/90
  "
>
  <MenuIcon size={22} />
</button>

      <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
        {session ? (
          <>
            <IconButton label="Notifications" onClick={() => navigate('/notifications')}><BellIcon size={18} /></IconButton>
            <IconButton label="Messages" onClick={() => navigate(session.role === 'landlord' ? '/landlord/messages' : '/messages')}><MailIcon size={18} />
            </IconButton>
           <button
            onClick={() => navigate('/profile')}
            aria-label="Account"
            className="
                overflow-hidden rounded-full
                ring-2 ring-transparent
                transition-all duration-300
                hover:ring-brand-100
            "
          >
                <Avatar name={session.name} size={40} />
        </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/welcome')}
            className="
                rounded-full
                bg-ink
                px-5 py-2.5
                text-sm font-semibold
                text-white
                transition-all duration-300
                hover:bg-ink/90
                hover:scale-[1.02]
            "
        >
        Sign in
        </button>
        )}
      </div>
    </header>
    </div>
  );
}
