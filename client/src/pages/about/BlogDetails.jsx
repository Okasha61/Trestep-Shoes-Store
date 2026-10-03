import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { getBlogById } from "../../services/blogService";

export default function BlogDetails() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // LOAD SINGLE BLOG
  // ======================================================

  useEffect(() => {
    let active = true;

    const loadBlog = async () => {
      try {
        setLoading(true);

        const data =
          await getBlogById(id);

        const blogData =
          data?.blog ||
          data?.data ||
          data ||
          null;

        if (active) {
          setBlog(blogData);
        }
      } catch (error) {
        console.error(
          "Failed to load blog:",
          error
        );

        if (active) {
          setBlog(null);

          toast.error(
            error?.response?.data?.message ||
              "Failed to load article"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadBlog();
    } else {
      setLoading(false);
      setBlog(null);
    }

    return () => {
      active = false;
    };
  }, [id]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-10 text-gray-400">
        Loading article...
      </div>
    );
  }

  // ======================================================
  // NOT FOUND
  // ======================================================

  if (!blog) {
    return (
      <div className="min-h-screen bg-black p-10 text-white">
        <h1 className="text-3xl font-bold">
          Article not found
        </h1>

        <Link
          to="/blogs"
          className="mt-5 inline-flex text-lime-400"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  // ======================================================
  // BLOG DETAILS
  // ======================================================

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <article className="mx-auto max-w-4xl">
        {/* ==================================================
            BACK
        ================================================== */}

        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-lime-400"
        >
          <FiArrowLeft />
          Back to Blogs
        </Link>

        {/* ==================================================
            CATEGORY
        ================================================== */}

        {blog.category && (
          <p className="mt-10 text-sm uppercase tracking-[0.3em] text-lime-400">
            {blog.category}
          </p>
        )}

        {/* ==================================================
            TITLE
        ================================================== */}

        <h1 className="mt-4 text-4xl font-black sm:text-6xl">
          {blog.title}
        </h1>

        {/* ==================================================
            DATE
        ================================================== */}

        <p className="mt-5 flex items-center gap-2 text-sm text-gray-500">
          <FiCalendar />

          {blog.createdAt
            ? new Date(
                blog.createdAt
              ).toLocaleDateString(
                "en-PK"
              )
            : "Trestep"}
        </p>

        {/* ==================================================
            BLOG IMAGE
        ================================================== */}

        {blog.image && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
            <img
              src={blog.image}
              alt={
                blog.title ||
                "Trestep blog"
              }
              className="h-auto max-h-[600px] w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />
          </div>
        )}

        {/* ==================================================
            EXCERPT
        ================================================== */}

        {blog.excerpt && (
          <p className="mt-8 text-lg leading-8 text-gray-400">
            {blog.excerpt}
          </p>
        )}

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="mt-10 whitespace-pre-wrap rounded-3xl border border-white/10 bg-zinc-950 p-7 leading-8 text-gray-300">
          {blog.content ||
            blog.excerpt ||
            "No article content available."}
        </div>

        {/* ==================================================
            AUTHOR
        ================================================== */}

        {blog.author && (
          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-gray-500">
            Written by{" "}
            <span className="font-semibold text-white">
              {blog.author}
            </span>
          </div>
        )}
      </article>
    </main>
  );
}