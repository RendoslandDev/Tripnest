import { NavLink } from 'react-router-dom';
import { TENANT_NAV } from './navConfig';
import { HexIcon, ChevronDownIcon } from './icons';
import { useSession } from '../../store/authStore';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

interface TenantSidebarProps {
  open: boolean;
  onClose: () => void;
  /** Collapse the sidebar on large screens to give the content full width. */
  desktopHidden?: boolean;
}

const baseItem =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors';
const inactiveItem = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
const activeItem = 'bg-brand-50 text-brand';

export default function TenantSidebar({ open, onClose, desktopHidden = false }: TenantSidebarProps) {
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
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] min-w-[260px] flex-col overflow-y-auto border-r border-gray-200 bg-white px-4 py-6 transition-transform lg:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${desktopHidden ? 'lg:hidden' : 'lg:sticky lg:top-0 lg:translate-x-0'}`}
      >
        <div className="mb-6 flex items-center gap-2.5 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
            <HexIcon size={20} />
          </span>
          <div className="leading-tight">
            <p className="text-lg font-bold text-ink">TripNest</p>
            <p className="text-[11px] text-muted">Find | Stay | Thrive</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {TENANT_NAV.map((group, gi) => (
            <div key={gi}>
              {group.heading && (
                <p className="px-3 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  {group.heading}
                </p>
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `${baseItem} ${isActive ? activeItem : inactiveItem}`
                  }
                >
                  <span className="flex shrink-0 items-center justify-center">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge != null && (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {!session && (
          <div className="mt-6 rounded-xl bg-brand p-4 text-white">
            <p className="font-semibold">Become a Host</p>
            <p className="mt-1 text-xs text-white/80">
              Create a landlord account and start earning today!
            </p>
            <NavLink to="/welcome" onClick={onClose} className="no-underline">
              <Button className="mt-3 bg-white text-brand hover:bg-white/90" size="sm">
                Get Started
              </Button>
            </NavLink>
          </div>
        )}

        <NavLink
          to={session ? '/profile' : '/welcome'}
          onClick={onClose}
          className="mt-4 flex w-full items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-left no-underline"
        >
          <Avatar name={name} size={36} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ink">{session ? name : 'Sign in'}</span>
            <span className="block text-xs text-muted">{session ? 'Tenant' : 'Browse as guest'}</span>
          </span>
          <ChevronDownIcon size={16} className="text-muted" />
        </NavLink>
      </aside>
    </>
  );
}
