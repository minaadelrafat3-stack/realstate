import { Users, BedDouble, Maximize } from 'lucide-react';
import type { Room } from '@/lib/types';
import { Link } from '@/lib/router';
import { formatPrice } from '@/lib/utils';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:shadow-2xl">
      <Link to={`/rooms/${room.slug}`} className="relative block overflow-hidden">
        <img
          src={room.main_image}
          alt={room.name}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute right-4 top-4 rounded-full bg-stone-950/80 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
          {formatPrice(room.price_per_night)}
          <span className="text-xs font-normal text-stone-300"> /night</span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/rooms/${room.slug}`}>
          <h3 className="text-xl font-bold text-stone-900 transition hover:text-teal-600">
            {room.name}
          </h3>
        </Link>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">{room.short_description}</p>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <Users size={15} className="text-teal-600" />
            {room.max_guests} Guests
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble size={15} className="text-teal-600" />
            {room.bed_type}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize size={15} className="text-teal-600" />
            {room.room_size}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-stone-100">
          <Link
            to={`/rooms/${room.slug}`}
            className="text-sm font-semibold text-teal-600 transition hover:text-teal-700"
          >
            View Details
          </Link>
          <Link
            to={`/rooms/${room.slug}`}
            className="rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-500 hover:text-stone-950"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
