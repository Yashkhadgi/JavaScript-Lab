import { products } from "../data/products";
import CategorySection from "../components/CategorySection";
import { Truck, RotateCcw } from "lucide-react";

const byIds = (ids) => ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);

const HERO_CARDS = [
  {
    title: "Everything under ₹499",
    subtitle: "Fashion, home & more",
    tag: "Free Delivery | Quick Refunds",
    color: "bg-gradient-to-br from-orange-400 to-orange-500",
    ids: [8, 13, 30, 24],
  },
  {
    title: "Starting ₹99",
    subtitle: "Interesting kitchen finds for you",
    tag: "Wide selection | Latest trends",
    color: "bg-gradient-to-br from-amber-100 to-amber-200",
    ids: [15, 16, 30],
    dark: true,
  },
  {
    title: "Up to 70% off",
    subtitle: "Storage devices & SSDs",
    tag: "Terms apply.",
    color: "bg-navy",
    ids: [5, 6, 7],
  },
  {
    title: "Under ₹999",
    subtitle: "Headphones & earbuds",
    tag: "Top brands | Latest trends",
    color: "bg-gradient-to-br from-sky-100 to-sky-200",
    ids: [1, 2, 3],
    dark: true,
  },
];

const SECTIONS = [
  { title: "Most-loved fashion for you", ids: [8, 9, 10, 11], link: "/products?category=Fashion" },
  { title: "Up to 75% off | Most loved earbuds & neckbands", ids: [1, 2, 3, 4], link: "/products?category=Electronics" },
  { title: "Up to 80% off on Home improvements", ids: [28, 17, 14, 29], link: "/products?category=Home" },
  { title: "Daily needs | Starting ₹99", ids: [18, 19, 31, 20], link: "/products?category=Grocery" },
  { title: "Up to 70% off | Storage devices & SSDs", ids: [5, 6, 7, 26], link: "/products?category=Electronics" },
  { title: "Starting ₹149 | Bestselling headphones", ids: [1, 25, 4, 2], link: "/products?category=Electronics" },
  { title: "Up to 60% off | Bestselling stationery", ids: [24, 33], link: "/products?category=Stationery" },
  { title: "Starting ₹99 | Handpicked sports & fitness", ids: [22, 23, 32], link: "/products?category=Sports" },
  { title: "Starting ₹99 | Kitchen deals & Amazon Brands", ids: [15, 16, 30], link: "/products?category=Kitchen" },
  { title: "Lowest prices + Extra cashback", ids: [12, 27, 9, 10], link: "/products?category=Fashion" },
];

export default function HomePage() {
  return (
    <div className="max-w-[1500px] mx-auto px-2 sm:px-3 py-3">
      {/* Hero strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        {HERO_CARDS.map((card) => (
          <div key={card.title} className={`rounded p-4 ${card.color} ${card.dark ? "text-navy" : "text-white"} shadow-card`}>
            <h2 className="text-2xl font-extrabold leading-tight">{card.title}</h2>
            <p className="text-sm mt-1 mb-3">{card.subtitle}</p>
            <div className="grid grid-cols-3 gap-1 mb-3">
              {byIds(card.ids).slice(0, 3).map((p) => (
                <div key={p.id} className="aspect-square bg-white/90 rounded overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-xs opacity-90">{card.tag}</p>
          </div>
        ))}
      </div>

      {/* Trust strip */}
      <div className="flex flex-wrap gap-6 bg-white rounded p-3 mb-3 shadow-card text-sm">
        <span className="flex items-center gap-2"><Truck size={18} /> Free delivery on eligible orders</span>
        <span className="flex items-center gap-2"><RotateCcw size={18} /> Easy 10-day returns</span>
      </div>

      {/* Category sections grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SECTIONS.map((s) => (
          <CategorySection
            key={s.title}
            title={s.title}
            products={byIds(s.ids)}
            seeMoreLink={s.link}
          />
        ))}
      </div>
    </div>
  );
}
