export function PrivacyPage() {
  return (
    <div>
      <section className="relative flex h-72 items-center justify-center overflow-hidden bg-stone-950">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Privacy Policy</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="prose prose-stone max-w-none">
            <p className="text-sm text-stone-500">Last updated: January 2025</p>

            <h2 className="mt-6 text-xl font-bold text-stone-900">1. Introduction</h2>
            <p className="mt-2 leading-relaxed text-stone-600">
              Azure Bay Hotel ("we", "our", "us") is committed to protecting your privacy. This
              policy explains how we collect, use, and safeguard your personal information when you
              visit our website or stay at our hotel.
            </p>

            <h2 className="mt-6 text-xl font-bold text-stone-900">2. Information We Collect</h2>
            <p className="mt-2 leading-relaxed text-stone-600">
              We may collect the following types of information: name, email address, phone number,
              billing address, payment details, booking preferences, and any information you provide
              through our contact forms or during your stay.
            </p>

            <h2 className="mt-6 text-xl font-bold text-stone-900">3. How We Use Your Information</h2>
            <p className="mt-2 leading-relaxed text-stone-600">
              Your information is used to process bookings, communicate with you about your
              reservation, provide requested services, improve our offerings, and send promotional
              materials (only with your consent).
            </p>

            <h2 className="mt-6 text-xl font-bold text-stone-900">4. Data Security</h2>
            <p className="mt-2 leading-relaxed text-stone-600">
              We implement appropriate technical and organizational measures to protect your
              personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="mt-6 text-xl font-bold text-stone-900">5. Cookies</h2>
            <p className="mt-2 leading-relaxed text-stone-600">
              Our website uses cookies to enhance your browsing experience, analyze traffic, and
              remember your preferences. You can control cookies through your browser settings.
            </p>

            <h2 className="mt-6 text-xl font-bold text-stone-900">6. Third-Party Services</h2>
            <p className="mt-2 leading-relaxed text-stone-600">
              We may share necessary data with trusted third-party service providers (e.g., payment
              processors) solely for the purpose of completing your booking. These parties are bound
              by confidentiality obligations.
            </p>

            <h2 className="mt-6 text-xl font-bold text-stone-900">7. Your Rights</h2>
            <p className="mt-2 leading-relaxed text-stone-600">
              You have the right to access, correct, or delete your personal data. To exercise these
              rights, please contact us at stay@azurebay.com.
            </p>

            <h2 className="mt-6 text-xl font-bold text-stone-900">8. Contact Us</h2>
            <p className="mt-2 leading-relaxed text-stone-600">
              If you have questions about this Privacy Policy, please contact us at:
              <br />Email: stay@azurebay.com
              <br />Phone: +1 (800) 555-0100
              <br />Address: 128 Coastal Drive, Paradise Bay, CA 90210
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
