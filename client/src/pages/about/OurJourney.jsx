import { Link } from "react-router-dom";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

const OurJourney = () => {
  const journey = [
    {
      year: "01",
      title: "The Idea",
      description:
        "Trestep started with a simple idea: footwear should look great, feel comfortable, and fit naturally into everyday life.",
    },
    {
      year: "02",
      title: "Building the Brand",
      description:
        "We focused on creating a modern identity with a balance of minimal design, bold character, and practical footwear.",
    },
    {
      year: "03",
      title: "Growing the Collection",
      description:
        "Our collection expanded across sports, casual, and event footwear so customers can find the right pair for every occasion.",
    },
    {
      year: "04",
      title: "The Future",
      description:
        "We're continuously working toward better products, better experiences, and a footwear community that keeps moving forward.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
            Our Journey
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            From an idea to
            <span className="text-lime-400"> every step.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
            Every brand has a beginning. Ours started with the belief that
            footwear should be more than an accessory — it should become part
            of your identity.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-5xl px-6 py-20 md:px-10 lg:py-28">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-5 top-0 hidden h-full w-px bg-white/10 md:block" />

          <div className="space-y-12">
            {journey.map((item, index) => (
              <div
                key={item.year}
                className="relative grid gap-6 md:grid-cols-[80px_1fr] md:gap-10"
              >
                {/* Number */}
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-lime-400/40 bg-black text-sm font-bold text-lime-400">
                  {item.year}
                </div>

                {/* Content */}
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-7 transition duration-300 hover:border-lime-400/30">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Chapter {index + 1}
                  </p>

                  <h2 className="mt-3 text-2xl font-bold">{item.title}</h2>

                  <p className="mt-4 leading-8 text-gray-400">
                    {item.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm text-lime-400">
                    <FiCheckCircle />
                    <span>Part of the Trestep story</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center md:px-10">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready for your next step?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-400">
            Discover the footwear collection created for every part of your
            journey.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-lime-400 px-7 py-3 font-semibold text-black transition hover:bg-lime-300"
          >
            Explore Trestep
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OurJourney;