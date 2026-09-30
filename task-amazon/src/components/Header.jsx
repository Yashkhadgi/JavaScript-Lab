import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ShoppingCart, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useStore } from "../store/useStore";

export default function Header() {
  const navigate = useNavigate();
  const cartCount = useStore((s) => s.getCartCount());
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(query);
    navigate(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="bg-navy text-white sticky top-0 z-40">
      <div className="flex items-center gap-2 px-2 py-2 max-w-[1500px] mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-baseline px-2 py-1 border border-transparent hover:border-white rounded shrink-0"
        >
          <span className="text-xl font-bold tracking-tight">Shop</span>
          <span className="text-xl font-bold text-accent-orange">Kart</span>
          <span className="text-[10px] text-gray-300 ml-1 self-end">.in</span>
        </Link>

        {/* Deliver to */}
        <button className="hidden md:flex flex-col items-start px-2 py-1 border border-transparent hover:border-white rounded text-xs leading-tight">
          <span className="flex items-center gap-1 text-gray-300">
            <MapPin size={14} />
            Deliver to Nagpur 440008
          </span>
          <span className="font-bold">Update location</span>
        </button>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex flex-1 min-w-0 rounded overflow-hidden h-10">
          <button
            type="button"
            className="hidden sm:flex items-center gap-1 bg-gray-100 text-black text-xs px-3 border-r border-gray-300"
          >
            All <ChevronDown size={12} />
          </button>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search ShopKart.in"
            className="flex-1 min-w-0 px-3 text-black text-sm outline-none"
          />
          <button
            type="submit"
            className="bg-accent-orange hover:bg-orange-500 px-4 flex items-center justify-center"
            aria-label="Search"
          >
            <Search size={18} className="text-navy" />
          </button>
        </form>

        {/* Language */}
        <button className="hidden lg:flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded text-xs">
          🇮🇳 EN <ChevronDown size={12} />
        </button>

        {/* Account (static, no auth) */}
        <button className="hidden md:flex flex-col items-start px-2 py-1 border border-transparent hover:border-white rounded text-xs leading-tight">
          <span className="text-gray-300">Hello, sign in</span>
          <span className="font-bold flex items-center gap-0.5">
            Account &amp; Lists <ChevronDown size={12} />
          </span>
        </button>

        {/* Orders */}
        <button className="hidden md:flex flex-col items-start px-2 py-1 border border-transparent hover:border-white rounded text-xs leading-tight">
          <span className="text-gray-300">Returns</span>
          <span className="font-bold">&amp; Orders</span>
        </button>

        {/* Cart */}
        <Link
          to="/cart"
          className="flex items-end gap-1 px-2 py-1 border border-transparent hover:border-white rounded relative"
        >
          <span className="relative">
            <ShoppingCart size={28} />
            <span className="absolute -top-1 left-4 bg-accent-orange text-navy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </span>
          <span className="font-bold text-sm hidden sm:inline">Cart</span>
        </Link>
      </div>
    </header>
  );
}
