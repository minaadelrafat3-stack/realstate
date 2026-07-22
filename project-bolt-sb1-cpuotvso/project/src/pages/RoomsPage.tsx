import { useEffect, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { RoomCard } from '@/components/RoomCard';
import { SearchForm } from '@/components/SearchForm';
import { getRooms } from '@/lib/api';
import { useRoute } from '@/lib/router';
import type { Room } from '@/lib/types';

export function RoomsPage() {
  const route = useRoute();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxGuests, setMaxGuests] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('default');

  useEffect(() => {
    const guests = route.query.get('guests');
    if (guests) setMaxGuests(Number(guests));
  }, [route.query]);

  useEffect(() => {
    getRooms()
      .then(setRooms)
      .finally(() => setLoading(false));
  }, []);

  let filtered = maxGuests > 0 ? rooms.filter((r) => r.max_guests >= maxGuests) : rooms;
  if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => a.price_per_night - b.price_per_night);
  if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => b.price_per_night - a.price_per_night);
  if (sortBy === 'guests') filtered = [...filtered].sort((a, b) => b.max_guests - a.max_guests);

  return (
    <div>
      {/* Header */}
      <section className="relative flex h-72 items-center justify-center overflow-hidden bg-stone-950">
        <img
          src="https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Rooms"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Rooms & Suites</h1>
          <p className="mt-3 text-stone-300">Find your perfect accommodation</p>
        </div>
      </section>

      {/* Search bar */}
      <section className="bg-stone-50 py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SearchForm variant="inline" />
        </div>
      </section>

      {/* Room grid */}
      <section className="bg-stone-50 pb-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-stone-600">
              {loading ? 'Loading...' : `${filtered.length} ${filtered.length === 1 ? 'room' : 'rooms'} available`}
            </p>
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={16} className="text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-teal-500"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="guests">Max Guests</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl bg-stone-200" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center text-stone-500">
              No rooms match your criteria. Try adjusting your search.
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
