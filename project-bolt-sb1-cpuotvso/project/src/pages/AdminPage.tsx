import { useEffect, useState, useCallback } from 'react';
import {
  LayoutDashboard, Calendar, BedDouble, Star, MessageSquare,
  Image, Wifi, LogOut, Plus, Trash2, Edit, X, Check, Mail,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { navigate } from '@/lib/router';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Room, Booking, Review, Testimonial, GalleryItem, Amenity, ContactMessage } from '@/lib/types';
import {
  adminGetRooms, adminCreateRoom, adminUpdateRoom, adminDeleteRoom,
  adminGetBookings, adminUpdateBooking, adminDeleteBooking,
  adminGetReviews, adminDeleteReview,
  adminGetTestimonials, adminCreateTestimonial, adminUpdateTestimonial, adminDeleteTestimonial,
  adminGetGallery, adminCreateGalleryItem, adminDeleteGalleryItem,
  adminGetAmenities, adminCreateAmenity, adminDeleteAmenity,
  adminGetMessages, adminDeleteMessage,
} from '@/lib/admin-api';

type Tab = 'overview' | 'bookings' | 'rooms' | 'reviews' | 'testimonials' | 'gallery' | 'amenities' | 'messages';

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'rooms', label: 'Rooms', icon: BedDouble },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'amenities', label: 'Amenities', icon: Wifi },
  { id: 'messages', label: 'Messages', icon: Mail },
];

export function AdminPage() {
  const { user, signOut, loading } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-700 border-t-teal-500" />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-stone-900">Azure Bay Admin</span>
            <span className="hidden rounded-full bg-teal-100 px-3 py-0.5 text-xs font-semibold text-teal-700 sm:inline">
              {user.email}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#/" className="text-sm text-stone-500 transition hover:text-teal-600">View Site</a>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        {/* Sidebar */}
        <nav className="hidden w-56 shrink-0 lg:block">
          <ul className="space-y-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setTab(t.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                      tab === t.id
                        ? 'bg-teal-500 text-stone-950'
                        : 'text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <Icon size={18} /> {t.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                tab === t.id ? 'bg-teal-500 text-stone-950' : 'bg-white text-stone-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {tab === 'overview' && <OverviewTab onNavigate={setTab} />}
          {tab === 'bookings' && <BookingsTab />}
          {tab === 'rooms' && <RoomsTab />}
          {tab === 'reviews' && <ReviewsTab />}
          {tab === 'testimonials' && <TestimonialsTab />}
          {tab === 'gallery' && <GalleryTab />}
          {tab === 'amenities' && <AmenitiesTab />}
          {tab === 'messages' && <MessagesTab />}
        </div>
      </div>
    </div>
  );
}

// === Overview ===
function OverviewTab({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const [stats, setStats] = useState({ bookings: 0, rooms: 0, reviews: 0, messages: 0 });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminGetBookings(), adminGetRooms(), adminGetReviews(), adminGetMessages()])
      .then(([b, r, rev, m]) => {
        setStats({ bookings: b.length, rooms: r.length, reviews: rev.length, messages: m.length });
        setRecentBookings(b.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { label: 'Total Bookings', value: stats.bookings, icon: Calendar, color: 'bg-teal-500', tab: 'bookings' as Tab },
    { label: 'Rooms', value: stats.rooms, icon: BedDouble, color: 'bg-blue-500', tab: 'rooms' as Tab },
    { label: 'Reviews', value: stats.reviews, icon: Star, color: 'bg-amber-500', tab: 'reviews' as Tab },
    { label: 'Messages', value: stats.messages, icon: Mail, color: 'bg-rose-500', tab: 'messages' as Tab },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Dashboard Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              onClick={() => onNavigate(c.tab)}
              className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:shadow-md"
            >
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${c.color} text-white`}>
                <Icon size={24} />
              </div>
              <p className="text-3xl font-bold text-stone-900">{c.value}</p>
              <p className="text-sm text-stone-500">{c.label}</p>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-stone-900">Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <p className="text-sm text-stone-500">No bookings yet.</p>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between border-b border-stone-100 pb-3 last:border-0">
                <div>
                  <p className="font-semibold text-stone-900">{b.guest_name}</p>
                  <p className="text-xs text-stone-500">{b.guest_email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-stone-700">{formatDate(b.check_in)} → {formatDate(b.check_out)}</p>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// === Bookings ===
function BookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    adminGetBookings().then(setBookings).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminUpdateBooking(id, { status });
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this booking?')) return;
    try {
      await adminDeleteBooking(id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-stone-900">Bookings</h1>
      {bookings.length === 0 ? (
        <EmptyState message="No bookings yet." />
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left text-xs uppercase text-stone-500">
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-stone-900">{b.guest_name}</p>
                    <p className="text-xs text-stone-500">{b.guest_email}</p>
                    {b.guest_phone && <p className="text-xs text-stone-400">{b.guest_phone}</p>}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {formatDate(b.check_in)}<br />→ {formatDate(b.check_out)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-stone-900">{formatPrice(b.total_price)}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className="rounded-lg border border-stone-200 px-2 py-1 text-xs text-stone-700 outline-none focus:border-teal-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button onClick={() => handleDelete(b.id)} className="rounded-lg p-1.5 text-stone-400 transition hover:bg-rose-50 hover:text-rose-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// === Rooms ===
function RoomsTab() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Room | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    adminGetRooms().then(setRooms).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this room? This will also delete its images.')) return;
    try {
      await adminDeleteRoom(id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Rooms</h1>
        <button onClick={() => setCreating(true)} className="flex items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-teal-400">
          <Plus size={16} /> Add Room
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((r) => (
          <div key={r.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <img src={r.main_image} alt={r.name} className="h-40 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900">{r.name}</h3>
                {r.featured && <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700">Featured</span>}
              </div>
              <p className="mt-1 text-sm text-stone-500">{formatPrice(r.price_per_night)}/night · {r.max_guests} guests</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(r)} className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-100">
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(r.id)} className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-rose-500 transition hover:bg-rose-50">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <RoomFormModal
          room={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function RoomFormModal({ room, onClose, onSaved }: { room: Room | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: room?.name ?? '',
    slug: room?.slug ?? '',
    short_description: room?.short_description ?? '',
    description: room?.description ?? '',
    price_per_night: room?.price_per_night ?? 100,
    max_guests: room?.max_guests ?? 2,
    bed_type: room?.bed_type ?? 'King',
    room_size: room?.room_size ?? '40 sqm',
    number_of_rooms: room?.number_of_rooms ?? 1,
    main_image: room?.main_image ?? '',
    featured: room?.featured ?? false,
    sort_order: room?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (room) {
        await adminUpdateRoom(room.id, form);
      } else {
        await adminCreateRoom(form);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">{room ? 'Edit Room' : 'Add Room'}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
          </div>
          <Field label="Short Description" value={form.short_description} onChange={(v) => setForm({ ...form, short_description: v })} required />
          <TextArea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} required />
          <Field label="Main Image URL" value={form.main_image} onChange={(v) => setForm({ ...form, main_image: v })} required />
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField label="Price/Night" value={form.price_per_night} onChange={(v) => setForm({ ...form, price_per_night: v })} />
            <NumberField label="Max Guests" value={form.max_guests} onChange={(v) => setForm({ ...form, max_guests: v })} />
            <NumberField label="Rooms Available" value={form.number_of_rooms} onChange={(v) => setForm({ ...form, number_of_rooms: v })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Bed Type" value={form.bed_type} onChange={(v) => setForm({ ...form, bed_type: v })} />
            <Field label="Room Size" value={form.room_size} onChange={(v) => setForm({ ...form, room_size: v })} />
            <NumberField label="Sort Order" value={form.sort_order} onChange={(v) => setForm({ ...form, sort_order: v })} />
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
            Featured on homepage
          </label>
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <button type="submit" disabled={saving} className="w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-stone-950 transition hover:bg-teal-400 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Room'}
          </button>
        </form>
      </div>
    </div>
  );
}

// === Reviews ===
function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetReviews().then(setReviews).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await adminDeleteReview(id);
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-stone-900">Reviews</h1>
      {reviews.length === 0 ? (
        <EmptyState message="No reviews yet." />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-stone-900">{r.author_name}</p>
                  <div className="mt-1 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'} />
                    ))}
                  </div>
                  {r.title && <p className="mt-2 font-semibold text-stone-800">{r.title}</p>}
                  <p className="mt-1 text-sm text-stone-600">{r.body}</p>
                </div>
                <button onClick={() => handleDelete(r.id)} className="rounded-lg p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// === Testimonials ===
function TestimonialsTab() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    adminGetTestimonials().then(setItems).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await adminDeleteTestimonial(id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Testimonials</h1>
        <button onClick={() => setCreating(true)} className="flex items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-teal-400">
          <Plus size={16} /> Add
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {t.avatar_url && <img src={t.avatar_url} alt={t.author_name} className="h-10 w-10 rounded-full object-cover" />}
                <div>
                  <p className="font-semibold text-stone-900">{t.author_name}</p>
                  {t.author_role && <p className="text-xs text-stone-500">{t.author_role}</p>}
                </div>
              </div>
              <button onClick={() => handleDelete(t.id)} className="rounded-lg p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-500">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="mt-3 text-sm italic text-stone-600">"{t.quote}"</p>
          </div>
        ))}
      </div>
      {creating && <TestimonialFormModal onClose={() => setCreating(false)} onSaved={() => { setCreating(false); load(); }} />}
    </div>
  );
}

function TestimonialFormModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ author_name: '', author_role: '', avatar_url: '', quote: '', rating: 5, sort_order: 0 });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminCreateTestimonial(form);
      onSaved();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">Add Testimonial</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Author Name" value={form.author_name} onChange={(v) => setForm({ ...form, author_name: v })} required />
          <Field label="Author Role" value={form.author_role} onChange={(v) => setForm({ ...form, author_role: v })} />
          <Field label="Avatar URL" value={form.avatar_url} onChange={(v) => setForm({ ...form, avatar_url: v })} />
          <TextArea label="Quote" value={form.quote} onChange={(v) => setForm({ ...form, quote: v })} required />
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Rating (1-5)" value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
            <NumberField label="Sort Order" value={form.sort_order} onChange={(v) => setForm({ ...form, sort_order: v })} />
          </div>
          <button type="submit" disabled={saving} className="w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-stone-950 transition hover:bg-teal-400 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Testimonial'}
          </button>
        </form>
      </div>
    </div>
  );
}

// === Gallery ===
function GalleryTab() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    adminGetGallery().then(setItems).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await adminDeleteGalleryItem(id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Gallery</h1>
        <button onClick={() => setCreating(true)} className="flex items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-teal-400">
          <Plus size={16} /> Add Image
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm">
            <img src={item.image_url} alt={item.caption || item.category} className="h-40 w-full object-cover" />
            <div className="p-3">
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-600">{item.category}</span>
              {item.caption && <p className="mt-1 text-xs text-stone-500">{item.caption}</p>}
            </div>
            <button onClick={() => handleDelete(item.id)} className="absolute right-2 top-2 rounded-lg bg-stone-950/70 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-rose-500">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      {creating && <GalleryFormModal onClose={() => setCreating(false)} onSaved={() => { setCreating(false); load(); }} />}
    </div>
  );
}

function GalleryFormModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ category: 'Hotel', image_url: '', caption: '', sort_order: 0 });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminCreateGalleryItem(form);
      onSaved();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">Add Gallery Image</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} required />
          <Field label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} required />
          <Field label="Caption" value={form.caption} onChange={(v) => setForm({ ...form, caption: v })} />
          <NumberField label="Sort Order" value={form.sort_order} onChange={(v) => setForm({ ...form, sort_order: v })} />
          <button type="submit" disabled={saving} className="w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-stone-950 transition hover:bg-teal-400 disabled:opacity-50">
            {saving ? 'Saving...' : 'Add Image'}
          </button>
        </form>
      </div>
    </div>
  );
}

// === Amenities ===
function AmenitiesTab() {
  const [items, setItems] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    adminGetAmenities().then(setItems).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this amenity?')) return;
    try {
      await adminDeleteAmenity(id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Amenities</h1>
        <button onClick={() => setCreating(true)} className="flex items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-teal-400">
          <Plus size={16} /> Add
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
            <div>
              <p className="font-semibold text-stone-900">{a.name}</p>
              {a.description && <p className="text-xs text-stone-500">{a.description}</p>}
              <p className="mt-1 text-xs text-stone-400">Icon: {a.icon}</p>
            </div>
            <button onClick={() => handleDelete(a.id)} className="rounded-lg p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      {creating && <AmenityFormModal onClose={() => setCreating(false)} onSaved={() => { setCreating(false); load(); }} />}
    </div>
  );
}

function AmenityFormModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: '', icon: 'wifi', description: '', sort_order: 0 });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminCreateAmenity(form);
      onSaved();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">Add Amenity</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Icon (wifi, waves, dumbbell, utensils, sparkles, plane, car, shirt, briefcase, bell, sun)" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} required />
          <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <NumberField label="Sort Order" value={form.sort_order} onChange={(v) => setForm({ ...form, sort_order: v })} />
          <button type="submit" disabled={saving} className="w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-stone-950 transition hover:bg-teal-400 disabled:opacity-50">
            {saving ? 'Saving...' : 'Add Amenity'}
          </button>
        </form>
      </div>
    </div>
  );
}

// === Messages ===
function MessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetMessages().then(setMessages).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await adminDeleteMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-stone-900">Contact Messages</h1>
      {messages.length === 0 ? (
        <EmptyState message="No messages yet." />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-stone-900">{m.name}</p>
                  <p className="text-xs text-stone-500">{m.email}{m.phone && ` · ${m.phone}`}</p>
                  {m.subject && <p className="mt-2 text-sm font-semibold text-stone-800">{m.subject}</p>}
                  <p className="mt-1 text-sm text-stone-600">{m.message}</p>
                  <p className="mt-2 text-xs text-stone-400">{formatDate(m.created_at)}</p>
                </div>
                <button onClick={() => handleDelete(m.id)} className="rounded-lg p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// === Shared components ===
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-teal-500" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="rounded-2xl bg-white p-12 text-center text-stone-500 shadow-sm">{message}</div>;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-teal-100 text-teal-700',
    cancelled: 'bg-rose-100 text-rose-700',
    completed: 'bg-blue-100 text-blue-700',
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colors[status] || 'bg-stone-100 text-stone-600'}`}>{status}</span>;
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</label>
      <input type="text" required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
    </div>
  );
}

function TextArea({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</label>
      <textarea required={required} value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
    </div>
  );
}
