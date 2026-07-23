import { useEffect, useState } from 'react';
import { getGalleryItems } from '@/lib/api';
import type { GalleryItem } from '@/lib/types';
import { Modal } from '@/components/Modal';

const CATEGORIES = ['All', 'Hotel', 'Rooms', 'Restaurant', 'Pool', 'Spa', 'Beach'];

export function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    getGalleryItems()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? items
    : items.filter((i) => i.category === activeCategory);

  return (
    <div>
      <section className="relative flex h-72 items-center justify-center overflow-hidden bg-stone-950">
        <img src="https://images.pexels.com/photos/2597240/pexels-photo-2597240.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Gallery" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Gallery</h1>
          <p className="mt-3 text-stone-300">A glimpse into paradise</p>
        </div>
      </section>

      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Filters */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-teal-500 text-stone-950'
                    : 'bg-white text-stone-600 hover:bg-teal-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-stone-200" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setLightboxIndex(i)}
                  className="group relative overflow-hidden rounded-2xl"
                >
                  <img
                    src={item.image_url}
                    alt={item.caption || item.category}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 to-transparent opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100" />
                  {item.caption && (
                    <p className="absolute bottom-4 left-4 text-sm font-semibold text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                      {item.caption}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal open={lightboxIndex !== null} onClose={() => setLightboxIndex(null)} maxWidth="max-w-4xl">
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <div>
            <img
              src={filtered[lightboxIndex].image_url}
              alt={filtered[lightboxIndex].caption || ''}
              className="w-full rounded-xl"
            />
            {filtered[lightboxIndex].caption && (
              <p className="mt-3 text-center text-sm text-stone-600">{filtered[lightboxIndex].caption}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
