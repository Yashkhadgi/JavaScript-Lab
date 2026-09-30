import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function CategorySection({ title, products, seeMoreLink }) {
  return (
    <div className="bg-white rounded p-4 shadow-card h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <h2 className="font-bold text-lg leading-tight pr-2">{title}</h2>
        {seeMoreLink && (
          <Link to={seeMoreLink} className="text-navy shrink-0">
            <ChevronRight size={20} />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 flex-1">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} compact />
        ))}
      </div>
      {seeMoreLink && (
        <Link
          to={seeMoreLink}
          className="text-link text-sm mt-3 hover:underline hover:text-deal"
        >
          See more
        </Link>
      )}
    </div>
  );
}
