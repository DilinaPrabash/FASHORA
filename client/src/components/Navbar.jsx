
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full bg-[#0b0b0b] border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">

        <button className="md:hidden text-white">
          <Menu size={23} />
        </button>

        <Link
          to="/"
          className="text-3xl font-semibold tracking-[0.18em] text-[#d6bd91]"
        >
          FASHORA
        </Link>

        <div className="hidden md:flex items-center gap-9 text-sm text-gray-300">
          <Link to="/" className="hover:text-[#d6bd91] transition">
            Home
          </Link>

          <Link to="/products?category=Women" className="hover:text-[#d6bd91] transition">
            Women
          </Link>

          <Link to="/products?category=Men" className="hover:text-[#d6bd91] transition">
            Men
          </Link>

          <Link to="/products?category=Accessories" className="hover:text-[#d6bd91] transition">
            Accessories
          </Link>


          <Link to="/products" className="hover:text-[#d6bd91] transition">
            Shop
          </Link>

          <Link to="/collections" className="hover:text-[#d6bd91] transition">
             Collections
          </Link>

        </div>

        <div className="flex items-center gap-5 text-white">
          <button className="hover:text-[#d6bd91]" aria-label="Search">
            <Search size={20} />
          </button>

          <button className="hover:text-[#d6bd91]" aria-label="Account">
            <User size={20} />
          </button>

          <button className="hover:text-[#d6bd91] relative" aria-label="Shopping cart">
            <ShoppingBag size={20} />
            <span className="absolute -top-2 -right-2 bg-[#d6bd91] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>

      </nav>
    </header>
  );
}
