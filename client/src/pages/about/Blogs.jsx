import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { getBlogs } from "../../services/blogService";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // LOAD BLOGS
  // ======================================================

  useEffect(() => {
    let active = true;

    const loadBlogs = async () => {
      try {
        setLoading(true);

        const data = await getBlogs();

        const list =
          data?.blogs ||
          data?.data ||
          data ||
          [];

        if (active) {
          setBlogs(
            Array.isArray(list) ? list : []
          );
        }
      } catch (error) {
        console.error(
          "Failed to load blogs:",
          error
        );

        if (active) {
          toast.error(
            error?.response?.data?.message ||
              "Failed to load blogs"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadBlogs();

    return () => {
      active = false;
    };
  }, []);

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
            Trestep Journal
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Stories, Style &{" "}
            <span className="text-lime-400">
              Inspiration.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
            Discover footwear tips, style guides,
            sports insights, and inspiration from
            Trestep.
          </p>
        </div>
      </section>

      {/* ==================================================
          BLOG LIST
      ================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:py-28">
        {loading ? (
          <p className="text-gray-500">
            Loading blogs...
          </p>
        ) : !blogs.length ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center text-gray-500">
            No blog posts published yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => {
              const id =
                blog._id || blog.id;

              return (
                <article
                  key={id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 transition hover:-translate-y-1 hover:border-lime-400/30"
                >
                  {/* ==================================================
                      BLOG IMAGE
                  ================================================== */}

                  <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-zinc-900">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={
                          blog.title ||
                          "Trestep blog"
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <span className="text-6xl font-black text-lime-400/10">
                        TS
                      </span>
                    )}

                    {/* Category */}
                    {blog.category && (
                      <span className="absolute left-4 top-4 rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-black">
                        {blog.category}
                      </span>
                    )}
                  </div>

                  {/* ==================================================
                      BLOG CONTENT
                  ================================================== */}

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FiCalendar className="text-lime-400" />

                      {blog.createdAt
                        ? new Date(
                            blog.createdAt
                          ).toLocaleDateString(
                            "en-PK"
                          )
                        : "Trestep"}
                    </div>

                    <h2 className="mt-4 text-xl font-bold leading-7 group-hover:text-lime-400">
                      {blog.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-500">
                      {blog.excerpt ||
                        blog.content ||
                        "Discover more from Trestep Journal."}
                    </p>

                    {/* ==================================================
                        READ ARTICLE

                        IMPORTANT:
                        This matches App.jsx:
                        /blogs/:id
                    ================================================== */}

                    <Link
                      to={`/blogs/${id}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-lime-400"
                    >
                      Read Article
                      <FiArrowRight />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================================================
          FOOTER CTA
      ================================================== */}

      <section className="border-t border-white/10 bg-zinc-950">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-400">
            Stay Updated
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            More stories are coming.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-500">
            Stay connected with Trestep for new
            collections, footwear tips, and style
            inspiration.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Blogs;