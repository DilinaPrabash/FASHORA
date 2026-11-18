
import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ShoppingBag } from "lucide-react";

// Sample product data
const products = [
  {
    id: 1,
    name: "Elegant Summer Dress",
    category: "Women",
    price: 8500,
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=700",
  },
  {
    id: 2,
    name: "Classic Men's Outfit",
    category: "Men",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=700",
  },
  {
    id: 3,
    name: "Luxury Handbag",
    category: "Accessories",
    price: 6500,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
  },
  {
    id: 4,
    name: "Premium Casual Shoes",
    category: "Shoes",
    price: 9500,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
  },
  {
    id: 5,
    name: "Women's Fashion Outfit",
    category: "Women",
    price: 10500,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700",
  },
  {
    id: 6,
    name: "Men's Casual Style",
    category: "Men",
    price: 7800,
    image:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=700",
  },
  {
    id: 7,
    name: "Elegant Accessories",
    category: "Accessories",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700",
  },
  {
    id: 8,
    name: "Sport Sneakers",
    category: "Shoes",
    price: 11500,
    image:
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=700",
  },
];

const categories = ["All", "Women", "Men", "Shoes", "Accessories"];

export default function Products() {
  // Read category from URL
  const [searchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category");

  const initialCategory = categories.includes(categoryFromUrl)
    ? categoryFromUrl
    : "All";

  // States
  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  // Update category when URL changes
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, search, sort]);

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 md:px-10 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Page Heading */}
        <div className="text-center mb-14">
          <p className="text-[#d6bd91] text-xs tracking-[0.3em] uppercase mb-4">
            Explore Our Collection
          </p>

          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl">
            {selectedCategory === "All"
              ? "All Products"
              : selectedCategory}
          </h1>

          <p className="text-gray-400 text-sm mt-4">
            Discover pieces that define your personal style.
          </p>
        </div>

        {/* Search and Sorting */}
        <div className="flex flex-col md:flex-row gap-5 justify-between mb-10">

          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#151515] border border-white/10 pl-12 pr-4 py-3 text-sm outline-none focus:border-[#d6bd91]"
            />
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal
              size={18}
              className="text-[#d6bd91]"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[#151515] border border-white/10 px-4 py-3 text-sm outline-none"
            >
              <option value="default">Default Sorting</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 text-xs uppercase tracking-widest border transition ${
                selectedCategory === category
                  ? "bg-[#d6bd91] text-black border-[#d6bd91]"
                  : "border-white/15 text-gray-300 hover:border-[#d6bd91] hover:text-[#d6bd91]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Count */}
        <p className="text-gray-400 text-xs mb-6">
          Showing {filteredProducts.length} products
        </p>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">

            {filteredProducts.map((product) => (
              <div key={product.id} className="group">

                {/* Product Image */}
                <div className="relative h-[360px] overflow-hidden bg-[#171717]">

                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </Link>

                  {/* Add to Cart */}
                  <button
                    type="button"
                    className="absolute bottom-0 left-0 right-0 bg-[#d6bd91] text-black py-4 flex items-center justify-center gap-2 text-xs uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition duration-300"
                  >
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>
                </div>

                {/* Product Details */}
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
        ) : (
          /* Empty State */
          <div className="text-center py-24">
            <h3 className="font-['Cormorant_Garamond'] text-3xl">
              No Products Found
            </h3>

            <p className="text-gray-400 text-sm mt-3">
              Try another search or category.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
