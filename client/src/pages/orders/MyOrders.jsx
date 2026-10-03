import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { cancelOrder, getMyOrders } from "../../services/orderService";

const statuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
];

const getStatusIndex = (status) => statuses.indexOf(status);

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (order) => {
    if (!["Pending", "Confirmed", "Processing"].includes(order.orderStatus)) return;

    const confirmed = window.confirm(
      `Are you sure you want to cancel order #${String(order._id).slice(-8)}?`
    );

    if (!confirmed) return;

    try {
      setCancellingId(order._id);
      const data = await cancelOrder(order._id);

      setOrders((current) =>
        current.map((item) =>
          item._id === order._id
            ? { ...item, ...(data?.order || {}), orderStatus: "Cancelled" }
            : item
        )
      );

      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not cancel order");
    } finally {
      setCancellingId("");
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-lime-400" />
          <p className="mt-4 text-sm text-gray-500">Loading your orders...</p>
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-lime-400">Your Account</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">My Orders</h1>
          <p className="mt-3 text-sm text-gray-500">Track your orders and review delivered products.</p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center">
            <FiPackage className="mx-auto text-4xl text-gray-600" />
            <h2 className="mt-5 text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-sm text-gray-500">Your placed orders will appear here.</p>
            <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 font-semibold text-black">
              Shop Now <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentIndex = getStatusIndex(order.orderStatus);
              const canCancel = ["Pending", "Confirmed", "Processing"].includes(order.orderStatus);

              return (
                <article key={order._id} className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                  <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">Order</p>
                      <h2 className="mt-1 font-semibold">#{String(order._id).slice(-8)}</h2>
                      <p className="mt-1 text-xs text-gray-600">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.orderStatus === "Cancelled" ? "bg-red-500/10 text-red-400" : order.orderStatus === "Delivered" ? "bg-lime-400/10 text-lime-400" : "bg-white/5 text-gray-300"}`}>
                        {order.orderStatus}
                      </span>
                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => handleCancel(order)}
                          disabled={cancellingId === order._id}
                          className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </div>

                  {order.orderStatus === "Cancelled" ? (
                    <div className="flex items-center gap-3 p-5 text-sm text-red-400">
                      <FiXCircle />
                      This order has been cancelled.
                    </div>
                  ) : (
                    <div className="grid gap-3 border-b border-white/10 p-5 sm:grid-cols-5">
                      {statuses.map((status, index) => {
                        const active = currentIndex >= index;
                        return (
                          <div key={status} className="flex items-center gap-2 text-xs">
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${active ? "bg-lime-400 text-black" : "bg-white/5 text-gray-600"}`}>
                              {index === 0 ? <FiClock /> : index === 1 ? <FiCheckCircle /> : index === 2 ? <FiPackage /> : index === 3 ? <FiTruck /> : <FiCheckCircle />}
                            </span>
                            <span className={active ? "text-white" : "text-gray-600"}>{status}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="divide-y divide-white/10">
                    {(order.items || []).map((item, index) => {
                      const productId = item.product?._id || item.product || item._id;
                      return (
                        <div key={`${productId}-${index}`} className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                          <img src={item.image || item.product?.images?.[0] || "/placeholder.png"} alt={item.name || item.product?.name || "Product"} className="h-24 w-24 rounded-xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold">{item.name || item.product?.name}</h3>
                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                              <span>Qty: {item.quantity}</span>
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </div>
                            <p className="mt-2 text-sm font-semibold text-lime-400">Rs. {Number(item.price || 0).toLocaleString()}</p>
                          </div>
                          {order.orderStatus === "Delivered" && productId && (
                            <button
                              type="button"
                              onClick={() => navigate(`/product/${productId}`)}
                              className="rounded-xl border border-lime-400/40 px-4 py-3 text-sm font-semibold text-lime-400 transition hover:bg-lime-400 hover:text-black"
                            >
                              Write a Review
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-5">
                    <span className="text-sm text-gray-500">Payment: {order.paymentMethod || "COD"}</span>
                    <span className="text-lg font-bold">Total: <span className="text-lime-400">Rs. {Number(order.total || 0).toLocaleString()}</span></span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;
