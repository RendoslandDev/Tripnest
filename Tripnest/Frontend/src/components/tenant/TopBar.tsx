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
            <IconButton label="Messages" onClick={() => navigate(session.role === 'landlord' ? '/landlord/messages' : '/messages')}><MailIcon size={18} /></IconButton>
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


// const SECTIONS = [
//   { id: 'features', label: 'Features' },
//   { id: 'how-it-works', label: 'How it works' },
//   { id: 'join', label: 'Join' },
// ] as const;

// /**
//  * Dynamic-island style pill that floats over the page: it condenses and gains
//  * depth once you scroll, and a highlight slides between section links as the
//  * page moves underneath it.
//  */
// function NotchNav() {
//   const [scrolled, setScrolled] = useState(false);
//   const [active, setActive] = useState<string>('');
//   const linkRefs = useRef(new Map<string, HTMLButtonElement>());
//   const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 40);
//     onScroll();
//     window.addEventListener('scroll', onScroll, { passive: true });
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   // Track which section is under the viewport middle.
//   useEffect(() => {
//     const io = new IntersectionObserver(
//       (entries) => {
//         for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
//       },
//       { rootMargin: '-40% 0px -50% 0px' },
//     );
//     SECTIONS.forEach((s) => {
//       const el = document.getElementById(s.id);
//       if (el) io.observe(el);
//     });
//     return () => io.disconnect();
//   }, []);

//   // Slide the highlight pill to the active link.
//   useEffect(() => {
//     const el = active ? linkRefs.current.get(active) : undefined;
//     setPill(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
//   }, [active, scrolled]);

//   const jump = (id: string) =>
//     document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

//   return (
//     <div className="pointer-events-none sticky top-3 z-40 flex justify-center">
//       <nav
//         aria-label="Explore sections"
//         className={`pointer-events-auto flex items-center rounded-full border bg-white/85 backdrop-blur-xl transition-all duration-500 [transition-timing-function:cubic-bezier(.22,.8,.3,1)] ${
//           scrolled
//             ? 'gap-0.5 border-gray-200 px-2 py-1.5 shadow-[0_16px_40px_-16px_rgba(8,6,13,.35)]'
//             : 'gap-1.5 border-white/60 px-3 py-2 shadow-[0_8px_24px_-16px_rgba(8,6,13,.2)]'
//         }`}
//       >
//         <button
//           type="button"
//           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//           className={`flex items-center justify-center rounded-full bg-brand text-white transition-all duration-500 ${
//             scrolled ? 'h-7 w-7' : 'h-8 w-8'
//           }`}
//           aria-label="Back to top"
//         >
//           <HexIcon size={scrolled ? 14 : 16} />
//         </button>

//         <div className="relative flex items-center">
//           {pill && (
//             <span
//               aria-hidden
//               className="absolute top-1/2 h-8 -translate-y-1/2 rounded-full bg-brand-50 transition-all duration-400 [transition-timing-function:cubic-bezier(.22,.8,.3,1)]"
//               style={{ left: pill.left, width: pill.width }}
//             />
//           )}
//           {SECTIONS.map((s) => (
//             <button
//               key={s.id}
//               type="button"
//               ref={(el) => {
//                 if (el) linkRefs.current.set(s.id, el);
//               }}
//               onClick={() => jump(s.id)}
//               className={`relative rounded-full text-sm font-semibold transition-all duration-500 ${
//                 scrolled ? 'px-3 py-1.5' : 'px-3.5 py-2'
//               } ${active === s.id ? 'text-brand' : 'text-muted hover:text-ink'}`}
//             >
//               {s.label}
//             </button>
//           ))}
//         </div>

//         <Link
//           to="/welcome"
//           className={`rounded-full bg-ink font-semibold text-white no-underline transition-all duration-500 hover:bg-ink/90 ${
//             scrolled ? 'px-3.5 py-1.5 text-xs' : 'px-4 py-2 text-sm'
//           }`}
//         >
//           Sign in
//         </Link>
//       </nav>
//     </div>
//   );
// }
