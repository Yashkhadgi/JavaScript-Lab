import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Truck, ShieldCheck, ChevronRight } from "lucide-react";
import { useStore } from "../store/useStore";
import { getProductById } from "../data/products";
import StarRating from "./StarRating";

const discountPct = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

export default function ProductDetailDrawer() {
  const navigate = useNavigate();
  const selectedProductId = useStore((s) => s.selectedProductId);
  const closeProductDetail = useStore((s) => s.closeProductDetail);
  const addToCart = useStore((s) => s.addToCart);

  const product = selectedProductId ? getProductById(selectedProductId) : null;
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(null);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setColor(product.colors?.[0] || null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeProductDetail();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeProductDetail]);

  if (!product) return null;

  const handleBuyNow = () => {
    addToCart(product.id, quantity, color);
    closeProductDetail();
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeProductDetail}
      />

      {/* Panel */}
      <div className="relative bg-white w-full sm:w-[560px] md:w-[640px] h-full overflow-y-auto shadow-2xl animate-[slidein_.2s_ease-out]">
        <button
          onClick={closeProductDetail}
          className="absolute top-3 right-3 z-10 bg-white rounded-full p-1.5 shadow hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="p-5 sm:p-6">
          {/* Breadcrumb */}
          <p className="text-xs text-link mb-3">
            {product.category} <ChevronRight size={10} className="inline" /> {product.brand}
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            {/* Thumbnails + main image */}
            <div className="flex sm:flex-col gap-2 order-2 sm:order-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <button
                  key={i}
                  className="w-12 h-12 border rounded hover:border-accent-orange overflow-hidden shrink-0"
                >
                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 order-1 sm:order-2 bg-gray-50 rounded flex items-center justify-center p-4">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-72 object-contain"
              />
            </div>
          </div>

          {/* Title & rating */}
          <div className="mt-5">
            <h1 className="text-xl font-medium leading-snug">{product.title}</h1>
            <p className="text-link text-sm mt-1">Visit the {product.brand} Store</p>

            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={product.rating} reviews={product.reviews} />
              {product.amazonsChoice && (
                <span className="bg-navy text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                  Amazon's Choice
                </span>
              )}
              {product.bestSeller && (
                <span className="bg-deal text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                  Best Seller
                </span>
              )}
            </div>
            {product.boughtLastMonth && (
              <p className="text-sm text-gray-600 mt-1">
                {product.boughtLastMonth} bought in past month
              </p>
            )}

            <hr className="my-3" />

            {/* Price */}
            <div>
              {product.mrp > product.price && (
                <p className="text-savings text-sm font-medium">
                  -{discountPct(product.price, product.mrp)}%
                </p>
              )}
              <p>
                <span className="text-sm align-top">₹</span>
                <span className="text-3xl">{product.price.toLocaleString("en-IN")}</span>
              </p>
              {product.mrp > product.price && (
                <p className="text-sm text-gray-500">
                  M.R.P.: <span className="line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
                </p>
              )}
              <p className="text-xs text-gray-500">Inclusive of all taxes</p>
              <p className="text-sm mt-1">
                EMI starts at <span className="font-bold">₹{Math.round(product.price / 12)}</span>.{" "}
                <span className="text-link">No Cost EMI available</span>
              </p>
            </div>

            {/* Offers row */}
            <div className="flex gap-3 overflow-x-auto mt-4 pb-1 scrollbar-none">
              {[
                { label: "Bank Offer", desc: "Upto ₹1,000 off on select cards" },
                { label: "No Cost EMI", desc: "Upto ₹350 interest savings" },
                { label: "Cashback", desc: "Upto ₹200 on ShopKart Pay" },
              ].map((offer) => (
                <div
                  key={offer.label}
                  className="min-w-[150px] border rounded p-2 text-xs shrink-0"
                >
                  <p className="font-bold mb-1">{offer.label}</p>
                  <p className="text-gray-600">{offer.desc}</p>
                  <p className="text-link mt-1">See offers &gt;</p>
                </div>
              ))}
            </div>

            {/* Color variants */}
            {product.colors && (
              <div className="mt-4">
                <p className="text-sm mb-1">
                  Color: <span className="font-bold">{color}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`text-xs border rounded px-3 py-1.5 ${
                        color === c ? "border-accent-orange ring-1 ring-accent-orange" : "border-gray-300"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery / stock */}
            <div className="flex items-start gap-2 mt-4 text-sm">
              <Truck size={18} className="shrink-0 mt-0.5" />
              <p>
                Delivering to <span className="font-bold">Nagpur 440008</span> —{" "}
                <span className="text-link">Update location</span>
              </p>
            </div>
            <p className="text-savings font-medium mt-1">In stock</p>

            {/* Quantity */}
            <div className="mt-4 flex items-center gap-3">
              <label className="text-sm">Qty:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2 mt-4 max-w-xs">
              <button
                onClick={() => addToCart(product.id, quantity, color)}
                className="bg-accent-cart hover:bg-yellow-400 border border-accent-cartBorder rounded-full py-2 text-sm font-medium"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-accent-buy hover:bg-orange-500 border border-accent-buyBorder rounded-full py-2 text-sm font-medium"
              >
                Buy Now
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 mt-4">
              <ShieldCheck size={16} /> Secure transaction
            </div>

            <hr className="my-4" />
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
              <p>Ships from <span className="font-bold text-black">ShopKart</span></p>
              <p>Sold by <span className="font-bold text-black">{product.brand} Retail</span></p>
              <p>Gift options <span className="text-link">Available at checkout</span></p>
              <p>Payment <span className="text-link">Secure transaction</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
