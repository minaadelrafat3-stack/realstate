import { Waves, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from '@/lib/router';

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Waves className="text-teal-400" size={26} strokeWidth={2.5} />
              <span className="text-lg font-bold tracking-wide text-white">
                AZURE <span className="font-light text-teal-300">BAY</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-stone-400">
              A luxury beachfront hotel offering refined accommodations, world-class dining, and
              unparalleled hospitality on the shores of paradise.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" className="rounded-full bg-stone-800 p-2.5 transition hover:bg-teal-500 hover:text-stone-950">
                <Instagram size={18} />
              </a>
              <a href="#" className="rounded-full bg-stone-800 p-2.5 transition hover:bg-teal-500 hover:text-stone-950">
                <Facebook size={18} />
              </a>
              <a href="#" className="rounded-full bg-stone-800 p-2.5 transition hover:bg-teal-500 hover:text-stone-950">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/rooms" className="transition hover:text-teal-300">Rooms & Suites</Link></li>
              <li><Link to="/about" className="transition hover:text-teal-300">About Us</Link></li>
              <li><Link to="/dining" className="transition hover:text-teal-300">Restaurant & Dining</Link></li>
              <li><Link to="/spa" className="transition hover:text-teal-300">Spa & Amenities</Link></li>
              <li><Link to="/gallery" className="transition hover:text-teal-300">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Information</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/contact" className="transition hover:text-teal-300">Contact</Link></li>
              <li><Link to="/faq" className="transition hover:text-teal-300">FAQ</Link></li>
              <li><Link to="/privacy" className="transition hover:text-teal-300">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-teal-400" />
                <span>128 Coastal Drive, Paradise Bay, CA 90210</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-teal-400" />
                <a href="tel:+18005550100" className="transition hover:text-teal-300">+1 (800) 555-0100</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-teal-400" />
                <a href="mailto:stay@azurebay.com" className="transition hover:text-teal-300">stay@azurebay.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-800 pt-6 text-center text-sm text-stone-500">
          <p>&copy; {new Date().getFullYear()} Azure Bay Hotel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
