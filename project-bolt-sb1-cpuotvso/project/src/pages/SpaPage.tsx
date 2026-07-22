import { useEffect, useState } from 'react';
import { Sparkles, Waves, Dumbbell, Flower, Hand, Leaf, type LucideIcon } from 'lucide-react';
import { getAmenities } from '@/lib/api';
import { getAmenityIcon } from '@/lib/amenity-icons';
import type { Amenity } from '@/lib/types';

const SPA_SERVICES = [
  { name: 'Deep Tissue Massage', duration: '60 min', price: '$140', desc: 'Targeted pressure to relieve muscle tension and restore mobility.' },
  { name: 'Aromatherapy Ritual', duration: '75 min', price: '$165', desc: 'Essential oils combined with gentle massage for total relaxation.' },
  { name: 'Hot Stone Therapy', duration: '90 min', price: '$190', desc: 'Heated volcanic stones melt away deep-seated tension.' },
  { name: 'Facial Rejuvenation', duration: '50 min', price: '$120', desc: 'Customized organic facial to cleanse, hydrate, and revitalize.' },
  { name: 'Couples Retreat', duration: '120 min', price: '$380', desc: 'A shared spa experience with private suite and champagne.' },
  { name: 'Yoga & Meditation', duration: '60 min', price: '$45', desc: 'Guided sessions in our oceanfront pavilion, all levels welcome.' },
];

const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Waves, title: 'Heated Indoor Pool', desc: 'Year-round comfort with lap lanes and jacuzzi' },
  { icon: Dumbbell, title: '24/7 Fitness Center', desc: 'State-of-the-art equipment and personal training' },
  { icon: Flower, title: 'Zen Garden', desc: 'Tranquil outdoor space for meditation and relaxation' },
  { icon: Hand, title: 'Treatment Rooms', desc: '8 private suites with ocean views' },
  { icon: Leaf, title: 'Organic Products', desc: 'Premium natural and sustainable spa products' },
  { icon: Sparkles, title: 'Sauna & Steam', desc: 'Traditional Finnish sauna and eucalyptus steam room' },
];

export function SpaPage() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);

  useEffect(() => {
    getAmenities().then(setAmenities);
  }, []);

  return (
    <div>
      <section className="relative flex h-72 items-center justify-center overflow-hidden bg-stone-950">
        <img src="https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Spa" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Spa & Amenities</h1>
          <p className="mt-3 text-stone-300">Rejuvenate your body and soul</p>
        </div>
      </section>

      {/* Spa Services */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Our Spa</p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900">Signature Treatments</h2>
            <p className="mx-auto mt-3 max-w-2xl text-stone-600">
              Indulge in a curated selection of treatments designed by our expert therapists to
              restore balance and vitality.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SPA_SERVICES.map((s) => (
              <div key={s.name} className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-stone-900">{s.name}</h3>
                  <span className="text-lg font-bold text-teal-600">{s.price}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-stone-400">{s.duration}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">{s.desc}</p>
                <button className="mt-4 w-full rounded-xl border border-teal-500 py-2.5 text-sm font-semibold text-teal-600 transition hover:bg-teal-500 hover:text-white">
                  Book Treatment
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Facilities</p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900">Wellness & Leisure</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-lg">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <f.icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">{f.title}</h3>
                  <p className="mt-1 text-sm text-stone-600">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Amenities */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Hotel Amenities</p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900">Everything Included</h2>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {amenities.map((a) => {
              const Icon = getAmenityIcon(a.icon);
              return (
                <div key={a.id} className="flex flex-col items-center rounded-2xl border border-stone-100 bg-stone-50 p-6 text-center transition hover:border-teal-200 hover:bg-teal-50">
                  <div className="mb-3 rounded-full bg-teal-100 p-3 text-teal-600">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900">{a.name}</h3>
                  {a.description && <p className="mt-1 text-xs text-stone-500">{a.description}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
