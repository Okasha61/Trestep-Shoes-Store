import { useState } from "react";
import {
  FiCheckCircle,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { sendContactMessage } from "../../services/contactService";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.name.trim() ||
    !formData.email.trim() ||
    !formData.subject.trim() ||
    !formData.message.trim()
  ) {
    toast.error("Please fill in all fields.");
    return;
  }

  try {
    setLoading(true);

    await sendContactMessage(formData);

    toast.success(
      "Your message has been sent successfully."
    );

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message ||
        "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  const contactInfo = [
    {
      icon: <FiMail />,
      title: "Email",
      value: "support@trestep.com",
      href: "mailto:support@trestep.com",
    },
    {
      icon: <FiPhone />,
      title: "Phone",
      value: "+92 300 0000000",
      href: "tel:+923000000000",
    },
    {
      icon: <FiMapPin />,
      title: "Store",
      value: "Karachi, Pakistan",
      href: "/store-location",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
            Contact Us
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Let's talk about
            <span className="text-lime-400"> Trestep.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
            Have a question about an order, product, size, delivery, or
            anything else? Our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Information */}
          <div>
            <h2 className="text-3xl font-bold">Get in touch</h2>

            <p className="mt-4 leading-7 text-gray-500">
              Send us a message and we'll get back to you as soon as possible.
            </p>

            <div className="mt-8 space-y-4">
              {contactInfo.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-5 transition hover:border-lime-400/30"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lime-400/10 text-xl text-lime-400">
                    {item.icon}
                  </span>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      {item.title}
                    </p>

                    <p className="mt-1 font-medium">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Support */}
            <div className="mt-6 rounded-2xl border border-lime-400/20 bg-lime-400/5 p-6">
              <div className="flex gap-3">
                <FiCheckCircle className="mt-1 shrink-0 text-lime-400" />

                <div>
                  <h3 className="font-semibold">We're here to help</h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    For order-related questions, please include your order
                    number in your message.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-8">
            <h2 className="text-2xl font-bold">Send a message</h2>

            <p className="mt-2 text-sm text-gray-500">
              Fill out the form below and we'll get back to you.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Name + Email */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-lime-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-lime-400"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-lime-400"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-lime-400"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}

                {!loading && <FiSend />}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;