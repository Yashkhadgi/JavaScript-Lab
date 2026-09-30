import StarRating from "./StarRating";
import { useStore } from "../store/useStore";

const discountPct = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

export default function ProductCard({ product, compact = false }) {
  const openProductDetail = useStore((s) => s.openProductDetail);
  const addToCart = useStore((s) => s.addToCart);

  if (compact) {
    // Small tile used inside homepage CategorySection grids
    return (
      <button
        onClick={() => openProductDetail(product.id)}
        className="text-left group"
      >
        <div className="aspect-square bg-white overflow-hidden rounded">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
          />
        </div>
        <p className="text-xs mt-1 line-clamp-2 text-navy">{product.title}</p>
      </button>
    );
  }

  return (
    <div className="bg-white rounded shadow-card p-3 flex flex-col h-full">
      <button
        onClick={() => openProductDetail(product.id)}
        className="flex-1 flex flex-col text-left"
      >
        {product.bestSeller && (
          <span className="self-start bg-deal text-white text-[10px] font-bold px-1.5 py-0.5 mb-1 rounded-sm uppercase">
            Best Seller
          </span>
        )}
        <div className="aspect-square mb-2 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <p className="text-sm line-clamp-2 mb-1">{product.title}</p>
        <StarRating rating={product.rating} reviews={product.reviews} />
        {product.boughtLastMonth && (
          <p className="text-xs text-gray-600 mt-0.5">
            {product.boughtLastMonth} bought in past month
          </p>
        )}
        <div className="mt-1">
          <span className="text-xs align-top">₹</span>
          <span className="text-xl font-medium">{product.price.toLocaleString("en-IN")}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-gray-500 ml-2">
              M.R.P: <span className="line-through">₹{product.mrp.toLocaleString("en-IN")}</span>{" "}
              <span className="text-savings">({discountPct(product.price, product.mrp)}% off)</span>
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600 mt-1">
          FREE delivery <span className="font-bold">tomorrow</span>
        </p>
      </button>
      <button
        onClick={() => addToCart(product.id, 1)}
        className="mt-2 bg-accent-cart hover:bg-yellow-400 border border-accent-cartBorder rounded-full text-xs font-medium py-1.5"
      >
        Add to Cart
      </button>
    </div>
  );
}
