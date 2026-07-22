import { useEffect, useState } from 'react';
import {
  Waves, ChevronDown, MapPin, ArrowRight, Quote,
} from 'lucide-react';
import { Link } from '@/lib/router';
import { SearchForm } from '@/components/SearchForm';
import { RoomCard } from '@/components/RoomCard';
import { StarRating } from '@/components/StarRating';
import { getAmenityIcon } from '@/lib/amenity-icons';
import { getFeaturedRooms, getAmenities, getTestimonials } from '@/lib/api';
import type { Room, Amenity, Testimonial } from '@/lib/types';

export function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFeaturedRooms(), getAmenities(), getTestimonials()])
      .then(([r, a, t]) => {
        setRooms(r);
        setAmenities(a);
        setTestimonials(t);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Azure Bay Hotel"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/40 to-stone-950/70" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 pt-20 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-teal-300">
            Luxury Beachfront Hotel
          </p>
          <h1 className="text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
            AZURE BAY
          </h1>
          <p className="mt-3 text-xl font-light tracking-wide text-stone-200 sm:text-2xl">
            Where the ocean meets elegance
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-stone-300">
            Experience unparalleled luxury on the shores of paradise. From breathtaking ocean views
            to world-class dining and spa, every moment is crafted for your indulgence.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/rooms"
              className="rounded-full bg-teal-500 px-8 py-3.5 text-sm font-semibold text-stone-950 shadow-lg transition hover:bg-teal-400 hover:shadow-teal-500/30"
            >
              Book Now
            </Link>
            <Link
              to="/rooms"
              className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Explore Rooms
            </Link>
          </div>
        </div>

        <div className="absolute bottom-32 left-0 right-0 z-10 mx-auto max-w-5xl px-4">
          <SearchForm variant="hero" />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/60">
          <ChevronDown size={28} />
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">
              Accommodations
            </p>
            <h2 className="mt-2 text-4xl font-bold text-stone-900">Featured Rooms & Suites</h2>
            <p className="mx-auto mt-3 max-w-2xl text-stone-600">
              Each room is a sanctuary of comfort, thoughtfully designed with premium amenities and
              stunning views.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl bg-stone-200" />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-500 hover:text-stone-950"
            >
              View All Rooms <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">
              Hotel Amenities
            </p>
            <h2 className="mt-2 text-4xl font-bold text-stone-900">Everything You Need</h2>
            <p className="mx-auto mt-3 max-w-2xl text-stone-600">
              From wellness to convenience, we offer a comprehensive range of amenities for an
              unforgettable stay.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {amenities.map((a) => {
              const Icon = getAmenityIcon(a.icon);
              return (
                <div
                  key={a.id}
                  className="group flex flex-col items-center rounded-2xl border border-stone-100 bg-stone-50 p-6 text-center transition hover:border-teal-200 hover:bg-teal-50 hover:shadow-lg"
                >
                  <div className="mb-3 rounded-full bg-teal-100 p-3 text-teal-600 transition group-hover:bg-teal-500 group-hover:text-white">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900">{a.name}</h3>
                  {a.description && (
                    <p className="mt-1 text-xs text-stone-500">{a.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-stone-950 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-400">
              Guest Stories
            </p>
            <h2 className="mt-2 text-4xl font-bold text-white">What Our Guests Say</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="flex flex-col rounded-2xl bg-stone-900 p-6 transition hover:bg-stone-800"
              >
                <Quote className="mb-3 text-teal-500" size={28} />
                <StarRating rating={t.rating} className="mb-3" />
                <p className="flex-1 text-sm leading-relaxed text-stone-300">"{t.quote}"</p>
                <div className="mt-4 flex items-center gap-3 border-t border-stone-800 pt-4">
                  {t.avatar_url && (
                    <img
                      src={t.avatar_url}
                      alt={t.author_name}
                      className="h-10 w-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">{t.author_name}</p>
                    {t.author_role && (
                      <p className="text-xs text-stone-400">{t.author_role}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">
              Find Us
            </p>
            <h2 className="mt-2 text-4xl font-bold text-stone-900">Our Location</h2>
            <div className="mt-4 flex items-center justify-center gap-2 text-stone-600">
              <MapPin className="text-teal-600" size={18} />
              <span>128 Coastal Drive, Paradise Bay, CA 90210</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-xl">
            <iframe
              title="Hotel Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-118.52%2C34.00%2C-118.47%2C34.03&layer=mapnik&marker=34.015%2C-118.495"
              className="h-[400px] w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-teal-600 py-16">
        <div className="absolute inset-0 opacity-20">
          <Waves className="absolute -right-10 top-0 text-white" size={300} />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready for Your Dream Getaway?
          </h2>
          <p className="mt-3 text-teal-50">
            Book your stay today and experience the ultimate in luxury hospitality.
          </p>
          <Link
            to="/rooms"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-950 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-900"
          >
            Book Your Stay <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
