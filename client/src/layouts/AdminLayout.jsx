import { NavLink, Outlet } from "react-router-dom";
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiFolder,
  FiFileText,
  FiStar,
  FiArrowLeft,
  FiLogOut,
  FiUser,
} from "react-icons/fi";

import useAuth from "../hooks/useAuth";

const AdminLayout = () => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FiGrid />,
      end: true,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <FiPackage />,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <FiFolder />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <FiShoppingBag />,
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: <FiStar />,
    },
    {
      name: "Blogs",
      path: "/admin/blogs",
      icon: <FiFileText />,
    },
    {
      name: "Profile",
      path: "/admin/profile",
      icon: <FiUser />,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white md:flex">
      <aside className="w-full border-b border-white/10 bg-zinc-950 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="border-b border-white/10 p-6">
          <h1 className="text-2xl font-bold tracking-widest text-lime-400">
            TRESTEP
          </h1>

          <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">
            Admin Panel
          </p>
        </div>

        <div className="border-b border-white/10 p-5">
          <p className="text-sm text-gray-400">
            Welcome
          </p>

          <p className="mt-1 truncate font-semibold">
            {user?.username || "Admin"}
          </p>

          <p className="mt-1 truncate text-xs text-gray-500">
            {user?.email || ""}
          </p>
        </div>

        <nav className="p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Management
          </p>

          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-lime-400 font-semibold text-black"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <NavLink
            to="/"
            className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
          >
            <FiArrowLeft className="text-lg" />

            <span>
              Back to Store
            </span>
          </NavLink>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            <FiLogOut className="text-lg" />

            <span>
              Logout
            </span>
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="border-b border-white/10 bg-zinc-950 px-5 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Trestep
              </p>

              <h2 className="text-lg font-semibold">
                Admin Dashboard
              </h2>
            </div>
          </div>
        </header>

        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;