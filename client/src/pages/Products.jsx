
import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const categories = ["All", "Women", "Men", "Shoes", "Accessories"];

export default function Products() {
  const [searchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category");

  const initialCategory = categories.includes(categoryFromUrl)
    ? categoryFromUrl
    : "All";

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from MongoDB through backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to load products.");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
  }, [products, selectedCategory, search, sort]);

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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-24">
            <p className="text-[#d6bd91] text-sm tracking-widest uppercase">
              Loading Collection...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-24">
            <h3 className="font-['Cormorant_Garamond'] text-3xl">
              Unable to Load Products
            </h3>

            <p className="text-red-400 text-sm mt-3">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 border border-[#d6bd91] text-[#d6bd91] px-6 py-3 text-xs uppercase tracking-widest"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products */}
        {!loading && !error && (
          <>
            <p className="text-gray-400 text-xs mb-6">
              Showing {filteredProducts.length} products
            </p>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="group">

                    {/* Product Image */}
                    <div className="relative h-[360px] overflow-hidden bg-[#171717]">
                      <Link to={`/products/${product._id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      </Link>

                      {/* View Product */}
                      <Link
                        to={`/products/${product._id}`}
                        className="absolute bottom-0 left-0 right-0 bg-[#d6bd91] text-black py-4 flex items-center justify-center gap-2 text-xs uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition duration-300"
                      >
                        <ShoppingBag size={16} />
                        View Product
                      </Link>
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

                      <p className="text-gray-500 text-xs mt-2">
                        {product.stock > 0
                          ? `${product.stock} items available`
                          : "Out of Stock"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <h3 className="font-['Cormorant_Garamond'] text-3xl">
                  No Products Found
                </h3>

                <p className="text-gray-400 text-sm mt-3">
                  Try another search or category.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
