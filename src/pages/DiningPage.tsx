import { Clock, Utensils, Wine, Coffee, IceCream } from 'lucide-react';

const RESTAURANTS = [
  {
    name: 'Ocean Blu',
    type: 'Fine Dining',
    hours: '6:00 PM - 10:30 PM',
    description: 'Our signature restaurant offers a seasonal menu inspired by coastal Mediterranean cuisine, crafted with locally sourced seafood and organic produce.',
    image: 'https://images.pexels.com/photos/262042/pexels-photo-262042.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    name: 'The Terrace',
    type: 'All-Day Dining',
    hours: '6:30 AM - 11:00 PM',
    description: 'Casual al fresco dining by the pool. Enjoy international favorites, fresh salads, wood-fired pizzas, and tropical cocktails from sunrise to late night.',
    image: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    name: 'Sakura Bar',
    type: 'Sushi & Sake',
    hours: '5:00 PM - 12:00 AM',
    description: 'An intimate Japanese lounge serving premium sushi, sashimi, and an extensive selection of sake and Japanese whiskies in a serene setting.',
    image: 'https://images.pexels.com/photos/2092908/pexels-photo-2092908.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

const MENU_HIGHLIGHTS = [
  { icon: Wine, name: 'Wine Pairing', desc: 'Curated selections from our sommelier' },
  { icon: Coffee, name: 'Breakfast Buffet', desc: 'Daily 6:30 AM - 10:30 AM' },
  { icon: IceCream, name: 'Dessert Menu', desc: 'House-made pastries and gelato' },
  { icon: Utensils, name: 'Private Dining', desc: 'Intimate events for up to 40 guests' },
];

export function DiningPage() {
  return (
    <div>
      <section className="relative flex h-72 items-center justify-center overflow-hidden bg-stone-950">
        <img src="https://images.pexels.com/photos/262042/pexels-photo-262042.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Dining" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Restaurant & Dining</h1>
          <p className="mt-3 text-stone-300">A culinary journey by the sea</p>
        </div>
      </section>

      {/* Restaurants */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl space-y-12 px-4 lg:px-8">
          {RESTAURANTS.map((r, i) => (
            <div key={r.name} className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[direction:rtl]' : ''}`}>
              <div className="overflow-hidden rounded-2xl [direction:ltr]">
                <img src={r.image} alt={r.name} className="h-72 w-full object-cover lg:h-80" loading="lazy" />
              </div>
              <div className="[direction:ltr]">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">{r.type}</span>
                <h2 className="mt-1 text-3xl font-bold text-stone-900">{r.name}</h2>
                <div className="mt-2 flex items-center gap-2 text-sm text-stone-500">
                  <Clock size={16} /> {r.hours}
                </div>
                <p className="mt-4 leading-relaxed text-stone-600">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-stone-950 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white">Dining Highlights</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MENU_HIGHLIGHTS.map((h) => (
              <div key={h.name} className="rounded-2xl bg-stone-900 p-6 text-center transition hover:bg-stone-800">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/20 text-teal-400">
                  <h.icon size={22} />
                </div>
                <h3 className="font-semibold text-white">{h.name}</h3>
                <p className="mt-1 text-sm text-stone-400">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
