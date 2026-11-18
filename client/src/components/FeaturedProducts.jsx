
import { ShoppingBag, Heart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Elegant Summer Dress",
    category: "Women's Clothing",
    price: 8500,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=700",
    label: "BESTSELLER",
  },
  {
    id: 2,
    name: "Classic Men's Outfit",
    category: "Men's Clothing",
    price: 12000,
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=700",
    label: "NEW ARRIVAL",
  },
  {
    id: 3,
    name: "Luxury Handbag",
    category: "Accessories",
    price: 6500,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
    label: "POPULAR",
  },
  {
    id: 4,
    name: "Premium Casual Shoes",
    category: "Footwear",
    price: 9500,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
    label: "TRENDING",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-[#0b0b0b] text-white px-6 md:px-10 py-24">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-[#d6bd91] uppercase tracking-[0.3em] text-xs mb-4">
              Carefully Selected
            </p>
            <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl">
              Featured Products
            </h2>
          </div>

          <button className="hidden md:block text-xs uppercase tracking-widest border-b border-[#d6bd91] pb-2 hover:text-[#d6bd91]">
            View All Products →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {products.map((product) => (
            <div key={product.id} className="group">

              <div className="relative h-[360px] overflow-hidden bg-[#171717]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />

                <span className="absolute top-4 left-4 bg-[#d6bd91] text-black text-[9px] tracking-widest px-3 py-2">
                  {product.label}
                </span>

                <button
                  aria-label="Add to wishlist"
                  className="absolute top-4 right-4 bg-black/60 p-3 rounded-full hover:text-[#d6bd91]"
                >
                  <Heart size={17} />
                </button>

                <button className="absolute bottom-0 left-0 right-0 bg-[#d6bd91] text-black py-4 flex items-center justify-center gap-2 text-xs uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition duration-300">
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
              </div>

              <div className="pt-5">
                <p className="text-gray-500 text-xs mb-2">
                  {product.category}
                </p>

                <h3 className="font-['Cormorant_Garamond'] text-2xl">
                  {product.name}
                </h3>

                <p className="text-[#d6bd91] mt-2 text-sm">
                  LKR {product.price.toLocaleString("en-LK")}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
