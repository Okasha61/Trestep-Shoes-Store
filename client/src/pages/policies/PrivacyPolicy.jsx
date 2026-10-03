import {
  FiArrowLeft,
  FiLock,
  FiMail,
  FiShield,
} from "react-icons/fi";

import { Link } from "react-router-dom";

function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-lime-400"
        >
          <FiArrowLeft />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/10">
              <FiShield className="text-xl text-lime-400" />
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.25em] text-lime-400">
              TRESTEP
            </p>
          </div>

          <h1 className="text-4xl font-bold sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Your privacy matters to us. This policy explains how
            Trestep collects, uses, protects, and handles your
            information when you use our website.
          </p>

          <p className="mt-3 text-sm text-gray-600">
            Last updated: September 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">

          {/* 1 */}
          <PolicySection
            number="01"
            title="Information We Collect"
          >
            <p>
              When you create an account, place an order, or contact
              us, we may collect information such as your name, email
              address, phone number, shipping address, and order
              details.
            </p>

            <p>
              We may also collect basic technical information such as
              browser type, device information, and website usage
              information to improve our services.
            </p>
          </PolicySection>

          {/* 2 */}
          <PolicySection
            number="02"
            title="How We Use Your Information"
          >
            <p>
              We use collected information to process and deliver your
              orders, manage your account, communicate with you, and
              provide customer support.
            </p>

            <p>
              We may also use information to improve our products,
              website experience, security, and services.
            </p>
          </PolicySection>

          {/* 3 */}
          <PolicySection
            number="03"
            title="Account Information"
          >
            <p>
              If you create a Trestep account, you are responsible for
              keeping your account information accurate and maintaining
              the security of your login credentials.
            </p>

            <p>
              Please contact us if you believe your account has been
              accessed without authorization.
            </p>
          </PolicySection>

          {/* 4 */}
          <PolicySection
            number="04"
            title="Order & Payment Information"
          >
            <p>
              We collect information required to process your order
              and deliver products to you.
            </p>

            <div className="mt-5 flex gap-3 rounded-xl border border-lime-400/20 bg-lime-400/5 p-4">
              <FiLock className="mt-1 flex-shrink-0 text-lime-400" />

              <p className="text-sm text-gray-300">
                Payment information should be processed through
                authorized and secure payment providers. Trestep
                does not intentionally store sensitive payment
                credentials such as card passwords or PINs.
              </p>
            </div>
          </PolicySection>

          {/* 5 */}
          <PolicySection
            number="05"
            title="Cookies"
          >
            <p>
              Trestep may use cookies and similar technologies to
              remember preferences, maintain sessions, understand
              website usage, and improve your browsing experience.
            </p>
          </PolicySection>

          {/* 6 */}
          <PolicySection
            number="06"
            title="Data Protection"
          >
            <p>
              We take reasonable measures to protect your personal
              information against unauthorized access, alteration,
              disclosure, or destruction.
            </p>
          </PolicySection>

          {/* 7 */}
          <PolicySection
            number="07"
            title="Third-Party Services"
          >
            <p>
              Some features may rely on trusted third-party services
              such as hosting, analytics, email, image storage, or
              payment providers. These services may process
              information according to their own privacy policies.
            </p>
          </PolicySection>

          {/* 8 */}
          <PolicySection
            number="08"
            title="Your Choices"
          >
            <p>
              You may contact us regarding your personal information,
              account details, or questions about how your information
              is handled.
            </p>
          </PolicySection>

          {/* 9 */}
          <PolicySection
            number="09"
            title="Policy Updates"
          >
            <p>
              We may update this Privacy Policy from time to time.
              Any updated version will be published on this page with
              a revised update date.
            </p>
          </PolicySection>

          {/* Contact */}
          <div className="rounded-2xl border border-lime-400/20 bg-lime-400/5 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-lime-400/10">
                <FiMail className="text-lime-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Questions about privacy?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  If you have any questions regarding this Privacy
                  Policy, please contact the Trestep team.
                </p>

                <a
                  href="mailto:support@trestep.com"
                  className="mt-3 inline-block text-sm font-medium text-lime-400 hover:text-lime-300"
                >
                  support@trestep.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function PolicySection({
  number,
  title,
  children,
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
      <div className="flex gap-5">
        <span className="flex-shrink-0 text-sm font-bold text-lime-400">
          {number}
        </span>

        <div>
          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <div className="mt-4 space-y-3 text-sm leading-7 text-gray-400">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PrivacyPolicy;