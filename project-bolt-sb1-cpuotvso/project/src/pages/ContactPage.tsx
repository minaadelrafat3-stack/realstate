import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Check } from 'lucide-react';
import { createContactMessage } from '@/lib/api';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createContactMessage({ name, email, phone, subject, message });
      setSubmitted(true);
      setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="relative flex h-72 items-center justify-center overflow-hidden bg-stone-950">
        <img src="https://images.pexels.com/photos/5379226/pexels-photo-5379226.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Contact" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Contact Us</h1>
          <p className="mt-3 text-stone-300">We're here to help</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold text-stone-900">Get in Touch</h2>
              <p className="mt-3 text-stone-600">
                Whether you have a question about reservations, amenities, or special requests, our
                team is ready to assist you.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Address</h3>
                    <p className="text-sm text-stone-600">128 Coastal Drive, Paradise Bay, CA 90210</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Phone</h3>
                    <a href="tel:+18005550100" className="text-sm text-stone-600 hover:text-teal-600">+1 (800) 555-0100</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Email</h3>
                    <a href="mailto:stay@azurebay.com" className="text-sm text-stone-600 hover:text-teal-600">stay@azurebay.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Working Hours</h3>
                    <p className="text-sm text-stone-600">Front Desk: 24/7</p>
                    <p className="text-sm text-stone-600">Concierge: 7:00 AM - 11:00 PM</p>
                    <p className="text-sm text-stone-600">Reservations: 8:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl shadow-lg">
                <iframe
                  title="Hotel Location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-118.52%2C34.00%2C-118.47%2C34.03&layer=mapnik&marker=34.015%2C-118.495"
                  className="h-64 w-full border-0"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                    <Check className="text-teal-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">Message Sent!</h3>
                  <p className="mt-2 text-sm text-stone-600">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 rounded-full border border-stone-300 px-6 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-teal-500 hover:text-teal-600"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-2xl font-bold text-stone-900">Send a Message</h2>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Email</label>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Phone</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Subject</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Message</label>
                    <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={5}
                      className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" />
                  </div>
                  {error && <p className="text-sm text-rose-500">{error}</p>}
                  <button type="submit" disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 py-3 text-sm font-semibold text-stone-950 transition hover:bg-teal-400 disabled:opacity-50">
                    <Send size={16} /> {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
