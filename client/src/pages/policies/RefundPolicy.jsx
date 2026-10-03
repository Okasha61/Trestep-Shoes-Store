import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiXCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

function RefundPolicy() {
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
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-lime-400">
            TRESTEP
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Refund & Return Policy
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            We want you to be happy with your Trestep purchase.
            Please review the following return and refund guidelines.
          </p>

          <p className="mt-3 text-sm text-gray-600">
            Last updated: September 2026
          </p>
        </div>

        {/* Policy Cards */}
        <div className="grid gap-5 sm:grid-cols-2">

          {/* Eligible */}
          <div className="rounded-2xl border border-lime-400/20 bg-lime-400/5 p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/10">
              <FiCheckCircle className="text-xl text-lime-400" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Eligible for Return
            </h2>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-400">
              <li>
                • Product must be unused and unworn.
              </li>
              <li>
                • Product should be returned in original condition.
              </li>
              <li>
                • Original packaging should be included where possible.
              </li>
              <li>
                • Return request should be made within the applicable
                return period.
              </li>
            </ul>
          </div>

          {/* Not Eligible */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <FiXCircle className="text-xl text-red-400" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Not Eligible
            </h2>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-400">
              <li>
                • Products showing signs of use or damage.
              </li>
              <li>
                • Products damaged after delivery due to customer
                misuse.
              </li>
              <li>
                • Items missing important original packaging or
                accessories.
              </li>
              <li>
                • Products outside the applicable return period.
              </li>
            </ul>
          </div>

        </div>

        {/* Main Policy */}
        <div className="mt-6 space-y-6">

          <PolicySection
            icon={<FiClock />}
            title="Return Period"
          >
            <p>
              Customers should contact Trestep as soon as possible
              after receiving an item if they want to request a
              return or exchange.
            </p>

            <p>
              The exact return window may depend on the product and
              order conditions shown at the time of purchase.
            </p>
          </PolicySection>

          <PolicySection
            icon={<FiRefreshCw />}
            title="Exchange"
          >
            <p>
              If the selected size does not fit, an exchange may be
              available depending on product availability and the
              condition of the returned item.
            </p>

            <p>
              Exchange requests should be made before sending the
              product back so our team can guide you through the
              process.
            </p>
          </PolicySection>

          <PolicySection
            icon={<FiRefreshCw />}
            title="Refund Process"
          >
            <p>
              Once a returned product is received and inspected, we
              will determine whether it meets the return requirements.
            </p>

            <p>
              Approved refunds will be processed using the applicable
              refund method available for the order.
            </p>
          </PolicySection>

          <PolicySection
            icon={<FiXCircle />}
            title="Damaged or Incorrect Product"
          >
            <p>
              If you receive a damaged, defective, or incorrect
              product, contact Trestep as soon as possible with your
              order details and supporting photos where appropriate.
            </p>

            <p>
              Our team will review the issue and provide the next
              steps.
            </p>
          </PolicySection>

          <PolicySection
            icon={<FiCheckCircle />}
            title="Important Conditions"
          >
            <p>
              Products should be packed securely when being returned.
              Trestep may decline a return if the product has been
              used, intentionally damaged, or does not meet the
              applicable return requirements.
            </p>
          </PolicySection>

        </div>

        {/* Contact CTA */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-xl font-semibold">
            Need help with a return?
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Contact our support team with your order number and a
            short description of the issue.
          </p>

          <a
            href="mailto:support@trestep.com"
            className="mt-5 inline-flex rounded-xl bg-lime-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-lime-300"
          >
            Contact Support
          </a>
        </div>

      </div>
    </main>
  );
}

function PolicySection({ icon, title, children }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-lime-400/10 text-lime-400">
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <div className="mt-3 space-y-3 text-sm leading-7 text-gray-400">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default RefundPolicy;