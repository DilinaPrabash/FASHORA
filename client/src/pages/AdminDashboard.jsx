
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const currency = (value = 0) =>
  `Rs. ${Number(value).toLocaleString("en-LK")}`;

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const statusColors = {
  Pending: "bg-yellow-500",
  Confirmed: "bg-indigo-500",
  Processing: "bg-blue-500",
  Shipped: "bg-purple-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
};

const statusTextColors = {
  Pending: "bg-yellow-500/10 text-yellow-400",
  Confirmed: "bg-indigo-500/10 text-indigo-400",
  Processing: "bg-blue-500/10 text-blue-400",
  Shipped: "bg-purple-500/10 text-purple-400",
  Delivered: "bg-green-500/10 text-green-400",
  Cancelled: "bg-red-500/10 text-red-400",
};

function SalesChart({ data = [] }) {
  const width = 700;
  const height = 230;
  const padding = { top: 20, right: 20, bottom: 35, left: 20 };

  const maxSales = Math.max(
    ...data.map((item) => Number(item.sales) || 0),
    100
  );

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((item, index) => {
    const x =
      padding.left +
      (data.length <= 1 ? chartWidth / 2 : (index / (data.length - 1)) * chartWidth);

    const y =
      padding.top +
      chartHeight -
      ((Number(item.sales) || 0) / maxSales) * chartHeight;

    return { x, y, ...item };
  });

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  const areaPath =
    points.length > 0
      ? `M ${points[0].x} ${height - padding.bottom} L ${linePoints.replace(
          /,/g,
          " "
        )} L ${points[points.length - 1].x} ${
          height - padding.bottom
        } Z`
      : "";

  return (
    <div className="w-full">
      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-gray-500">
          No sales data available.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full min-w-[500px]"
              role="img"
              aria-label="Monthly sales chart"
            >
              {[0, 1, 2, 3].map((line) => {
                const y =
                  padding.top + (chartHeight / 3) * line;

                return (
                  <line
                    key={line}
                    x1={padding.left}
                    x2={width - padding.right}
                    y1={y}
                    y2={y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="4 5"
                  />
                );
              })}

              <path d={areaPath} fill="rgba(214,189,145,0.10)" />

              <polyline
                points={linePoints}
                fill="none"
                stroke="#d6bd91"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {points.map((point, index) => (
                <g key={`${point.month}-${point.year}`}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill="#d6bd91"
                    stroke="#151515"
                    strokeWidth="2"
                  />
                  <text
                    x={point.x}
                    y={height - 10}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize="12"
                  >
                    {point.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="flex flex-wrap justify-between gap-3 mt-3 text-xs text-gray-500">
            <span>Last 6 months</span>
            <span>Sales from delivered orders</span>
          </div>
        </>
      )}
    </div>
  );
}

function OrderStatusChart({ data = [] }) {
  const total = data.reduce(
    (sum, item) => sum + Number(item.count || 0),
    0
  );

  const colors = {
    Pending: "#eab308",
    Confirmed: "#6366f1",
    Processing: "#3b82f6",
    Shipped: "#a855f7",
    Delivered: "#22c55e",
    Cancelled: "#ef4444",
  };

  let currentPercentage = 0;

  const gradientParts = data.map((item) => {
    const percentage = total
      ? (Number(item.count || 0) / total) * 100
      : 0;

    const start = currentPercentage;
    currentPercentage += percentage;

    return `${colors[item.status] || "#6b7280"} ${start}% ${currentPercentage}%`;
  });

  const background =
    total > 0
      ? `conic-gradient(${gradientParts.join(", ")})`
      : "#303030";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <div
        className="w-44 h-44 rounded-full shrink-0 flex items-center justify-center"
        style={{ background }}
      >
        <div className="w-28 h-28 rounded-full bg-[#151515] flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{total}</span>
          <span className="text-xs text-gray-500">Total Orders</span>
        </div>
      </div>

      <div className="w-full space-y-3">
        {data.map((item) => (
          <div
            key={item.status}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: colors[item.status] || "#6b7280",
                }}
              />
              <span className="text-gray-400">{item.status}</span>
            </div>

            <span className="font-semibold">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Admin authentication token not found. Please login again.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [analyticsResponse, ordersResponse] = await Promise.all([
        axios.get(`${API_URL}/analytics/admin`, config),
        axios.get(`${API_URL}/orders/admin/all`, config),
      ]);

      setAnalytics(analyticsResponse.data);

      setRecentOrders(
        (ordersResponse.data.orders || []).slice(0, 5)
      );
    } catch (err) {
      console.error("Dashboard fetch error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const summary = analytics?.summary || {};

  const stats = [
    {
      title: "Total Customers",
      value: summary.totalCustomers ?? 0,
      description: "Registered customer accounts",
      icon: Users,
    },
    {
      title: "Total Products",
      value: summary.totalProducts ?? 0,
      description: "All store products",
      icon: Package,
    },
    {
      title: "Total Orders",
      value: summary.totalOrders ?? 0,
      description: "Orders received",
      icon: ShoppingCart,
    },
    {
      title: "Total Revenue",
      value: currency(summary.totalRevenue),
      description: "Revenue from delivered orders",
      icon: DollarSign,
    },
  ];

  const monthlySales = analytics?.monthlySales || [];
  const orderStatusBreakdown = analytics?.orderStatusBreakdown || [];
  const bestSellingProducts = analytics?.bestSellingProducts || [];

  const deliveredOrders = useMemo(
    () =>
      orderStatusBreakdown.find((item) => item.status === "Delivered")
        ?.count || 0,
    [orderStatusBreakdown]
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-400">
        <RefreshCw className="animate-spin text-[#d6bd91] mb-4" size={30} />
        <p>Loading dashboard analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>

        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#d6bd91]/30 text-[#d6bd91] hover:bg-[#d6bd91]/10 transition disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Unable to load dashboard</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={() => fetchDashboardData()}
              className="underline text-sm mt-2"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-[#151515] border border-white/10 rounded-xl p-6 hover:border-[#d6bd91]/40 transition"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <p className="text-gray-400 text-sm">{item.title}</p>
                  <h2 className="text-2xl font-bold mt-3 break-words">
                    {item.value}
                  </h2>
                  <p className="text-xs text-gray-500 mt-2">
                    {item.description}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#d6bd91]/10 shrink-0">
                  <Icon className="text-[#d6bd91]" size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue and Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-[#151515] border border-white/10 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div>
              <h2 className="font-semibold text-lg">Monthly Sales</h2>
              <p className="text-gray-500 text-sm mt-1">
                Revenue from delivered orders
              </p>
            </div>

            <TrendingUp className="text-[#d6bd91]" size={23} />
          </div>

          <SalesChart data={monthlySales} />
        </div>

        {/* Quick Actions */}
        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-5">Quick Actions</h2>

          <div className="space-y-3">
            {[
              { label: "Manage Products", to: "/admin/products" },
              { label: "View Orders", to: "/admin/orders" },
              { label: "Manage Customers", to: "/admin/customers" },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-[#d6bd91]/10 transition"
              >
                <span className="text-sm">{action.label}</span>
                <ArrowUpRight className="text-[#d6bd91]" size={18} />
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-gray-400 text-sm">Delivered Orders</p>
            <p className="text-2xl font-bold text-green-400 mt-2">
              {deliveredOrders}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Successfully completed orders
            </p>
          </div>
        </div>
      </div>

      {/* Order Status and Revenue Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <div className="mb-6">
            <h2 className="font-semibold text-lg">Order Status Breakdown</h2>
            <p className="text-gray-500 text-sm mt-1">
              Overview of all order statuses
            </p>
          </div>

          <OrderStatusChart data={orderStatusBreakdown} />
        </div>

        <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-6">Revenue Summary</h2>

          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-gray-400 text-sm">Delivered Revenue</p>
                <p className="text-xs text-gray-600 mt-1">
                  Product sales from delivered orders
                </p>
              </div>
              <p className="font-semibold text-green-400">
                {currency(summary.totalRevenue)}
              </p>
            </div>

            <div className="border-t border-white/10" />

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-gray-400 text-sm">Pending Revenue</p>
                <p className="text-xs text-gray-600 mt-1">
                  Non-delivered, non-cancelled orders
                </p>
              </div>
              <p className="font-semibold text-yellow-400">
                {currency(summary.pendingRevenue)}
              </p>
            </div>

            <div className="border-t border-white/10" />

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-gray-400 text-sm">Delivered Shipping</p>
                <p className="text-xs text-gray-600 mt-1">
                  Shipping fees from delivered orders
                </p>
              </div>
              <p className="font-semibold">
                {currency(summary.deliveredShipping)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="bg-[#151515] border border-white/10 rounded-xl overflow-hidden mb-8">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-semibold text-lg">Best Selling Products</h2>
          <p className="text-gray-500 text-sm mt-1">
            Top 5 products based on delivered orders
          </p>
        </div>

        {bestSellingProducts.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No delivered product sales yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 bg-white/[0.02]">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Quantity Sold</th>
                  <th className="px-6 py-4">Revenue</th>
                </tr>
              </thead>

              <tbody>
                {bestSellingProducts.map((product, index) => (
                  <tr
                    key={product.productId}
                    className="border-t border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[#d6bd91] font-semibold">
                          #{index + 1}
                        </span>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-14 object-cover rounded-md bg-white/5"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {product.quantitySold}
                    </td>

                    <td className="px-6 py-4 text-[#d6bd91] font-semibold">
                      {currency(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

          <Link
            to="/admin/orders"
            className="text-[#d6bd91] text-sm hover:underline"
          >
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No orders found.
          </div>
        ) : (
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
                    key={order._id}
                    className="border-t border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 text-[#d6bd91]">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    <td className="px-6 py-4">
                      {order.customerName}
                    </td>

                    <td className="px-6 py-4 text-gray-400">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      {currency(order.totalPrice)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          statusTextColors[order.status] ||
                          "bg-gray-500/10 text-gray-400"
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
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
