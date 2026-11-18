
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

const products = [
  {
    id: 1,
    name: "Elegant Summer Dress",
    category: "Women",
    price: 8500,
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900",
    description:
      "An elegant summer dress designed for effortless style and comfort.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Classic Men's Outfit",
    category: "Men",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900",
    description:
      "A timeless outfit combining modern style with everyday comfort.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "Luxury Handbag",
    category: "Accessories",
    price: 6500,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900",
    description:
      "A sophisticated accessory to complete your personal style.",
    sizes: [],
  },
  {
    id: 4,
    name: "Premium Casual Shoes",
    category: "Shoes",
    price: 9500,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
    description:
      "Premium casual footwear designed for everyday comfort.",
    sizes: ["40", "41", "42", "43"],
  },
];

export default function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const product = products.find((item) => item.id === Number(id));

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-['Cormorant_Garamond']">
          Product Not Found
        </h1>

        <Link to="/products" className="text-[#d6bd91] mt-5">
          Back to Shop
        </Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size.");
      return;
    }

    addToCart({
      ...product,
      selectedSize,
      quantity,
    });

    alert(`${product.name} added to cart!`);
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 md:px-10 py-16">
      <div className="max-w-7xl mx-auto">

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
              LKR {product.price.toLocaleString("en-LK")}
            </p>

            <div className="border-t border-white/10 my-8" />

            <p className="text-gray-400 leading-7 text-sm">
              {product.description}
            </p>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mt-10">
                <p className="text-xs uppercase tracking-widest mb-5">
                  Select Size
                </p>

                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border text-sm transition ${
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
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  className="p-3 hover:text-[#d6bd91]"
                >
                  <Minus size={16} />
                </button>

                <span className="px-5 text-sm">{quantity}</span>

                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 hover:text-[#d6bd91]"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-10 w-full bg-[#d6bd91] text-black py-5 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] hover:bg-white transition"
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}
