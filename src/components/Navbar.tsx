import { useEffect, useState } from 'react';
import { Menu, X, Waves } from 'lucide-react';
import { Link, useRoute } from '@/lib/router';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Rooms & Suites', to: '/rooms' },
  { label: 'About Us', to: '/about' },
  { label: 'Dining', to: '/dining' },
  { label: 'Spa & Amenities', to: '/spa' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
];

export function Navbar() {
  const route = useRoute();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    handler();
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [route.path]);

  const isHome = route.path === '/';
  const isTransparent = isHome && !scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent'
            : 'bg-stone-950/95 shadow-lg shadow-stone-950/10 backdrop-blur-md'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <Waves className="text-teal-400" size={28} strokeWidth={2.5} />
            <span className="text-lg font-bold tracking-wide text-white">
              AZURE <span className="font-light text-teal-300">BAY</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = route.path === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    active ? 'text-teal-300' : 'text-stone-200 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/rooms"
              className="rounded-full bg-teal-500 px-5 py-2 text-sm font-semibold text-stone-950 transition hover:bg-teal-400"
            >
              Book Now
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-stone-950/95 pt-20 lg:hidden">
          <div className="flex flex-col items-center gap-2 px-6 py-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="w-full border-b border-stone-800 py-4 text-center text-lg font-medium text-stone-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/rooms"
              className="mt-4 w-full rounded-full bg-teal-500 px-5 py-3 text-center text-base font-semibold text-stone-950"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
