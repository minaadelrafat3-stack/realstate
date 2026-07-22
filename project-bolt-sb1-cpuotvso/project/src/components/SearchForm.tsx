import { useState } from 'react';
import { Calendar, Users, Search } from 'lucide-react';
import { navigate } from '@/lib/router';
import { todayISO, tomorrowISO } from '@/lib/utils';

interface SearchFormProps {
  variant?: 'hero' | 'inline';
}

export function SearchForm({ variant = 'hero' }: SearchFormProps) {
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(tomorrowISO());
  const [guests, setGuests] = useState(2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) });
    navigate(`/rooms?${params.toString()}`);
  };

  const isHero = variant === 'hero';

  return (
    <form
      onSubmit={handleSearch}
      className={`grid grid-cols-1 gap-3 rounded-2xl p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end ${
        isHero
          ? 'bg-white/95 shadow-2xl backdrop-blur-md'
          : 'bg-stone-100 shadow-lg'
      } lg:gap-4`}
    >
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
          <Calendar size={13} /> Check-In
        </label>
        <input
          type="date"
          value={checkIn}
          min={todayISO()}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          required
        />
      </div>
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
          <Calendar size={13} /> Check-Out
        </label>
        <input
          type="date"
          value={checkOut}
          min={checkIn || todayISO()}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          required
        />
      </div>
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
          <Users size={13} /> Guests
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        >
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'Guest' : 'Guests'}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-teal-400"
      >
        <Search size={18} />
        Check Availability
      </button>
    </form>
  );
}
