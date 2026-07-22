import { useEffect, useState } from 'react';
import {
  Users, BedDouble, Maximize, ArrowLeft, Check,
  ChevronLeft, ChevronRight, MapPin, Coffee, Tv, Wind, Bath,
  Lock, ShieldCheck,
} from 'lucide-react';
import { Link, useRoute, navigate } from '@/lib/router';
import { StarRating } from '@/components/StarRating';
import { Modal } from '@/components/Modal';
import { RoomCard } from '@/components/RoomCard';
import {
  getRoomBySlug, getRoomImages, getRoomReviews, getRooms,
  getBookingsForRoom, createBooking, createReview,
} from '@/lib/api';
import {
  formatPrice, formatDate, todayISO, tomorrowISO, calcNights, calcTotalPrice,
} from '@/lib/utils';
import type { Room, RoomImage, Review } from '@/lib/types';

const FACILITIES = [
  { icon: Wind, label: 'Air Conditioning' },
  { icon: Tv, label: '55" Smart TV' },
  { icon: Coffee, label: 'Nespresso Machine' },
  { icon: Bath, label: 'Rain Shower' },
  { icon: Lock, label: 'In-room Safe' },
  { icon: ShieldCheck, label: 'Daily Housekeeping' },
];

export function RoomDetailsPage() {
  const route = useRoute();
  const slug = route.path.split('/').pop() || '';
  const [room, setRoom] = useState<Room | null>(null);
  const [images, setImages] = useState<RoomImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarRooms, setSimilarRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<string | null>(null);

  // Booking form state
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(tomorrowISO());
  const [numGuests, setNumGuests] = useState(2);
  const [numRooms, setNumRooms] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Review form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Availability
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getRoomBySlug(slug),
      getRooms(),
    ]).then(([r, allRooms]) => {
      setRoom(r);
      if (r) {
        Promise.all([
          getRoomImages(r.id),
          getRoomReviews(r.id),
          getBookingsForRoom(r.id, todayISO(), new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]),
        ]).then(([imgs, revs, bookings]) => {
          setImages(imgs);
          setReviews(revs);
          const dates: string[] = [];
          bookings.forEach((b) => {
            const start = new Date(b.check_in);
            const end = new Date(b.check_out);
            for (let d = start; d < end; d.setDate(d.getDate() + 1)) {
              dates.push(d.toISOString().split('T')[0]);
            }
          });
          setBookedDates(dates);
        });
        setSimilarRooms(allRooms.filter((rm) => rm.slug !== r.slug).slice(0, 3));
      }
    }).finally(() => setLoading(false));
  }, [slug]);

  const allImages = room ? [room.main_image, ...images.map((i) => i.image_url)] : [];
  const nights = calcNights(checkIn, checkOut);
  const totalPrice = room ? calcTotalPrice(room.price_per_night, nights, numRooms) : 0;
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;
    setBookingError(null);
    setSubmitting(true);
    try {
      const booking = await createBooking({
        room_id: room.id,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        check_in: checkIn,
        check_out: checkOut,
        num_guests: numGuests,
        num_rooms: numRooms,
        total_price: totalPrice,
        special_requests: specialRequests,
      });
      setConfirmedBooking(booking.id);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;
    setReviewSubmitting(true);
    try {
      const newReview = await createReview({
        room_id: room.id,
        author_name: reviewAuthor,
        rating: reviewRating,
        title: reviewTitle,
        body: reviewBody,
        stay_date: null,
      });
      setReviews([newReview, ...reviews]);
      setReviewOpen(false);
      setReviewAuthor('');
      setReviewTitle('');
      setReviewBody('');
      setReviewRating(5);
    } catch {
      // ignore
    } finally {
      setReviewSubmitting(false);
    }
  };

  const isDateBooked = (dateStr: string) => bookedDates.includes(dateStr);

  // Calendar rendering
  const calendarDays: (Date | null)[] = [];
  const firstDay = new Date(calendarMonth);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  for (let i = 0; i < startWeekday; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), d));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-teal-500" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50">
        <p className="text-lg text-stone-600">Room not found.</p>
        <Link to="/rooms" className="rounded-full bg-teal-500 px-6 py-2.5 text-sm font-semibold text-stone-950">
          Back to Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-50">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-24 lg:px-8">
        <Link to="/rooms" className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-teal-600">
          <ArrowLeft size={16} /> Back to Rooms
        </Link>
      </div>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => setLightboxIndex(0)}
            className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl"
          >
            <img src={allImages[0]} alt={room.name} className="h-full w-full object-cover transition group-hover:scale-105" />
          </button>
          {allImages.slice(1, 5).map((img, i) => (
            <button
              key={i}
              onClick={() => setLightboxIndex(i + 1)}
              className="group relative overflow-hidden rounded-2xl"
            >
              <img src={img} alt={`${room.name} ${i + 2}`} className="h-40 w-full object-cover transition group-hover:scale-105" loading="lazy" />
            </button>
          ))}
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: details */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-stone-900">{room.name}</h1>
                {reviews.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <StarRating rating={avgRating} />
                    <span className="text-sm text-stone-600">
                      {avgRating.toFixed(1)} ({reviews.length} reviews)
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-teal-600">{formatPrice(room.price_per_night)}</p>
                <p className="text-sm text-stone-500">per night</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-6 border-y border-stone-200 py-4">
              <span className="flex items-center gap-2 text-sm text-stone-700">
                <Users size={18} className="text-teal-600" /> {room.max_guests} Guests
              </span>
              <span className="flex items-center gap-2 text-sm text-stone-700">
                <BedDouble size={18} className="text-teal-600" /> {room.bed_type}
              </span>
              <span className="flex items-center gap-2 text-sm text-stone-700">
                <Maximize size={18} className="text-teal-600" /> {room.room_size}
              </span>
              <span className="flex items-center gap-2 text-sm text-stone-700">
                <MapPin size={18} className="text-teal-600" /> Ocean View
              </span>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold text-stone-900">About This Room</h2>
              <p className="mt-3 leading-relaxed text-stone-600">{room.description}</p>
            </div>

            {/* Facilities */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-stone-900">Room Facilities</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {FACILITIES.map((f) => (
                  <div key={f.label} className="flex items-center gap-2.5 rounded-xl bg-white p-3 shadow-sm">
                    <f.icon size={18} className="text-teal-600" />
                    <span className="text-sm text-stone-700">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Calendar */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-stone-900">Availability Calendar</h2>
              <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                    className="rounded-full p-2 text-stone-500 transition hover:bg-stone-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="text-lg font-semibold text-stone-900">
                    {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                    className="rounded-full p-2 text-stone-500 transition hover:bg-stone-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <div key={d} className="py-2 text-xs font-semibold text-stone-400">{d}</div>
                  ))}
                  {calendarDays.map((date, i) => {
                    if (!date) return <div key={i} />;
                    const dateStr = date.toISOString().split('T')[0];
                    const isPast = dateStr < todayISO();
                    const isBooked = isDateBooked(dateStr);
                    return (
                      <div
                        key={i}
                        className={`flex h-10 items-center justify-center rounded-lg text-sm ${
                          isPast
                            ? 'text-stone-300'
                            : isBooked
                            ? 'bg-rose-100 text-rose-500 line-through'
                            : 'bg-teal-50 text-teal-700'
                        }`}
                      >
                        {date.getDate()}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-teal-50" /> Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-rose-100" /> Booked
                  </span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-stone-900">Guest Reviews</h2>
                <button
                  onClick={() => setReviewOpen(true)}
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-teal-500 hover:text-teal-600"
                >
                  Write a Review
                </button>
              </div>
              {reviews.length === 0 ? (
                <p className="mt-4 rounded-xl bg-white p-6 text-center text-stone-500 shadow-sm">
                  No reviews yet. Be the first to share your experience!
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="rounded-2xl bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-stone-900">{rev.author_name}</p>
                          {rev.stay_date && (
                            <p className="text-xs text-stone-400">Stayed {formatDate(rev.stay_date)}</p>
                          )}
                        </div>
                        <StarRating rating={rev.rating} />
                      </div>
                      {rev.title && <p className="mt-2 font-semibold text-stone-800">{rev.title}</p>}
                      <p className="mt-1 text-sm leading-relaxed text-stone-600">{rev.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: booking widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-stone-900">{formatPrice(room.price_per_night)}</span>
                <span className="text-sm text-stone-500">per night</span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Check-In</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={todayISO()}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Check-Out</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || todayISO()}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Guests</label>
                    <select
                      value={numGuests}
                      onChange={(e) => setNumGuests(Number(e.target.value))}
                      className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
                    >
                      {Array.from({ length: room.max_guests }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Rooms</label>
                    <select
                      value={numRooms}
                      onChange={(e) => setNumRooms(Number(e.target.value))}
                      className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
                    >
                      {Array.from({ length: room.number_of_rooms }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {nights > 0 && (
                <div className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>{formatPrice(room.price_per_night)} x {nights} nights x {numRooms} room{numRooms > 1 ? 's' : ''}</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-stone-900">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setBookingOpen(true)}
                disabled={nights <= 0}
                className="mt-4 w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-stone-950 transition hover:bg-teal-400 disabled:opacity-50"
              >
                Book Now
              </button>
              <p className="mt-2 text-center text-xs text-stone-400">
                Free cancellation up to 48 hours before check-in
              </p>
            </div>
          </div>
        </div>

        {/* Similar Rooms */}
        {similarRooms.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-stone-900">Similar Rooms</h2>
            <div className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {similarRooms.map((r) => (
                <RoomCard key={r.id} room={r} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : allImages.length - 1); }}
            className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <ChevronLeft size={24} />
          </button>
          <img src={allImages[lightboxIndex]} alt="" className="max-h-[85vh] max-w-full rounded-xl object-contain" />
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex < allImages.length - 1 ? lightboxIndex + 1 : 0); }}
            className="absolute right-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Booking Modal */}
      <Modal open={bookingOpen} onClose={() => { setBookingOpen(false); setConfirmedBooking(null); setBookingError(null); }} title={confirmedBooking ? 'Booking Confirmed' : 'Complete Your Booking'}>
        {confirmedBooking ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
              <Check className="text-teal-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Booking Confirmed!</h3>
            <p className="mt-2 text-sm text-stone-600">
              Your booking reference is <span className="font-mono font-semibold text-teal-600">{confirmedBooking.slice(0, 8).toUpperCase()}</span>
            </p>
            <div className="mt-4 rounded-xl bg-stone-50 p-4 text-left text-sm">
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Room</span><span className="font-semibold">{room.name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Check-In</span><span className="font-semibold">{formatDate(checkIn)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Check-Out</span><span className="font-semibold">{formatDate(checkOut)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Guests</span><span className="font-semibold">{numGuests}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Nights</span><span className="font-semibold">{nights}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 mt-1 font-bold">
                <span>Total</span><span className="text-teal-600">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-stone-400">
              A confirmation email has been sent to {guestEmail}
            </p>
            <button
              onClick={() => { setBookingOpen(false); setConfirmedBooking(null); navigate('/'); }}
              className="mt-4 w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-stone-950 transition hover:bg-teal-400"
            >
              Return Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleBook} className="space-y-4">
            {/* Summary */}
            <div className="rounded-xl bg-stone-50 p-4 text-sm">
              <div className="flex justify-between py-1"><span className="text-stone-500">Room</span><span className="font-semibold">{room.name}</span></div>
              <div className="flex justify-between py-1"><span className="text-stone-500">Check-In</span><span className="font-semibold">{formatDate(checkIn)}</span></div>
              <div className="flex justify-between py-1"><span className="text-stone-500">Check-Out</span><span className="font-semibold">{formatDate(checkOut)}</span></div>
              <div className="flex justify-between py-1"><span className="text-stone-500">Nights</span><span className="font-semibold">{nights}</span></div>
              <div className="flex justify-between py-1"><span className="text-stone-500">Guests</span><span className="font-semibold">{numGuests}</span></div>
              <div className="flex justify-between py-1"><span className="text-stone-500">Rooms</span><span className="font-semibold">{numRooms}</span></div>
              <div className="flex justify-between border-t border-stone-200 pt-2 mt-1 font-bold"><span>Total</span><span className="text-teal-600">{formatPrice(totalPrice)}</span></div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Full Name</label>
              <input type="text" required value={guestName} onChange={(e) => setGuestName(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Email</label>
                <input type="email" required value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Phone</label>
                <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Special Requests</label>
              <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={3}
                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>

            {bookingError && <p className="text-sm text-rose-500">{bookingError}</p>}

            <button type="submit" disabled={submitting}
              className="w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-stone-950 transition hover:bg-teal-400 disabled:opacity-50">
              {submitting ? 'Confirming...' : `Confirm Booking - ${formatPrice(totalPrice)}`}
            </button>
          </form>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal open={reviewOpen} onClose={() => setReviewOpen(false)} title="Write a Review">
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Your Name</label>
            <input type="text" required value={reviewAuthor} onChange={(e) => setReviewAuthor(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setReviewRating(n)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${reviewRating >= n ? 'bg-amber-400 text-white' : 'bg-stone-100 text-stone-400'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Title</label>
            <input type="text" value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Review</label>
            <textarea required value={reviewBody} onChange={(e) => setReviewBody(e.target.value)} rows={4}
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
          </div>
          <button type="submit" disabled={reviewSubmitting}
            className="w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-stone-950 transition hover:bg-teal-400 disabled:opacity-50">
            {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
