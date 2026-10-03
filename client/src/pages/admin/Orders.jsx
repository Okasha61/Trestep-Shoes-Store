import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiEye,
  FiSearch,
  FiShoppingBag,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/orderService";

const statuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const Orders = () => {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  // ===============================
  // REFRESH ORDERS
  // ===============================
  const refresh = async () => {
    try {
      setLoading(true);

      const data =
        await getAllOrders();

      setOrders(
        data?.orders ||
          data?.data ||
          data ||
          []
      );

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOAD ORDERS
  // ===============================
  useEffect(() => {
    refresh();
  }, []);

  // ===============================
  // CHANGE ORDER STATUS
  // ===============================
  const change = async (
    id,
    status
  ) => {
    try {
      await updateOrderStatus(
        id,
        status
      );

      // Backend mein status:
      // pending → Pending
      // confirmed → Confirmed
      // etc.

      const normalizedStatus =
        status.charAt(0).toUpperCase() +
        status.slice(1).toLowerCase();

      setOrders((prev) =>
        prev.map((order) =>
          (order._id || order.id) === id
            ? {
                ...order,
                orderStatus:
                  normalizedStatus,
              }
            : order
        )
      );

      toast.success(
        "Order status updated"
      );

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not update order"
      );
    }
  };

  // ===============================
  // FILTER ORDERS
  // ===============================
  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const q =
          search.toLowerCase();

        const user =
          order.user ||
          order.customer ||
          {};

        return (
          String(
            order.orderNumber ||
              order._id ||
              order.id ||
              ""
          )
            .toLowerCase()
            .includes(q) ||

          String(
            user.username ||
              user.name ||
              order.shippingAddress
                ?.fullName ||
              ""
          )
            .toLowerCase()
            .includes(q) ||

          String(
            user.email ||
              order.shippingAddress
                ?.email ||
              ""
          )
            .toLowerCase()
            .includes(q)
        );
      }),
    [orders, search]
  );

  return (
    <div>
      {/* =============================== */}
      {/* PAGE HEADER */}
      {/* =============================== */}

      <p className="text-sm uppercase tracking-widest text-lime-400">
        Store Management
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Orders
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        View and update real customer
        orders.
      </p>

      {/* =============================== */}
      {/* SEARCH */}
      {/* =============================== */}

      <div className="relative mt-8 max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search order or customer..."
          className="w-full rounded-xl border border-white/10 bg-zinc-950 py-3 pl-11 pr-4 outline-none focus:border-lime-400"
        />
      </div>

      {/* =============================== */}
      {/* ORDERS TABLE */}
      {/* =============================== */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
        {loading ? (
          <div className="p-10 text-gray-500">
            Loading orders...
          </div>
        ) : !filtered.length ? (
          <div className="flex min-h-64 flex-col items-center justify-center text-gray-500">
            <FiShoppingBag className="text-4xl" />

            <p className="mt-4">
              No orders found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase text-gray-500">
                  <th className="px-6 py-4">
                    Order
                  </th>

                  <th className="px-6 py-4">
                    Customer
                  </th>

                  <th className="px-6 py-4">
                    Date
                  </th>

                  <th className="px-6 py-4">
                    Total
                  </th>

                  <th className="px-6 py-4">
                    Payment
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(
                  (order) => {
                    const id =
                      order._id ||
                      order.id;

                    const customer =
                      order.user || {};

                    return (
                      <tr
                        key={id}
                        className="border-b border-white/5"
                      >
                        {/* =============================== */}
                        {/* ORDER */}
                        {/* =============================== */}

                        <td className="px-6 py-5 font-semibold">
                          #
                          {order.orderNumber ||
                            String(
                              id
                            ).slice(-8)}
                        </td>

                        {/* =============================== */}
                        {/* CUSTOMER */}
                        {/* =============================== */}

                        <td className="px-6 py-5">
                          <p>
                            {customer.username ||
                              order
                                .shippingAddress
                                ?.fullName ||
                              "Customer"}
                          </p>

                          <p className="text-xs text-gray-600">
                            {customer.email ||
                              order
                                .shippingAddress
                                ?.email}
                          </p>
                        </td>

                        {/* =============================== */}
                        {/* DATE */}
                        {/* =============================== */}

                        <td className="px-6 py-5 text-gray-400">
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString(
                                "en-PK"
                              )
                            : "-"}
                        </td>

                        {/* =============================== */}
                        {/* TOTAL */}
                        {/* =============================== */}

                        <td className="px-6 py-5">
                          Rs.{" "}
                          {Number(
                            order.total ||
                              0
                          ).toLocaleString()}
                        </td>

                        {/* =============================== */}
                        {/* PAYMENT */}
                        {/* =============================== */}

                        <td className="px-6 py-5 text-gray-400">
                          {String(
                            order.paymentMethod ||
                              "cod"
                          ).toUpperCase()}
                        </td>

                        {/* =============================== */}
                        {/* STATUS */}
                        {/* =============================== */}

                        <td className="px-6 py-5">
                          <select
                            value={String(
                              order.orderStatus ||
                                "Pending"
                            ).toLowerCase()}
                            onChange={(e) =>
                              change(
                                id,
                                e.target.value
                              )
                            }
                            className="rounded-lg border border-white/10 bg-black px-3 py-2 text-xs"
                          >
                            <option value="pending">
                              Pending
                            </option>

                            <option value="confirmed">
                              Confirmed
                            </option>

                            <option value="processing">
                              Processing
                            </option>

                            <option value="shipped">
                              Shipped
                            </option>

                            <option value="delivered">
                              Delivered
                            </option>

                            <option value="cancelled">
                              Cancelled
                            </option>
                          </select>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;