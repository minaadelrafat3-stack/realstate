import { supabase } from './supabase';
import type { Room, RoomImage, Review, Testimonial, GalleryItem, Amenity, Booking, ContactMessage } from './types';

// === ROOMS ===
export async function adminGetRooms(): Promise<Room[]> {
  const { data, error } = await supabase.from('rooms').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function adminCreateRoom(room: Omit<Room, 'id' | 'created_at'>): Promise<Room> {
  const { data, error } = await supabase.from('rooms').insert(room).select().single();
  if (error) throw error;
  return data;
}

export async function adminUpdateRoom(id: string, updates: Partial<Room>): Promise<Room> {
  const { data, error } = await supabase.from('rooms').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteRoom(id: string): Promise<void> {
  const { error } = await supabase.from('rooms').delete().eq('id', id);
  if (error) throw error;
}

// === ROOM IMAGES ===
export async function adminGetRoomImages(roomId: string): Promise<RoomImage[]> {
  const { data, error } = await supabase.from('room_images').select('*').eq('room_id', roomId).order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function adminCreateRoomImage(image: Omit<RoomImage, 'id' | 'created_at'>): Promise<RoomImage> {
  const { data, error } = await supabase.from('room_images').insert(image).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteRoomImage(id: string): Promise<void> {
  const { error } = await supabase.from('room_images').delete().eq('id', id);
  if (error) throw error;
}

// === BOOKINGS ===
export async function adminGetBookings(): Promise<Booking[]> {
  const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminUpdateBooking(id: string, updates: Partial<Booking>): Promise<void> {
  const { error } = await supabase.from('bookings').update(updates).eq('id', id);
  if (error) throw error;
}

export async function adminDeleteBooking(id: string): Promise<void> {
  const { error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) throw error;
}

// === REVIEWS ===
export async function adminGetReviews(): Promise<Review[]> {
  const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminDeleteReview(id: string): Promise<void> {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw error;
}

// === TESTIMONIALS ===
export async function adminGetTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function adminCreateTestimonial(t: Omit<Testimonial, 'id' | 'created_at'>): Promise<Testimonial> {
  const { data, error } = await supabase.from('testimonials').insert(t).select().single();
  if (error) throw error;
  return data;
}

export async function adminUpdateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
  const { data, error } = await supabase.from('testimonials').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
}

// === GALLERY ===
export async function adminGetGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase.from('gallery_items').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function adminCreateGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at'>): Promise<GalleryItem> {
  const { data, error } = await supabase.from('gallery_items').insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteGalleryItem(id: string): Promise<void> {
  const { error } = await supabase.from('gallery_items').delete().eq('id', id);
  if (error) throw error;
}

// === AMENITIES ===
export async function adminGetAmenities(): Promise<Amenity[]> {
  const { data, error } = await supabase.from('amenities').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function adminCreateAmenity(a: Omit<Amenity, 'id' | 'created_at'>): Promise<Amenity> {
  const { data, error } = await supabase.from('amenities').insert(a).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteAmenity(id: string): Promise<void> {
  const { error } = await supabase.from('amenities').delete().eq('id', id);
  if (error) throw error;
}

// === CONTACT MESSAGES ===
export async function adminGetMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminDeleteMessage(id: string): Promise<void> {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw error;
}
