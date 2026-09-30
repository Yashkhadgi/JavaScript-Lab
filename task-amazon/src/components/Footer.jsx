import { ArrowUp } from "lucide-react";

const COLUMNS = [
  {
    title: "Get to Know Us",
    links: ["About ShopKart", "Careers", "Press Releases", "ShopKart Science"],
  },
  {
    title: "Connect with Us",
    links: ["Facebook", "Twitter", "Instagram"],
  },
  {
    title: "Make Money with Us",
    links: ["Sell on ShopKart", "Become an Affiliate", "Advertise Your Products", "Self-Publish"],
  },
  {
    title: "Let Us Help You",
    links: ["Your Account", "Returns Centre", "100% Purchase Protection", "Help"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy-light text-white mt-8">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full bg-[#37475a] hover:bg-[#485769] py-3 text-sm flex items-center justify-center gap-2"
      >
        <ArrowUp size={16} /> Back to top
      </button>

      <div className="max-w-[1000px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 px-6 py-10">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="font-bold text-sm mb-3">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l} className="text-xs text-gray-300 hover:text-white hover:underline cursor-pointer">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-600 py-6 flex flex-col items-center gap-2">
        <div className="flex items-baseline">
          <span className="text-lg font-bold">Shop</span>
          <span className="text-lg font-bold text-accent-orange">Kart</span>
        </div>
        <p className="text-xs text-gray-400">🇮🇳 India</p>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} ShopKart Clone — Demo project, not affiliated with Amazon.
        </p>
      </div>
    </footer>
  );
}
