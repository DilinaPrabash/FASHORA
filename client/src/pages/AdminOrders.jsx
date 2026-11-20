
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  X,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const formatPrice = (price) =>
  `Rs. ${Number(price || 0).toLocaleString("en-LK")}`;

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusStyle = (status) => {
  const styles = {
    Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Processing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Shipped: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Delivered: "bg-green-500/10 text-green-400 border-green-500/20",
    Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return styles[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/orders/admin/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/orders/admin/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status.");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: data.order.status }
            : order
        )
      );

      setSelectedOrder((prev) =>
        prev && prev._id === orderId
          ? { ...prev, status: data.order.status }
          : prev
      );
    } catch (err) {
      setError(err.message || "Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        order._id?.toLowerCase().includes(searchText) ||
        order.customerName?.toLowerCase().includes(searchText) ||
        order.email?.toLowerCase().includes(searchText) ||
        order.phone?.includes(searchText);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-[#d6bd91]",
    },
    {
      label: "Pending",
      value: orders.filter((order) => order.status === "Pending").length,
      icon: Clock,
      color: "text-yellow-400",
    },
    {
      label: "Processing",
      value: orders.filter((order) =>
        ["Confirmed", "Processing", "Shipped"].includes(order.status)
      ).length,
      icon: Package,
      color: "text-blue-400",
    },
    {
      label: "Delivered",
      value: orders.filter((order) => order.status === "Delivered").length,
      icon: CheckCircle,
      color: "text-green-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-[#d6bd91] tracking-widest uppercase mb-2">
            Store Management
          </p>
          <h1 className="text-3xl font-semibold">Orders</h1>
          <p className="text-gray-400 text-sm mt-2">
            Manage and track all customer orders.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-white/10 hover:border-[#d6bd91] text-sm transition disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Orders
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-[#111111] border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">{stat.label}</p>
                <Icon size={21} className={stat.color} />
              </div>

              <h2 className="text-3xl font-semibold mt-4">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Orders Section */}
      <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
        <div className="p-5 md:p-6 border-b border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">All Orders</h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredOrders.length} orders found
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full sm:w-64 bg-[#0b0b0b] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:border-[#d6bd91]"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#0b0b0b] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#d6bd91]"
              >
                <option value="All">All Statuses</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 text-center text-gray-400">
            <RefreshCw size={28} className="animate-spin mx-auto mb-3" />
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingBag
              size={40}
              className="mx-auto text-gray-600 mb-4"
            />
            <h3 className="text-lg font-medium">No orders found</h3>
            <p className="text-sm text-gray-500 mt-2">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[850px]">
              <thead className="bg-[#0b0b0b] text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-white/[0.02] transition"
                  >
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-[#d6bd91]">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-medium">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.email}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-400">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium">
                      {formatPrice(order.totalPrice)}
                    </td>

                    <td className="px-6 py-5">
                      <select
                        value={order.status}
                        disabled={updatingOrderId === order._id}
                        onChange={(e) =>
                          handleStatusUpdate(order._id, e.target.value)
                        }
                        className={`border rounded-full px-3 py-2 text-xs font-medium outline-none cursor-pointer disabled:opacity-50 ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="bg-[#111111] text-white"
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-6 py-5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#d6bd91] transition"
                      >
                        <Eye size={17} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-[#151515] border border-white/10 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#151515] border-b border-white/10 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#d6bd91] uppercase tracking-widest">
                  Order Details
                </p>
                <h2 className="text-lg font-semibold mt-1">
                  #{selectedOrder._id}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-7">
              {/* Customer Details */}
              <div>
                <h3 className="text-sm font-semibold text-[#d6bd91] mb-4">
                  Customer Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Customer Name</p>
                    <p>{selectedOrder.customerName}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 mb-1">Email</p>
                    <p>{selectedOrder.email}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 mb-1">Phone</p>
                    <p>{selectedOrder.phone}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 mb-1">Order Date</p>
                    <p>{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-semibold text-[#d6bd91] mb-4">
                  Shipping Address
                </h3>

                <div className="text-sm text-gray-300 space-y-1">
                  <p>{selectedOrder.shippingAddress?.street}</p>
                  <p>{selectedOrder.shippingAddress?.city}</p>
                  <p>{selectedOrder.shippingAddress?.postalCode}</p>
                  {selectedOrder.shippingAddress?.notes && (
                    <p className="text-gray-500">
                      Notes: {selectedOrder.shippingAddress.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-semibold text-[#d6bd91] mb-4">
                  Ordered Products
                </h3>

                <div className="space-y-4">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={`${item.product}-${index}`}
                      className="flex gap-4 items-center border-b border-white/10 pb-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 object-cover rounded-lg bg-[#222]"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Size: {item.selectedSize || "N/A"} | Qty:{" "}
                          {item.quantity}
                        </p>
                        <p className="text-sm text-[#d6bd91] mt-2">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-[#0b0b0b] rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.itemsPrice)}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Shipping Fee</span>
                  <span>{formatPrice(selectedOrder.shippingFee)}</span>
                </div>

                <div className="border-t border-white/10 pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-[#d6bd91]">
                    {formatPrice(selectedOrder.totalPrice)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Payment Method</span>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <label className="block text-sm font-semibold text-[#d6bd91] mb-3">
                  Update Order Status
                </label>

                <select
                  value={selectedOrder.status}
                  disabled={updatingOrderId === selectedOrder._id}
                  onChange={(e) =>
                    handleStatusUpdate(selectedOrder._id, e.target.value)
                  }
                  className={`w-full bg-[#0b0b0b] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#d6bd91] disabled:opacity-50`}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                {updatingOrderId === selectedOrder._id && (
                  <p className="text-xs text-gray-400 mt-2">
                    Updating order status...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
