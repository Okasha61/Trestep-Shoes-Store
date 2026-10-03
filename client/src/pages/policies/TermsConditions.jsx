import {
  FiArrowLeft,
  FiCheckCircle,
  FiFileText,
  FiMail,
} from "react-icons/fi";
import { Link } from "react-router-dom";

function TermsConditions() {
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
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/10">
              <FiFileText className="text-xl text-lime-400" />
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.25em] text-lime-400">
              TRESTEP
            </p>
          </div>

          <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
            Terms & Conditions
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            These terms explain the rules and conditions for using
            the Trestep website and purchasing our products.
          </p>

          <p className="mt-3 text-sm text-gray-600">
            Last updated: September 2026
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">

          <TermsSection
            number="01"
            title="Acceptance of Terms"
          >
            <p>
              By accessing or using the Trestep website, you agree to
              follow these Terms & Conditions. If you do not agree
              with these terms, please do not use the website.
            </p>
          </TermsSection>

          <TermsSection
            number="02"
            title="Website Use"
          >
            <p>
              You agree to use the website only for lawful purposes.
              You must not attempt to damage, disrupt, misuse, or gain
              unauthorized access to any part of the website.
            </p>
          </TermsSection>

          <TermsSection
            number="03"
            title="User Accounts"
          >
            <p>
              Some features may require you to create an account.
              You are responsible for providing accurate information
              and maintaining the security of your account.
            </p>

            <p>
              You should notify Trestep if you believe that your
              account has been accessed without permission.
            </p>
          </TermsSection>

          <TermsSection
            number="04"
            title="Products & Availability"
          >
            <p>
              We aim to keep product information, prices, images,
              sizes, and availability accurate. However, information
              may occasionally change without prior notice.
            </p>

            <p>
              Product availability is subject to stock levels.
            </p>
          </TermsSection>

          <TermsSection
            number="05"
            title="Prices"
          >
            <p>
              Product prices displayed on Trestep may change from
              time to time. The applicable price is the price shown
              at the time of placing an order, subject to any clearly
              stated terms or errors.
            </p>
          </TermsSection>

          <TermsSection
            number="06"
            title="Orders"
          >
            <p>
              Placing an order does not necessarily guarantee that
              the order will be fulfilled. We may contact you if
              additional information is required or if an order
              cannot be processed.
            </p>
          </TermsSection>

          <TermsSection
            number="07"
            title="Payment"
          >
            <p>
              Trestep may provide different payment options depending
              on availability. Cash on Delivery may be available for
              eligible orders.
            </p>
          </TermsSection>

          <TermsSection
            number="08"
            title="Shipping & Delivery"
          >
            <p>
              Delivery times may vary depending on location, product
              availability, courier services, weather, holidays, and
              other circumstances.
            </p>

            <p>
              Customers are responsible for providing accurate
              shipping information.
            </p>
          </TermsSection>

          <TermsSection
            number="09"
            title="Returns & Refunds"
          >
            <p>
              Returns, exchanges, and refunds are handled according
              to our Refund & Return Policy.
            </p>

            <Link
              to="/refund-policy"
              className="mt-3 inline-block font-medium text-lime-400 hover:text-lime-300"
            >
              View Refund & Return Policy →
            </Link>
          </TermsSection>

          <TermsSection
            number="10"
            title="Intellectual Property"
          >
            <p>
              Website content including branding, logos, graphics,
              designs, text, images, and other materials may belong to
              Trestep or its respective owners and may not be copied,
              reproduced, or distributed without appropriate
              permission.
            </p>
          </TermsSection>

          <TermsSection
            number="11"
            title="Third-Party Services"
          >
            <p>
              Trestep may use third-party services such as payment
              providers, delivery services, analytics tools, hosting
              services, and other integrations.
            </p>

            <p>
              These services may operate under their own terms and
              policies.
            </p>
          </TermsSection>

          <TermsSection
            number="12"
            title="Limitation of Liability"
          >
            <p>
              Trestep will make reasonable efforts to maintain the
              website and provide accurate information. However, we
              cannot guarantee that the website will always be
              uninterrupted, error-free, or available.
            </p>
          </TermsSection>

          <TermsSection
            number="13"
            title="Changes to These Terms"
          >
            <p>
              Trestep may update these Terms & Conditions when
              necessary. Updated terms will be published on this
              page.
            </p>
          </TermsSection>

          {/* Agreement */}
          <div className="rounded-2xl border border-lime-400/20 bg-lime-400/5 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <FiCheckCircle className="mt-1 flex-shrink-0 text-xl text-lime-400" />

              <div>
                <h2 className="text-lg font-semibold">
                  By using Trestep
                </h2>

                <p className="mt-2 text-sm leading-7 text-gray-400">
                  You acknowledge that you have read, understood,
                  and agreed to these Terms & Conditions and the
                  applicable policies of the website.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-lime-400/10">
                <FiMail className="text-lime-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Questions?
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  If you have questions about these terms, contact
                  our support team.
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

function TermsSection({ number, title, children }) {
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

export default TermsConditions;