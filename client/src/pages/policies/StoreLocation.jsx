import {
  FiArrowLeft,
  FiClock,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { Link } from "react-router-dom";

function StoreLocation() {
  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">

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
            Store Location
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Visit our store, explore our latest collection, and find
            your perfect pair.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Map Placeholder */}
          <div className="relative min-h-[400px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">

            <div className="absolute inset-0 flex items-center justify-center">

              <div className="text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-lime-400/10">
                  <FiMapPin className="text-4xl text-lime-400" />
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  Trestep Store
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Store map will be available here.
                </p>

              </div>

            </div>

            {/* Decorative Grid */}
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <div className="h-full w-full bg-[linear-gradient(rgba(163,230,53,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(163,230,53,0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

          </div>

          {/* Store Details */}
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8">

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-lime-400">
              Find Us
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Trestep Flagship Store
            </h2>

            <div className="mt-8 space-y-6">

              {/* Address */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-lime-400/10">
                  <FiMapPin className="text-lime-400" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Address
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Trestep Store
                    <br />
                    Your Store Address
                    <br />
                    Karachi, Pakistan
                  </p>
                </div>
              </div>

              {/* Timing */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-lime-400/10">
                  <FiClock className="text-lime-400" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Store Hours
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Monday – Saturday
                    <br />
                    11:00 AM – 9:00 PM
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    Sunday: Closed
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-lime-400/10">
                  <FiPhone className="text-lime-400" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Phone
                  </h3>

                  <a
                    href="tel:+923000000000"
                    className="mt-1 block text-sm text-gray-400 transition hover:text-lime-400"
                  >
                    +92 300 0000000
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-lime-400/10">
                  <FiMail className="text-lime-400" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Email
                  </h3>

                  <a
                    href="mailto:support@trestep.com"
                    className="mt-1 block text-sm text-gray-400 transition hover:text-lime-400"
                  >
                    support@trestep.com
                  </a>
                </div>
              </div>

            </div>

            {/* Directions */}
            <button
              type="button"
              onClick={() =>
                alert(
                  "Add your actual Google Maps location here."
                )
              }
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3.5 font-semibold text-black transition hover:bg-lime-300"
            >
              <FiMapPin />
              Get Directions
            </button>

          </div>
        </div>

      </div>
    </main>
  );
}

export default StoreLocation;