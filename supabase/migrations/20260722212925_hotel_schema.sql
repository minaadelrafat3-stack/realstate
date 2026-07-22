/*
# Hotel Website Schema (single-tenant, no auth) — SECURE

1. Purpose
   A luxury hotel website with room browsing, booking system, reviews, gallery, and contact.
   No sign-in required — guests browse rooms and submit bookings/contact requests directly.

2. New Tables
   - `rooms`: Room types with details, pricing, facilities, images.
   - `room_images`: Multiple images per room (gallery).
   - `bookings`: Guest booking requests (contains PII — name, email, phone).
   - `reviews`: Guest reviews per room.
   - `testimonials`: Homepage testimonials.
   - `gallery_items`: Hotel-wide gallery photos by category.
   - `contact_messages`: Messages submitted via the contact form (contains PII).
   - `amenities`: Hotel amenities list.

3. New View
   - `room_availability`: PII-free view (room_id, check_in, check_out, status) for availability calendar.

4. Security (RLS — least privilege)
   - rooms, room_images, testimonials, gallery_items, amenities:
     Public SELECT (anon+authenticated). INSERT/UPDATE/DELETE: authenticated only.
   - reviews: Public SELECT. INSERT: anon+authenticated. UPDATE/DELETE: authenticated only.
   - bookings: INSERT: anon+authenticated. SELECT/UPDATE/DELETE: authenticated only (no anon SELECT — PII protected).
   - contact_messages: INSERT: anon+authenticated. SELECT/UPDATE/DELETE: authenticated only (no anon SELECT — PII protected).
   - room_availability view: SELECT granted to anon+authenticated (PII-free).
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
CREATE POLICY "anon_select_rooms" ON rooms FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_rooms" ON rooms;
CREATE POLICY "auth_insert_rooms" ON rooms FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_rooms" ON rooms;
CREATE POLICY "auth_update_rooms" ON rooms FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_rooms" ON rooms;
CREATE POLICY "auth_delete_rooms" ON rooms FOR DELETE
  TO authenticated USING (true);

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
CREATE POLICY "anon_select_room_images" ON room_images FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_room_images" ON room_images;
CREATE POLICY "auth_insert_room_images" ON room_images FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_room_images" ON room_images;
CREATE POLICY "auth_update_room_images" ON room_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_room_images" ON room_images;
CREATE POLICY "auth_delete_room_images" ON room_images FOR DELETE
  TO authenticated USING (true);

-- BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE SET NULL,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text,
  check_in date NOT NULL,
  check_out date NOT NULL,
  num_guests int NOT NULL DEFAULT 1,
  num_rooms int NOT NULL DEFAULT 1,
  total_price numeric NOT NULL DEFAULT 0,
  special_requests text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_select_bookings" ON bookings;
CREATE POLICY "auth_select_bookings" ON bookings FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_bookings" ON bookings;
CREATE POLICY "auth_update_bookings" ON bookings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_bookings" ON bookings;
CREATE POLICY "auth_delete_bookings" ON bookings FOR DELETE
  TO authenticated USING (true);

-- room_availability VIEW (PII-free)
CREATE OR REPLACE VIEW room_availability AS
  SELECT room_id, check_in, check_out, status
  FROM bookings
  WHERE status IN ('pending', 'confirmed');
GRANT SELECT ON room_availability TO anon, authenticated;

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
CREATE POLICY "anon_select_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_reviews" ON reviews;
CREATE POLICY "anon_insert_reviews" ON reviews FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_reviews" ON reviews;
CREATE POLICY "auth_update_reviews" ON reviews FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_reviews" ON reviews;
CREATE POLICY "auth_delete_reviews" ON reviews FOR DELETE
  TO authenticated USING (true);

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
CREATE POLICY "anon_select_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

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
CREATE POLICY "anon_select_gallery" ON gallery_items FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_gallery" ON gallery_items;
CREATE POLICY "auth_insert_gallery" ON gallery_items FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_gallery" ON gallery_items;
CREATE POLICY "auth_update_gallery" ON gallery_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_gallery" ON gallery_items;
CREATE POLICY "auth_delete_gallery" ON gallery_items FOR DELETE
  TO authenticated USING (true);

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
DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_select_contact_messages" ON contact_messages;
CREATE POLICY "auth_select_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_contact_messages" ON contact_messages;
CREATE POLICY "auth_update_contact_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
CREATE POLICY "auth_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

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
CREATE POLICY "anon_select_amenities" ON amenities FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_amenities" ON amenities;
CREATE POLICY "auth_insert_amenities" ON amenities FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_amenities" ON amenities;
CREATE POLICY "auth_update_amenities" ON amenities FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_amenities" ON amenities;
CREATE POLICY "auth_delete_amenities" ON amenities FOR DELETE
  TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rooms_slug ON rooms(slug);
CREATE INDEX IF NOT EXISTS idx_rooms_featured ON rooms(featured);
CREATE INDEX IF NOT EXISTS idx_room_images_room_id ON room_images(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_reviews_room_id ON reviews(room_id);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_items(category);
