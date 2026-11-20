
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  LogOut,
  Package,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    navigate("/");
  };

  return (
    <header className="w-full bg-[#0b0b0b] border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">

        {/* Mobile Menu */}
        <button className="md:hidden text-white">
          <Menu size={23} />
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-semibold tracking-[0.18em] text-[#d6bd91]"
        >
          FASHORA
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-9 text-sm text-gray-300">
          <Link to="/" className="hover:text-[#d6bd91] transition">
            Home
          </Link>

          <Link
            to="/products?category=Women"
            className="hover:text-[#d6bd91] transition"
          >
            Women
          </Link>

          <Link
            to="/products?category=Men"
            className="hover:text-[#d6bd91] transition"
          >
            Men
          </Link>

          <Link
            to="/products?category=Accessories"
            className="hover:text-[#d6bd91] transition"
          >
            Accessories
          </Link>

          <Link to="/products" className="hover:text-[#d6bd91] transition">
            Shop
          </Link>

          <Link to="/collections" className="hover:text-[#d6bd91] transition">
            Collections
          </Link>
        </div>

        {/* Navbar Icons */}
        <div className="flex items-center gap-5 text-white">

          {/* Search */}
          <button className="hover:text-[#d6bd91]" aria-label="Search">
            <Search size={20} />
          </button>

          {/* Authentication */}
          {user ? (
            <div className="flex items-center gap-3">

              {/* Customer My Orders */}
              {user.role === "customer" && (
                <Link
                  to="/my-orders"
                  className="hidden sm:flex items-center gap-2 text-sm text-gray-300 hover:text-[#d6bd91] transition"
                >
                  <Package size={18} />
                  <span>My Orders</span>
                </Link>
              )}

              {/* Admin Dashboard */}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="hidden sm:inline text-[#d6bd91] hover:text-white text-sm transition"
                >
                  Admin Dashboard
                </Link>
              )}

              <div className="hidden sm:flex items-center gap-2 text-sm">
                <User size={18} className="text-[#d6bd91]" />
                <span className="text-gray-200">
                  {user.fullName?.split(" ")[0] || "Account"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#d6bd91] transition"
                title="Logout"
              >
                <LogOut size={19} />
                <span className="hidden sm:inline">Logout</span>
              </button>

            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <Link to="/login" className="hover:text-[#d6bd91] transition">
                Login
              </Link>

              <Link
                to="/register"
                className="hidden sm:inline text-[#d6bd91] hover:text-white transition"
              >
                Register
              </Link>
            </div>
          )}

          {/* Shopping Cart */}
          <Link
            to="/cart"
            className="hover:text-[#d6bd91] relative"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <ShoppingBag size={20} />

            <span className="absolute -top-2 -right-2 bg-[#d6bd91] text-black text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </Link>

        </div>
      </nav>
    </header>
  );
}
