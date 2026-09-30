import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

const LINKS = [
  { label: "Best Sellers", to: "/products" },
  { label: "Today's Deals", to: "/products" },
  { label: "Mobiles", to: "/products?category=Electronics" },
  { label: "Customer Service", to: "/products" },
  { label: "New Releases", to: "/products" },
  { label: "Electronics", to: "/products?category=Electronics" },
  { label: "Fashion", to: "/products?category=Fashion" },
  { label: "Home & Kitchen", to: "/products?category=Home" },
  { label: "Grocery", to: "/products?category=Grocery" },
];

export default function NavBar() {
  return (
    <nav className="bg-navy-light text-white text-sm">
      <div className="flex items-center gap-4 px-3 py-1.5 max-w-[1500px] mx-auto overflow-x-auto scrollbar-none">
        <button className="flex items-center gap-1 font-bold shrink-0 px-1 py-1 border border-transparent hover:border-white rounded">
          <Menu size={16} /> All
        </button>
        {LINKS.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="shrink-0 px-1 py-1 border border-transparent hover:border-white rounded whitespace-nowrap"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
