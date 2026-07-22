import { Award, Heart, Leaf, Users } from 'lucide-react';
import { Link } from '@/lib/router';

const VALUES = [
  { icon: Heart, title: 'Genuine Hospitality', text: 'Every guest is treated as family. Our team anticipates your needs before you even voice them.' },
  { icon: Leaf, title: 'Sustainable Luxury', text: 'We are committed to eco-friendly practices without compromising on comfort or elegance.' },
  { icon: Award, title: 'Excellence', text: 'From housekeeping to fine dining, we hold ourselves to the highest standards in every detail.' },
  { icon: Users, title: 'Community', text: 'We support local artisans, farmers, and businesses, enriching the community we call home.' },
];

const STATS = [
  { value: '25+', label: 'Years of Excellence' },
  { value: '120', label: 'Luxury Rooms & Suites' },
  { value: '50K+', label: 'Happy Guests' },
  { value: '4.9', label: 'Average Rating' },
];

export function AboutPage() {
  return (
    <div>
      <section className="relative flex h-72 items-center justify-center overflow-hidden bg-stone-950">
        <img src="https://images.pexels.com/photos/5379226/pexels-photo-5379226.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="About" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">About Azure Bay</h1>
          <p className="mt-3 text-stone-300">A legacy of luxury hospitality</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Our Story</p>
              <h2 className="mt-2 text-3xl font-bold text-stone-900">A Paradise Found</h2>
              <p className="mt-4 leading-relaxed text-stone-600">
                Founded in 1998, Azure Bay began as a boutique beachfront inn with just 20 rooms.
                Over the decades, it has grown into one of the most celebrated luxury hotels on the
                coast, while preserving the intimate charm and personal touch that first defined it.
              </p>
              <p className="mt-4 leading-relaxed text-stone-600">
                Nestled between the azure waters of the Pacific and lush tropical gardens, our hotel
                offers a sanctuary where guests can disconnect from the world and reconnect with what
                matters. Every corner tells a story, every meal is a celebration, and every stay is
                an experience to cherish.
              </p>
              <Link to="/rooms" className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-teal-400">
                Explore Our Rooms
              </Link>
            </div>
            <div className="overflow-hidden rounded-2xl">
              <img src="https://images.pexels.com/photos/3149682/pexels-photo-3149682.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Hotel exterior" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-stone-950 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-bold text-teal-400">{s.value}</p>
                <p className="mt-1 text-sm text-stone-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Our Values</p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900">What We Stand For</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:shadow-lg">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <v.icon size={26} />
                </div>
                <h3 className="text-lg font-semibold text-stone-900">{v.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Leadership</p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900">Meet Our Team</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Isabella Moreau', role: 'General Manager', img: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=600' },
              { name: 'James Okonkwo', role: 'Executive Chef', img: 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=600' },
              { name: 'Yuki Tanaka', role: 'Spa Director', img: 'https://images.pexels.com/photos/3760854/pexels-photo-3760854.jpeg?auto=compress&cs=tinysrgb&w=600' },
            ].map((person) => (
              <div key={person.name} className="overflow-hidden rounded-2xl bg-stone-50 shadow-sm transition hover:shadow-lg">
                <img src={person.img} alt={person.name} className="h-72 w-full object-cover" loading="lazy" />
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-stone-900">{person.name}</h3>
                  <p className="text-sm text-teal-600">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
