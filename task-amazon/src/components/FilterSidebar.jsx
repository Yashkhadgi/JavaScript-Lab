import { CATEGORIES } from "../data/products";

const BRANDS = ["boAt", "Boult", "Noise", "Zebronics", "SanDisk", "Samsung", "Puma", "JBL"];
const PRICE_BUCKETS = ["Under ₹500", "₹500 - ₹2,000", "₹2,000 - ₹10,000", "Over ₹10,000"];
const DISCOUNTS = ["10% Off or more", "25% Off or more", "50% Off or more"];

export default function FilterSidebar({ filters, onChange }) {
  const toggleInArray = (key, value) => {
    const current = filters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <aside className="w-full sm:w-56 shrink-0 text-sm pr-4">
      <div className="mb-5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.primeOnly}
            onChange={(e) => onChange({ ...filters, primeOnly: e.target.checked })}
          />
          <span className="text-link font-bold">✓prime</span> eligible
        </label>
      </div>

      <div className="mb-5">
        <h3 className="font-bold mb-2">Category</h3>
        <ul className="space-y-1.5">
          {CATEGORIES.map((c) => (
            <li key={c}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(filters.categories || []).includes(c)}
                  onChange={() => toggleInArray("categories", c)}
                />
                {c}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-5">
        <h3 className="font-bold mb-2">Brands</h3>
        <ul className="space-y-1.5">
          {BRANDS.map((b) => (
            <li key={b}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(filters.brands || []).includes(b)}
                  onChange={() => toggleInArray("brands", b)}
                />
                {b}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-5">
        <h3 className="font-bold mb-2">Customer Reviews</h3>
        {[4, 3, 2].map((star) => (
          <label key={star} className="flex items-center gap-2 cursor-pointer mb-1">
            <input
              type="radio"
              name="minRating"
              checked={filters.minRating === star}
              onChange={() => onChange({ ...filters, minRating: star })}
            />
            {"★".repeat(star)}
            {"☆".repeat(5 - star)} &amp; Up
          </label>
        ))}
      </div>

      <div className="mb-5">
        <h3 className="font-bold mb-2">Price</h3>
        <ul className="space-y-1.5">
          {PRICE_BUCKETS.map((p) => (
            <li key={p}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceBucket"
                  checked={filters.priceBucket === p}
                  onChange={() => onChange({ ...filters, priceBucket: p })}
                />
                {p}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-5">
        <h3 className="font-bold mb-2">Discount</h3>
        <ul className="space-y-1.5">
          {DISCOUNTS.map((d) => (
            <li key={d}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(filters.discounts || []).includes(d)}
                  onChange={() => toggleInArray("discounts", d)}
                />
                {d}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onChange({})}
        className="text-link text-xs hover:underline"
      >
        Clear all filters
      </button>
    </aside>
  );
}
