
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ChartNoAxesCombined,
  Menu,
  X,
  LogOut,
  Store,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Analytics", path: "/admin/analytics", icon: ChartNoAxesCombined },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-64 h-screen bg-[#111111] border-r border-white/10 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-[0.15em] text-[#d6bd91]">
            FASHORA
          </h1>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-6 py-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Administration
          </p>
        </div>

        <nav className="px-3 flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-[#d6bd91] text-black font-semibold"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-[#d6bd91]"
          >
            <Store size={19} />
            Visit Store
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">

        <header className="h-20 bg-[#111111] border-b border-white/10 flex items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-300"
            >
              <Menu size={24} />
            </button>

            <h2 className="text-lg font-medium">Administration Panel</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#d6bd91] text-black flex items-center justify-center font-bold">
              A
            </div>
            <span className="hidden sm:inline text-sm text-gray-300">
              Administrator
            </span>
          </div>
        </header>

        <main className="p-5 md:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
