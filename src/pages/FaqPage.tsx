import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'What time is check-in and check-out?', a: 'Check-in is from 3:00 PM and check-out is by 11:00 AM. Early check-in and late check-out can be requested subject to availability and may incur additional charges.' },
  { q: 'Is breakfast included in the room rate?', a: 'Complimentary breakfast is included with all suite bookings. For standard rooms, breakfast can be added for $25 per person per day, or enjoyed as part of our bed and breakfast package.' },
  { q: 'What is the cancellation policy?', a: 'Free cancellation is available up to 48 hours before your check-in date. Cancellations within 48 hours will be charged for one night. Non-refundable rates are available at a discount.' },
  { q: 'Do you offer airport transfers?', a: 'Yes, we provide complimentary airport shuttle service to and from the international airport. Please reserve your seat at least 24 hours in advance through the concierge.' },
  { q: 'Is the hotel pet-friendly?', a: 'Yes, we welcome well-behaved pets up to 25 lbs in designated pet-friendly rooms. A non-refundable pet fee of $75 per stay applies. Service animals are always welcome at no charge.' },
  { q: 'Are the spa and pool open to non-guests?', a: 'The spa is open to non-guests by appointment. The swimming pool and fitness center are exclusively for registered hotel guests.' },
  { q: 'Do you have accessible rooms?', a: 'Yes, we offer fully accessible rooms designed to ADA standards with wider doorways, roll-in showers, and visual alert systems. Please contact us to ensure availability.' },
  { q: 'Is parking available?', a: 'Complimentary valet parking is available for all hotel guests. Self-parking is also available in our underground garage at no additional charge.' },
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      <section className="relative flex h-72 items-center justify-center overflow-hidden bg-stone-950">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-3 text-stone-300">Everything you need to know</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-semibold text-stone-900">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-teal-600 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-stone-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
