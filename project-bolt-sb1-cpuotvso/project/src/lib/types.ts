export interface Room {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price_per_night: number;
  max_guests: number;
  bed_type: string;
  room_size: string;
  number_of_rooms: number;
  main_image: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface RoomImage {
  id: string;
  room_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface RoomWithImages extends Room {
  images?: RoomImage[];
}

export interface Booking {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  num_guests: number;
  num_rooms: number;
  total_price: number;
  special_requests: string | null;
  status: string;
  created_at: string;
}

export interface Review {
  id: string;
  room_id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string;
  stay_date: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  avatar_url: string | null;
  quote: string;
  rating: number;
  sort_order: number;
}

export interface GalleryItem {
  id: string;
  category: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  sort_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
}

export interface BookingDraft {
  roomId: string;
  roomSlug: string;
  roomName: string;
  roomPrice: number;
  checkIn: string;
  checkOut: string;
  numGuests: number;
  numRooms: number;
  nights: number;
  totalPrice: number;
}
