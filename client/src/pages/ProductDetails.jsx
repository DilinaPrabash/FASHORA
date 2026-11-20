
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ShoppingBag,
  ArrowLeft,
  Minus,
  Plus,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch product from MongoDB
  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);

        const response = await fetch(
          `${API_URL}/products/${id}`,
          { signal: controller.signal }
        );

        if (response.status === 404) {
          throw new Error("Product not found.");
        }

        if (!response.ok) {
          throw new Error("Failed to load product.");
        }

        const data = await response.json();

        setProduct(data);
        setSelectedSize("");
        setQuantity(1);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        <p className="text-[#d6bd91] text-sm tracking-widest uppercase">
          Loading Product...
        </p>
      </main>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] text-white flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-['Cormorant_Garamond']">
          {error === "Product not found."
            ? "Product Not Found"
            : "Unable to Load Product"}
        </h1>

        <p className="text-gray-400 text-sm mt-4 text-center">
          {error || "This product is unavailable."}
        </p>

        <Link
          to="/products"
          className="text-[#d6bd91] mt-6 hover:text-white"
        >
          Back to Shop
        </Link>
      </main>
    );
  }

  const sizes = Array.isArray(product.sizes)
    ? product.sizes
    : [];

  const stock = Math.max(0, Number(product.stock) || 0);

  const isInStock =
    product.isAvailable !== false && stock > 0;

  const price = Number(product.price) || 0;

  // Add product to cart
  const handleAddToCart = () => {
    if (!isInStock) {
      alert("Sorry, this product is out of stock.");
      return;
    }

    if (sizes.length > 0 && !selectedSize) {
      alert("Please select a size.");
      return;
    }

    if (quantity < 1 || quantity > stock) {
      alert("Requested quantity is not available.");
      return;
    }

    const result = addToCart({
      ...product,
      id: product._id,
      selectedSize,
      quantity,
    });

    if (result?.success) {
      alert(`${product.name} added to cart!`);
    } else {
      alert(
        result?.message || "Unable to add this product to cart."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 md:px-10 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Back to Shop */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#d6bd91] mb-10 text-sm"
        >
          <ArrowLeft size={17} />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

          {/* Product Image */}
          <div className="h-[450px] md:h-[650px] overflow-hidden bg-[#171717]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">

            <p className="text-[#d6bd91] text-xs tracking-[0.3em] uppercase mb-5">
              {product.category}
            </p>

            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl">
              {product.name}
            </h1>

            <p className="text-[#d6bd91] text-xl mt-6">
              LKR {price.toLocaleString("en-LK")}
            </p>

            <div className="border-t border-white/10 my-8" />

            {/* Description */}
            <p className="text-gray-400 leading-7 text-sm">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mt-6">
              {isInStock ? (
                <p className="text-green-500 text-sm">
                  In Stock - {stock} items available
                </p>
              ) : (
                <p className="text-red-400 text-sm">
                  Out of Stock
                </p>
              )}
            </div>

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mt-10">
                <p className="text-xs uppercase tracking-widest mb-5">
                  Select Size
                </p>

                <div className="flex gap-3 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      disabled={!isInStock}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border text-sm transition disabled:opacity-40 disabled:cursor-not-allowed ${
                        selectedSize === size
                          ? "bg-[#d6bd91] text-black border-[#d6bd91]"
                          : "border-white/20 hover:border-[#d6bd91]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-10">
              <p className="text-xs uppercase tracking-widest mb-5">
                Quantity
              </p>

              <div className="flex items-center border border-white/20 w-fit">
                <button
                  type="button"
                  disabled={!isInStock || quantity <= 1}
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  className="p-3 hover:text-[#d6bd91] disabled:opacity-40"
                >
                  <Minus size={16} />
                </button>

                <span className="px-5 text-sm">
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={!isInStock || quantity >= stock}
                  onClick={() =>
                    setQuantity((q) => Math.min(stock, q + 1))
                  }
                  className="p-3 hover:text-[#d6bd91] disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="mt-10 w-full bg-[#d6bd91] text-black py-5 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] hover:bg-white transition disabled:bg-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} />
              {isInStock ? "Add to Cart" : "Out of Stock"}
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}
