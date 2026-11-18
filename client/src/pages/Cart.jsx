
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useCart();

  const formatPrice = (price) =>
    `LKR ${price.toLocaleString("en-LK")}`;

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 md:px-10 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="mb-12">
          <p className="text-[#d6bd91] text-xs tracking-[0.3em] uppercase mb-4">
            Your Shopping Bag
          </p>

          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl">
            Shopping Cart
          </h1>

          <p className="text-gray-500 text-sm mt-4">
            {cartItems.reduce((total, item) => total + item.quantity, 0)} item(s) in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="border border-white/10 py-20 px-6 text-center">
            <ShoppingBag
              size={45}
              className="mx-auto text-[#d6bd91] mb-6"
            />

            <h2 className="font-['Cormorant_Garamond'] text-3xl">
              Your cart is empty
            </h2>

            <p className="text-gray-500 text-sm mt-3">
              Discover something beautiful from our collection.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-3 mt-8 bg-[#d6bd91] text-black px-8 py-4 text-xs uppercase tracking-widest hover:bg-white transition"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Cart Products */}
            <div className="lg:col-span-2">

              <div className="flex justify-between items-center border-b border-white/10 pb-5 mb-6">
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Your Products
                </p>

                <button
                  onClick={clearCart}
                  className="text-xs text-gray-500 hover:text-red-400 transition"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-8">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="flex gap-5 border-b border-white/10 pb-8"
                  >

                    {/* Product Image */}
                    <div className="w-28 h-36 md:w-36 md:h-44 shrink-0 bg-[#171717]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">

                      <div>
                        <p className="text-[#d6bd91] text-[10px] uppercase tracking-widest">
                          {item.category}
                        </p>

                        <h3 className="font-['Cormorant_Garamond'] text-xl md:text-2xl mt-2">
                          {item.name}
                        </h3>

                        {item.selectedSize && (
                          <p className="text-gray-500 text-xs mt-2">
                            Size: {item.selectedSize}
                          </p>
                        )}

                        {/* Product Price */}
                        <div className="mt-3">
                          <p className="text-[#d6bd91] text-sm font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>

                          {item.quantity > 1 && (
                            <p className="text-gray-500 text-xs mt-1">
                              {formatPrice(item.price)} × {item.quantity}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-5">

                        {/* Quantity */}
                        <div className="flex items-center border border-white/20">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.selectedSize,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="p-2 hover:text-[#d6bd91] disabled:opacity-30"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="px-3 text-sm">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.selectedSize,
                                item.quantity + 1
                              )
                            }
                            className="p-2 hover:text-[#d6bd91]"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() =>
                            removeFromCart(item.id, item.selectedSize)
                          }
                          className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-xs transition"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-[#d6bd91] text-xs uppercase tracking-widest mt-8"
              >
                <ArrowLeft size={15} />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#141414] border border-white/10 p-7 sticky top-10">

                <h2 className="font-['Cormorant_Garamond'] text-3xl mb-8">
                  Order Summary
                </h2>

                {/* Subtotal */}
                <div className="flex justify-between text-sm text-gray-400 mb-5">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-sm text-gray-400 mb-6">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                {/* Total */}
                <div className="border-t border-white/10 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm uppercase tracking-widest">
                      Total
                    </span>

                    <span className="text-[#d6bd91] text-xl">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                {/* Checkout */}
                <Link  to="/checkout"
                     className="block w-full mt-8 bg-[#d6bd91] text-black py-5 text-center text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition"
>
                    PROCEED TO CHECKOUT
                </Link>

                <p className="text-gray-600 text-[11px] text-center mt-5">
                  Shipping charges will be calculated at checkout.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
