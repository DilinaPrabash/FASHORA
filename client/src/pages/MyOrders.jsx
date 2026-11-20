
import { useEffect, useState } from "react";
import { Package, ShoppingBag, RefreshCw, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login to view your orders.");
      }

      const response = await fetch(`${API_URL}/orders/my-orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load orders.");
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

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusStyle = (status) => {
    const styles = {
      Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      Confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Processing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      Shipped: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      Delivered: "bg-green-500/10 text-green-400 border-green-500/20",
      Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    };

    return (
      styles[status] ||
      "bg-gray-500/10 text-gray-400 border-gray-500/20"
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-4 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[4px] text-[#c9a45c]">
              FASHORA ACCOUNT
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-gray-400">
              Track and manage your purchases.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center justify-center gap-2 border border-[#c9a45c]/50 px-5 py-3 text-sm text-[#c9a45c] transition hover:bg-[#c9a45c] hover:text-black disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Orders
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#c9a45c] border-t-transparent" />
            <p className="text-gray-400">Loading your orders...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="mb-4 text-red-400">{error}</p>

            <button
              onClick={fetchOrders}
              className="bg-[#c9a45c] px-6 py-2 font-medium text-black hover:bg-[#b58d46]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty Orders */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-lg border border-white/10 bg-[#121212] px-5 text-center">
            <div className="mb-5 rounded-full bg-[#c9a45c]/10 p-5">
              <ShoppingBag size={40} className="text-[#c9a45c]" />
            </div>

            <h2 className="mb-2 text-2xl font-semibold">
              No Orders Yet
            </h2>

            <p className="mb-6 max-w-md text-gray-400">
              You haven't placed any orders yet. Explore our collection
              and find something you love.
            </p>

            <Link
              to="/products"
              className="bg-[#c9a45c] px-8 py-3 font-semibold text-black transition hover:bg-[#b58d46]"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            <p className="text-sm text-gray-400">
              You have {orders.length} order(s).
            </p>

            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-lg border border-white/10 bg-[#121212]"
              >
                {/* Order Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
                      Order ID
                    </p>

                    <p className="break-all font-medium text-[#c9a45c]">
                      #{order._id}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <CalendarDays size={16} />
                      {formatDate(order.createdAt)}
                    </div>

                    <span
                      className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 p-5">
                  {order.items?.map((item, index) => (
                    <div
                      key={`${item.product}-${index}`}
                      className="flex flex-col gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-20 rounded object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>

                        <p className="mt-1 text-sm text-gray-400">
                          Size: {item.selectedSize || "N/A"}
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-[#c9a45c]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-white/10 bg-[#171717] p-5">
                  <div className="ml-auto max-w-sm space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Items Price</span>
                      <span>{formatPrice(order.itemsPrice)}</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Shipping Fee</span>
                      <span>{formatPrice(order.shippingFee)}</span>
                    </div>

                    <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-bold">
                      <span>Total</span>
                      <span className="text-[#c9a45c]">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>

                    <p className="pt-2 text-right text-xs text-gray-500">
                      Payment Method: {order.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
