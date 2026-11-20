
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  ArrowLeft,
  ShoppingBag,
  LoaderCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const shippingFee = 500;
  const grandTotal = cartTotal + shippingFee;

  const formatPrice = (price) =>
    `LKR ${Number(price).toLocaleString("en-LK")}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login before placing your order.");
      }

      const formData = new FormData(e.currentTarget);

      const orderData = {
        customerName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),

        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          selectedSize: item.selectedSize || "",
        })),

        shippingAddress: {
          street: formData.get("address"),
          city: formData.get("city"),
          postalCode: formData.get("postalCode"),
          notes: formData.get("notes") || "",
        },

        paymentMethod: "COD",
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place your order.");
      }

      setCustomerName(orderData.customerName);
      setOrderId(data.order._id);

      // Clear cart only after successful order creation
      clearCart();

      setIsOrderPlaced(true);
    } catch (error) {
      console.error("Checkout error:", error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Confirmation
  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-6 py-20">
        <div className="max-w-xl w-full text-center border border-white/10 bg-[#111] p-10 md:p-14">
          <CheckCircle size={65} className="text-[#d6bd91] mx-auto mb-6" />

          <p className="text-[#d6bd91] tracking-[4px] text-sm mb-4">
            ORDER CONFIRMED
          </p>

          <h1 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] mb-5">
            Thank You, {customerName}!
          </h1>

          <p className="text-gray-400 leading-7 mb-5">
            Your order has been placed successfully.
            We will contact you regarding your delivery.
          </p>

          <div className="bg-[#151515] border border-white/10 p-4 mb-8">
            <p className="text-xs text-gray-500 mb-2">
              YOUR ORDER ID
            </p>
            <p className="text-[#d6bd91] text-sm break-all">
              {orderId}
            </p>
          </div>

          <p className="text-gray-400 text-sm mb-8">
            Payment Method: Cash on Delivery
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-[#d6bd91] text-black px-8 py-4 text-sm tracking-widest hover:bg-white transition"
          >
            <ShoppingBag size={18} />
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col items-center justify-center px-6 text-center">
        <ShoppingBag size={55} className="text-[#d6bd91] mb-6" />

        <h1 className="text-4xl font-['Cormorant_Garamond'] mb-3">
          Your Cart Is Empty
        </h1>

        <p className="text-gray-400 mb-8">
          Add some products before proceeding to checkout.
        </p>

        <Link
          to="/products"
          className="bg-[#d6bd91] text-black px-8 py-4 tracking-widest text-sm hover:bg-white transition"
        >
          EXPLORE PRODUCTS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-6 md:px-10 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">

        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#d6bd91] transition mb-10 text-sm"
        >
          <ArrowLeft size={17} />
          Back to Cart
        </Link>

        <div className="mb-12">
          <p className="text-[#d6bd91] tracking-[4px] text-sm mb-3">
            FASHORA / CHECKOUT
          </p>

          <h1 className="text-5xl md:text-6xl font-['Cormorant_Garamond']">
            Complete Your Order
          </h1>

          <p className="text-gray-400 mt-3">
            Just a few details before your style arrives.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Customer Details */}
            <div className="lg:col-span-2 space-y-10">

              <section>
                <h2 className="text-2xl font-['Cormorant_Garamond'] mb-6">
                  01. Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Enter your full name"
                      className="w-full bg-[#151515] border border-white/10 px-4 py-4 outline-none focus:border-[#d6bd91] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="example@email.com"
                      className="w-full bg-[#151515] border border-white/10 px-4 py-4 outline-none focus:border-[#d6bd91] transition"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      pattern="[0-9+\-\s]{9,15}"
                      placeholder="07XXXXXXXX"
                      className="w-full bg-[#151515] border border-white/10 px-4 py-4 outline-none focus:border-[#d6bd91] transition"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-['Cormorant_Garamond'] mb-6">
                  02. Delivery Address
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="House number and street"
                      className="w-full bg-[#151515] border border-white/10 px-4 py-4 outline-none focus:border-[#d6bd91] transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="Your city"
                        className="w-full bg-[#151515] border border-white/10 px-4 py-4 outline-none focus:border-[#d6bd91] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        placeholder="Postal code"
                        className="w-full bg-[#151515] border border-white/10 px-4 py-4 outline-none focus:border-[#d6bd91] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows="3"
                      placeholder="Any special delivery instructions?"
                      className="w-full bg-[#151515] border border-white/10 px-4 py-4 outline-none focus:border-[#d6bd91] transition resize-none"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-['Cormorant_Garamond'] mb-5">
                  03. Payment Method
                </h2>

                <div className="border border-[#d6bd91] bg-[#151515] p-5">
                  <p className="text-[#d6bd91] font-medium mb-1">
                    Cash on Delivery
                  </p>
                  <p className="text-gray-400 text-sm">
                    Pay when your order arrives. Online payment
                    will be added later.
                  </p>
                </div>
              </section>
            </div>

            {/* Order Summary */}
            <aside className="lg:col-span-1">
              <div className="bg-[#151515] border border-white/10 p-6 md:p-8 sticky top-8">
                <h2 className="text-2xl font-['Cormorant_Garamond'] mb-7">
                  Your Order
                </h2>

                <div className="space-y-6 mb-7">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.selectedSize || "default"}`}
                      className="flex gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-24 object-cover"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm mb-1">{item.name}</h3>

                        {item.selectedSize && (
                          <p className="text-xs text-gray-500">
                            Size: {item.selectedSize}
                          </p>
                        )}

                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity}
                        </p>

                        <p className="text-[#d6bd91] text-sm mt-2">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-5 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Delivery Fee</span>
                    <span>{formatPrice(shippingFee)}</span>
                  </div>

                  <div className="border-t border-white/10 pt-5 flex justify-between items-center">
                    <span className="text-lg">Total</span>
                    <span className="text-xl text-[#d6bd91]">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-5">
                  Delivery fee: LKR 500
                </p>

                {errorMessage && (
                  <div className="mt-5 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#d6bd91] text-black py-4 mt-7 tracking-[2px] text-sm font-medium hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      PLACING ORDER...
                    </>
                  ) : (
                    "PLACE ORDER"
                  )}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Thank you for shopping with FASHORA.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
