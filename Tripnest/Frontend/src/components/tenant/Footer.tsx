import { HexIcon, FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon } from './icons';

const LINKS = ['About Us', 'How it works', 'Terms & Conditions', 'Privacy Policy', 'Contact Us'];
const PROVIDERS = ['MTN', 'Vodafone Cash', 'AirtelTigo'];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted">We accept</span>
          <div className="flex items-center gap-2">
            {PROVIDERS.map((p) => (
              <span
                key={p}
                className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-semibold text-ink"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted">Trusted by thousands in Tarkwa</p>
      </div>

      <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white">
            <HexIcon size={16} />
          </span>
          <span className="text-sm text-muted">© 2025 TripNest. All rights reserved.</span>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {LINKS.map((link) => (
            <a key={link} href="#" className="text-sm text-muted no-underline hover:text-ink">
              {link}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-muted">
          <span className="text-sm">Follow us</span>
          <a href="#" aria-label="TripNest on Facebook" className="hover:text-ink"><FacebookIcon size={18} /></a>
          <a href="#" aria-label="TripNest on Instagram" className="hover:text-ink"><InstagramIcon size={18} /></a>
          <a href="#" aria-label="TripNest on Twitter" className="hover:text-ink"><TwitterIcon size={18} /></a>
          <a href="#" aria-label="TripNest on LinkedIn" className="hover:text-ink"><LinkedinIcon size={18} /></a>
        </div>
      </div>
    </footer>
  );
}
