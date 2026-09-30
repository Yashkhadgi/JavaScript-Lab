import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";

const parsePriceBucket = (bucket) => {
  switch (bucket) {
    case "Under ₹500":
      return [0, 500];
    case "₹500 - ₹2,000":
      return [500, 2000];
    case "₹2,000 - ₹10,000":
      return [2000, 10000];
    case "Over ₹10,000":
      return [10000, Infinity];
    default:
      return null;
  }
};

export default function ProductListingPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("relevance");

  const results = useMemo(() => {
    let list = [...products];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (categoryParam) {
      list = list.filter((p) => p.category.toLowerCase() === categoryParam.toLowerCase());
    }

    if (filters.categories?.length) {
      list = list.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.brands?.length) {
      list = list.filter((p) => filters.brands.includes(p.brand));
    }
    if (filters.minRating) {
      list = list.filter((p) => p.rating >= filters.minRating);
    }
    if (filters.priceBucket) {
      const range = parsePriceBucket(filters.priceBucket);
      if (range) list = list.filter((p) => p.price >= range[0] && p.price < range[1]);
    }
    if (filters.discounts?.length) {
      const minDiscount = Math.min(
        ...filters.discounts.map((d) => parseInt(d, 10))
      );
      list = list.filter((p) => Math.round(((p.mrp - p.price) / p.mrp) * 100) >= minDiscount);
    }

    if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [query, categoryParam, filters, sortBy]);

  const heading = query
    ? `Results for "${query}"`
    : categoryParam
    ? categoryParam
    : "All Products";

  return (
    <div className="max-w-[1500px] mx-auto px-3 py-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <FilterSidebar filters={filters} onChange={setFilters} />

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white rounded p-3 mb-3 shadow-card">
            <p className="text-sm">
              {results.length} results for <span className="font-bold">{heading}</span>
            </p>
            <label className="text-sm flex items-center gap-2">
              Sort by:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Avg. Customer Rating</option>
              </select>
            </label>
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded p-8 text-center shadow-card">
              <p className="text-lg font-bold mb-1">No results found</p>
              <p className="text-sm text-gray-600">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
