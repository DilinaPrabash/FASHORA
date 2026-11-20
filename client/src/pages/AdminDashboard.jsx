
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "0",
    change: "Customer accounts",
    icon: Users,
  },
  {
    title: "Total Products",
    value: "0",
    change: "Products available",
    icon: Package,
  },
  {
    title: "Total Orders",
    value: "0",
    change: "Orders received",
    icon: ShoppingCart,
  },
  {
    title: "Total Revenue",
    value: "Rs. 0",
    change: "Total sales",
    icon: DollarSign,
  },
];

const recentOrders = [
  {
    id: "#FSH001",
    customer: "Sample Customer",
    date: "2026-11-20",
    amount: "Rs. 8,500",
    status: "Pending",
  },
  {
    id: "#FSH002",
    customer: "Sample Customer",
    date: "2026-11-20",
    amount: "Rs. 12,000",
    status: "Processing",
  },
  {
    id: "#FSH003",
    customer: "Sample Customer",
    date: "2026-11-19",
    amount: "Rs. 5,500",
    status: "Delivered",
  },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto">

      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Dashboard Overview
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-[#151515] border border-white/10 rounded-xl p-6 hover:border-[#d6bd91]/40 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">{item.title}</p>
                  <h2 className="text-2xl font-bold mt-3">
                    {item.value}
                  </h2>
                  <p className="text-xs text-gray-500 mt-2">
                    {item.change}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#d6bd91]/10">
                  <Icon className="text-[#d6bd91]" size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overview Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

        {/* Sales Overview */}
        <div className="xl:col-span-2 bg-[#151515] border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-semibold text-lg">Store Overview</h2>
              <p className="text-gray-500 text-sm mt-1">
                Sales performance summary
              </p>
            </div>

            <TrendingUp className="text-[#d6bd91]" size={23} />
          </div>

          <div className="h-48 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg">
            <TrendingUp className="text-[#d6bd91] mb-3" size={32} />
            <p className="text-gray-400 text-sm">Sales chart coming soon</p>
            <p className="text-gray-600 text-xs mt-2">
              Connect real order data to display analytics
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-5">Quick Actions</h2>

          <div className="space-y-3">
            <button
              onClick={() => window.location.href = "/admin/products"}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-[#d6bd91]/10 transition"
            >
              <span className="text-sm">Manage Products</span>
              <ArrowUpRight className="text-[#d6bd91]" size={18} />
            </button>

            <button
              onClick={() => window.location.href = "/admin/orders"}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-[#d6bd91]/10 transition"
            >
              <span className="text-sm">View Orders</span>
              <ArrowUpRight className="text-[#d6bd91]" size={18} />
            </button>

            <button
              onClick={() => window.location.href = "/admin/customers"}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-[#d6bd91]/10 transition"
            >
              <span className="text-sm">Manage Customers</span>
              <ArrowUpRight className="text-[#d6bd91]" size={18} />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Orders */}
      <div className="bg-[#151515] border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div>
            <h2 className="font-semibold text-lg">Recent Orders</h2>
            <p className="text-gray-500 text-sm mt-1">
              Latest customer orders
            </p>
          </div>

          <Clock className="text-[#d6bd91]" size={22} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 bg-white/[0.02]">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4 text-[#d6bd91]">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-400">{order.date}</td>
                  <td className="px-6 py-4">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        order.status === "Delivered"
                          ? "bg-green-500/10 text-green-400"
                          : order.status === "Pending"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
