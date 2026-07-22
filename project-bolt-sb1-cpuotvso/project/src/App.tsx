import { BookingProvider } from '@/lib/booking-context';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useRoute } from '@/lib/router';
import { HomePage } from '@/pages/HomePage';
import { RoomsPage } from '@/pages/RoomsPage';
import { RoomDetailsPage } from '@/pages/RoomDetailsPage';
import { AboutPage } from '@/pages/AboutPage';
import { DiningPage } from '@/pages/DiningPage';
import { SpaPage } from '@/pages/SpaPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { ContactPage } from '@/pages/ContactPage';
import { FaqPage } from '@/pages/FaqPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { LoginPage } from '@/pages/LoginPage';
import { AdminPage } from '@/pages/AdminPage';

function Router() {
  const route = useRoute();
  const path = route.path;

  if (path === '/login') return <LoginPage />;
  if (path === '/admin') return <AdminPage />;
  if (path === '/') return <HomePage />;
  if (path === '/rooms') return <RoomsPage />;
  if (path.startsWith('/rooms/')) return <RoomDetailsPage />;
  if (path === '/about') return <AboutPage />;
  if (path === '/dining') return <DiningPage />;
  if (path === '/spa') return <SpaPage />;
  if (path === '/gallery') return <GalleryPage />;
  if (path === '/contact') return <ContactPage />;
  if (path === '/faq') return <FaqPage />;
  if (path === '/privacy') return <PrivacyPage />;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50 pt-20">
      <h1 className="text-4xl font-bold text-stone-900">404</h1>
      <p className="text-stone-600">Page not found</p>
      <a href="#/" className="rounded-full bg-teal-500 px-6 py-2.5 text-sm font-semibold text-stone-950">
        Return Home
      </a>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Router />
          <Footer />
        </div>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
