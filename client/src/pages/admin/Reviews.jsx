import { useEffect, useState } from "react";
import { FiStar, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

import { deleteReview, getAdminReviews } from "../../services/reviewService";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAdminReviews();
      setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (review) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      setDeletingId(review._id);
      await deleteReview(review._id);
      setReviews((current) => current.filter((item) => item._id !== review._id));
      toast.success("Review deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not delete review");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-lime-400" />
      </div>
    );
  }

  return (
    <section>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lime-400">Customer Feedback</p>
        <h1 className="mt-2 text-3xl font-bold">Reviews</h1>
        <p className="mt-2 text-sm text-gray-500">{reviews.length} review{reviews.length === 1 ? "" : "s"}</p>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-8 text-center text-sm text-gray-500">No reviews found.</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-b border-white/10 bg-black/40 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">Review</th>
                  <th className="px-5 py-4">Order / Delivery</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {reviews.map((review) => (
                  <tr key={review._id} className="align-top transition hover:bg-white/[0.02]">
                    <td className="px-5 py-5">
                      <p className="font-semibold">{review.user?.username || "Customer"}</p>
                      <p className="mt-1 text-xs text-gray-600">{review.user?.email || ""}</p>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <img src={review.product?.images?.[0] || "/placeholder.png"} alt={review.product?.name || "Product"} className="h-12 w-12 rounded-lg object-cover" />
                        <span className="font-medium">{review.product?.name || "Deleted product"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((star) => (
                          <FiStar key={star} className={star <= Number(review.rating) ? "fill-lime-400 text-lime-400" : "text-gray-700"} />
                        ))}
                      </div>
                    </td>
                    <td className="max-w-sm px-5 py-5 text-gray-400">{review.comment}</td>
                    <td className="px-5 py-5">
                      <p className="font-medium">{review.order?.orderStatus || "Delivered"}</p>
                      <p className="mt-1 text-xs text-gray-600">#{String(review.order?._id || review.order || "").slice(-8)}</p>
                    </td>
                    <td className="px-5 py-5 text-xs text-gray-500">{review.createdAt ? new Date(review.createdAt).toLocaleString() : ""}</td>
                    <td className="px-5 py-5">
                      <button type="button" onClick={() => handleDelete(review)} disabled={deletingId === review._id} className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50" title="Delete review">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default Reviews;
