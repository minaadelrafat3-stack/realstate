import { supabase } from './supabase';
import type {
  Room,
  RoomImage,
  Review,
  Testimonial,
  GalleryItem,
  Amenity,
  Booking,
  ContactMessage,
} from './types';

export async function getRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('featured', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getRoomImages(roomId: string): Promise<RoomImage[]> {
  const { data, error } = await supabase
    .from('room_images')
    .select('*')
    .eq('room_id', roomId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getRoomReviews(roomId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getAmenities(): Promise<Amenity[]> {
  const { data, error } = await supabase
    .from('amenities')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getBookingsForRoom(
  roomId: string,
  startDate: string,
  endDate: string,
): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('room_id', roomId)
    .in('status', ['pending', 'confirmed'])
    .or(`and(check_in.lt.${endDate},check_out.gt.${startDate})`);
  if (error) throw error;
  return data ?? [];
}

export async function createBooking(
  booking: Omit<Booking, 'id' | 'created_at' | 'status'>,
): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({ ...booking, status: 'pending' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createContactMessage(
  message: Omit<ContactMessage, 'id' | 'created_at'>,
): Promise<void> {
  const { error } = await supabase.from('contact_messages').insert(message);
  if (error) throw error;
}

export async function createReview(
  review: Omit<Review, 'id' | 'created_at'>,
): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();
  if (error) throw error;
  return data;
}

