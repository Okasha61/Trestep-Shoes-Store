import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiAward,
  FiHeart,
  FiTarget,
  FiTruck,
} from "react-icons/fi";

const About = () => {
  const values = [
    {
      icon: <FiAward />,
      title: "Quality First",
      description:
        "We focus on quality footwear that combines durability, comfort, and modern design.",
    },
    {
      icon: <FiHeart />,
      title: "Made for You",
      description:
        "Every collection is designed around different lifestyles, styles, and everyday needs.",
    },
    {
      icon: <FiTarget />,
      title: "Our Vision",
      description:
        "Our goal is to make premium-looking footwear accessible without compromising on quality.",
    },
    {
      icon: <FiTruck />,
      title: "Reliable Service",
      description:
        "From browsing to delivery, we aim to provide a smooth and reliable shopping experience.",
    },
  ];

  return (
    <div className="bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 lg:py-32">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
              About Trestep
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
              Step Into
              <span className="block text-lime-400">Your Style.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
              Trestep is a modern footwear brand built for people who want
              comfort, confidence, and style in every step. From sports to
              casual everyday wear, we bring footwear for every moment.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-6 py-3 font-semibold text-black transition hover:bg-lime-300"
              >
                Explore Collection
                <FiArrowRight />
              </Link>

              <Link
                to="/our-journey"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold transition hover:border-lime-400 hover:text-lime-400"
              >
                Our Journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-400">
              Who We Are
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              More Than Just Shoes
            </h2>

            <div className="mt-6 space-y-5 leading-8 text-gray-400">
              <p>
                At Trestep, we believe that the right pair of shoes can change
                the way you move, feel, and present yourself.
              </p>

              <p>
                That's why we bring together modern designs, comfortable
                materials, and practical functionality to create footwear
                suitable for different lifestyles.
              </p>

              <p>
                Whether you're heading to the gym, playing your favorite sport,
                going out with friends, or attending a special event, Trestep
                wants to be part of every step.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-12">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-lime-400/20 bg-lime-400/5 p-7">
                <span className="text-7xl font-black text-lime-400/20">
                  TS
                </span>

                <div>
                  <p className="text-5xl font-bold">01</p>

                  <p className="mt-3 text-sm uppercase tracking-[0.2em] text-gray-500">
                    Every step matters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-white/10 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-400">
              What We Stand For
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Built Around You
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-white/10 bg-black p-6 transition duration-300 hover:-translate-y-1 hover:border-lime-400/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-xl text-lime-400">
                  {value.icon}
                </div>

                <h3 className="mt-6 text-lg font-bold">{value.title}</h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:py-28">
        <div className="rounded-3xl border border-lime-400/20 bg-lime-400/5 px-6 py-14 text-center md:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-400">
            Find Your Pair
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">
            Your next favorite pair is waiting.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-400">
            Explore our latest footwear collections and find the pair that
            matches your style.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-lime-400 px-7 py-3 font-semibold text-black transition hover:bg-lime-300"
          >
            Shop Now
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;