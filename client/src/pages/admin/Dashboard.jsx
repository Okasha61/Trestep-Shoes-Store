import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiArrowRight,
  FiPackage,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";

import toast from "react-hot-toast";
import api from "../../services/api";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");

        if (!isMounted) return;

        const dashboardData =
          response.data?.dashboard || {};

        setData(dashboardData);
      } catch (error) {
        console.error("Dashboard error:", error);

        if (isMounted) {
          toast.error(
            error?.response?.data?.message ||
              "Failed to load dashboard"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    // Refresh dashboard every 5 seconds
    // so data stays live.
    const interval = setInterval(fetchDashboard, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // ======================================================
  // CURRENCY FORMAT
  // ======================================================

  const formatPKR = (amount) => {
    return `Rs. ${Number(
      amount || 0
    ).toLocaleString("en-PK")}`;
  };

  // ======================================================
  // DASHBOARD STATS
  // ======================================================

  const stats = [
    {
      title: "Total Products",
      value: data?.totalProducts ?? 0,
      icon: <FiPackage />,
      link: "/admin/products",
    },

    {
      title: "Total Orders",
      value: data?.totalOrders ?? 0,
      icon: <FiShoppingBag />,
      link: "/admin/orders",
    },

    {
      title: "Customers",
      value: data?.totalUsers ?? 0,
      icon: <FiUsers />,
      link: "/admin",
    },

    {
      title: "Revenue",
      value: formatPKR(data?.totalRevenue),
      icon: (
        <span className="text-sm font-bold">
          Rs
        </span>
      ),
      link: "/admin/orders",
    },
  ];

  const orders = data?.recentOrders || [];

  return (
    <div>
      {/* Header */}

      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest text-lime-400">
          Overview
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Live store data from MongoDB.
        </p>
      </div>

      {/* Stats */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="rounded-2xl border border-white/10 bg-zinc-950 p-6 transition hover:-translate-y-1 hover:border-lime-400/30"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {stat.title}
                </p>

                <h2 className="mt-3 text-2xl font-bold">
                  {loading ? "..." : stat.value}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-xl text-lime-400">
                {stat.icon}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-lime-400">
              View details
              <FiArrowRight />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}

      <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950">
        <div className="flex justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-xl font-bold">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest customer orders.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="text-sm font-semibold text-lime-400"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase text-gray-500">
                <th className="px-6 py-4">
                  Order
                </th>

                <th className="px-6 py-4">
                  Customer
                </th>

                <th className="px-6 py-4">
                  Amount
                </th>

                <th className="px-6 py-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const user = order.user || {};

                return (
                  <tr
                    key={order._id}
                    className="border-b border-white/5"
                  >
                    <td className="px-6 py-5">
                      #
                      {order.orderNumber ||
                        String(order._id).slice(-8)}
                    </td>

                    <td className="px-6 py-5 text-gray-400">
                      {user.username ||
                        order.shippingAddress
                          ?.fullName ||
                        "Customer"}
                    </td>

                    <td className="px-6 py-5">
                      {formatPKR(order.total)}
                    </td>

                    <td className="px-6 py-5 text-lime-400">
                      {order.orderStatus ||
                        order.status ||
                        "pending"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!loading && !orders.length && (
            <p className="p-8 text-center text-gray-500">
              No recent orders.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;