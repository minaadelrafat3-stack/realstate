/*
# Hotel Website Schema (single-tenant, no auth)

1. Purpose
   A luxury hotel website with room browsing, booking system, reviews, gallery, and contact.
   No sign-in required — guests browse rooms and submit bookings/contact requests directly.

2. New Tables
   - `rooms`: Room types with details, pricing, facilities, images.
   - `room_images`: Multiple images per room (gallery).
   - `reviews`: Guest reviews per room.
   - `testimonials`: Homepage testimonials.
   - `gallery_items`: Hotel-wide gallery photos by category.
   - `contact_messages`: Messages submitted via the contact form.
   - `amenities`: Hotel amenities list.

3. Modified Tables
   - `bookings`: Add room_id, num_guests, num_rooms, total_price columns to align with room-based booking.

4. Security
   - RLS enabled on all tables.
   - All tables use `TO anon, authenticated` — no sign-in screen, data is intentionally public.
*/

-- ROOMS
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text NOT NULL,
  description text NOT NULL,
  price_per_night numeric NOT NULL,
  max_guests int NOT NULL DEFAULT 2,
  bed_type text NOT NULL,
  room_size text NOT NULL,
  number_of_rooms int NOT NULL DEFAULT 1,
  main_image text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_rooms" ON rooms;
CREATE POLICY "anon_select_rooms" ON rooms FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_rooms" ON rooms;
CREATE POLICY "anon_insert_rooms" ON rooms FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_rooms" ON rooms;
CREATE POLICY "anon_update_rooms" ON rooms FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_rooms" ON rooms;
CREATE POLICY "anon_delete_rooms" ON rooms FOR DELETE TO anon, authenticated USING (true);

-- ROOM IMAGES
CREATE TABLE IF NOT EXISTS room_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE room_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_room_images" ON room_images;
CREATE POLICY "anon_select_room_images" ON room_images FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_room_images" ON room_images;
CREATE POLICY "anon_insert_room_images" ON room_images FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_room_images" ON room_images;
CREATE POLICY "anon_update_room_images" ON room_images FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_room_images" ON room_images;
CREATE POLICY "anon_delete_room_images" ON room_images FOR DELETE TO anon, authenticated USING (true);

-- BOOKINGS: add columns to existing table
DO $$ BEGIN
  ALTER TABLE bookings ADD COLUMN IF NOT EXISTS room_id uuid REFERENCES rooms(id) ON DELETE SET NULL;
  ALTER TABLE bookings ADD COLUMN IF NOT EXISTS num_rooms int NOT NULL DEFAULT 1;
  ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price numeric NOT NULL DEFAULT 0;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Rename guests -> num_guests if needed (keep guests for compat)
DO $$ BEGIN
  ALTER TABLE bookings RENAME COLUMN guests TO num_guests;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Ensure bookings has RLS policies
DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_bookings" ON bookings;
CREATE POLICY "anon_update_bookings" ON bookings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_bookings" ON bookings;
CREATE POLICY "anon_delete_bookings" ON bookings FOR DELETE TO anon, authenticated USING (true);

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  body text NOT NULL,
  stay_date date,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_reviews" ON reviews;
CREATE POLICY "anon_select_reviews" ON reviews FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_reviews" ON reviews;
CREATE POLICY "anon_insert_reviews" ON reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_reviews" ON reviews;
CREATE POLICY "anon_update_reviews" ON reviews FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_reviews" ON reviews;
CREATE POLICY "anon_delete_reviews" ON reviews FOR DELETE TO anon, authenticated USING (true);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text,
  avatar_url text,
  quote text NOT NULL,
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_testimonials" ON testimonials;
CREATE POLICY "anon_select_testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_testimonials" ON testimonials;
CREATE POLICY "anon_insert_testimonials" ON testimonials FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_testimonials" ON testimonials;
CREATE POLICY "anon_update_testimonials" ON testimonials FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_testimonials" ON testimonials;
CREATE POLICY "anon_delete_testimonials" ON testimonials FOR DELETE TO anon, authenticated USING (true);

-- GALLERY ITEMS
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  image_url text NOT NULL,
  caption text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_gallery" ON gallery_items;
CREATE POLICY "anon_select_gallery" ON gallery_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_gallery" ON gallery_items;
CREATE POLICY "anon_insert_gallery" ON gallery_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_gallery" ON gallery_items;
CREATE POLICY "anon_update_gallery" ON gallery_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_gallery" ON gallery_items;
CREATE POLICY "anon_delete_gallery" ON gallery_items FOR DELETE TO anon, authenticated USING (true);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_contact_messages" ON contact_messages;
CREATE POLICY "anon_select_contact_messages" ON contact_messages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_contact_messages" ON contact_messages;
CREATE POLICY "anon_update_contact_messages" ON contact_messages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_contact_messages" ON contact_messages;
CREATE POLICY "anon_delete_contact_messages" ON contact_messages FOR DELETE TO anon, authenticated USING (true);

-- AMENITIES
CREATE TABLE IF NOT EXISTS amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_amenities" ON amenities;
CREATE POLICY "anon_select_amenities" ON amenities FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_amenities" ON amenities;
CREATE POLICY "anon_insert_amenities" ON amenities FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_amenities" ON amenities;
CREATE POLICY "anon_update_amenities" ON amenities FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_amenities" ON amenities;
CREATE POLICY "anon_delete_amenities" ON amenities FOR DELETE TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rooms_slug ON rooms(slug);
CREATE INDEX IF NOT EXISTS idx_rooms_featured ON rooms(featured);
CREATE INDEX IF NOT EXISTS idx_room_images_room_id ON room_images(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_reviews_room_id ON reviews(room_id);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_items(category);
