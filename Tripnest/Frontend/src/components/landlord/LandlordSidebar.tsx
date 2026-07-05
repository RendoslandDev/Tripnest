import { NavLink } from 'react-router-dom';
import { LANDLORD_NAV } from './navConfig';
import { HexIcon } from '../tenant/icons';
import { useSession } from '../../store/authStore';
import Avatar from '../ui/Avatar';

interface LandlordSidebarProps {
  open: boolean;
  onClose: () => void;
  /** Collapse the sidebar on large screens to give the content full width. */
  desktopHidden?: boolean;
}

const baseItem =
  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm no-underline transition-all';
const inactiveItem = 'font-medium text-gray-500 hover:bg-black/5 hover:text-ink';
const activeItem = 'bg-white font-semibold text-ink shadow-[0_1px_4px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04]';

export default function LandlordSidebar({ open, onClose, desktopHidden = false }: LandlordSidebarProps) {
  const session = useSession();
  const name = session?.name ?? 'Guest';
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] min-w-[260px] flex-col overflow-y-auto bg-[#f7f7f5] px-4 py-6 transition-transform lg:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${desktopHidden ? 'lg:hidden' : 'lg:sticky lg:top-0 lg:translate-x-0'}`}
      >
        <div className="mb-8 flex items-center gap-2 px-2">
          <HexIcon size={24} className="text-ink" />
          <p className="text-xl font-bold tracking-tight text-ink">TripNest</p>
        </div>

        <nav className="flex flex-col">
          {LANDLORD_NAV.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-4 border-t border-gray-200 pt-4' : ''}>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `${baseItem} ${isActive ? activeItem : inactiveItem}`
                    }
                  >
                    <span className="flex shrink-0 items-center justify-center">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge != null && (
                      <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <NavLink
          to="/landlord/settings"
          onClick={onClose}
          className="mt-auto flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left no-underline transition-colors hover:bg-black/5"
        >
          <Avatar name={name} size={36} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ink">{name}</span>
            <span className="block text-xs text-muted">Landlord</span>
          </span>
        </NavLink>
      </aside>
    </>
  );
}
