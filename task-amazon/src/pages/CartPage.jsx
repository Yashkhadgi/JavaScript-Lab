import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { useStore } from "../store/useStore";
import { products } from "../data/products";

export default function CartPage() {
  const navigate = useNavigate();
  const lines = useStore((s) => s.getCartLines());
  const subtotal = useStore((s) => s.getCartSubtotal());
  const count = useStore((s) => s.getCartCount());
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const openProductDetail = useStore((s) => s.openProductDetail);
  const { remaining, pct } = useStore((s) => s.getFreeDeliveryProgress());

  const related = products.slice(0, 8);

  if (lines.length === 0) {
    return (
      <div className="max-w-[1000px] mx-auto px-3 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Your ShopKart Cart is empty</h1>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything yet.</p>
        <Link
          to="/products"
          className="inline-block bg-accent-cart hover:bg-yellow-400 border border-accent-cartBorder rounded-full px-6 py-2 text-sm font-medium"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1300px] mx-auto px-3 py-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Cart items */}
        <div className="flex-1 bg-white rounded shadow-card p-4">
          {remaining > 0 ? (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                <div
                  className="bg-savings h-1.5 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-sm">
                Add <span className="font-bold">₹{remaining}</span> more to your order to qualify for{" "}
                <span className="text-savings font-medium">FREE Delivery</span>.
              </p>
            </div>
          ) : (
            <p className="text-savings text-sm font-medium mb-4">
              ✓ Your order is eligible for FREE Delivery.
            </p>
          )}

          <div className="flex items-baseline justify-between border-b pb-2 mb-2">
            <h1 className="text-xl">Shopping Cart</h1>
            <span className="text-sm text-gray-500">Price</span>
          </div>

          <div className="divide-y">
            {lines.map((line) => (
              <div key={`${line.productId}-${line.variant}`} className="flex gap-4 py-4">
                <button
                  onClick={() => openProductDetail(line.productId)}
                  className="w-28 h-28 shrink-0 bg-gray-50 rounded overflow-hidden"
                >
                  <img
                    src={line.product.image}
                    alt={line.product.title}
                    className="w-full h-full object-cover"
                  />
                </button>
                <div className="flex-1 flex flex-col">
                  <button
                    onClick={() => openProductDetail(line.productId)}
                    className="text-sm font-medium text-left line-clamp-2 hover:text-link"
                  >
                    {line.product.title}
                  </button>
                  {line.variant && (
                    <p className="text-xs text-gray-500 mt-0.5">Color: {line.variant}</p>
                  )}
                  <p className="text-savings text-xs mt-1">In stock</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border rounded-full">
                      <button
                        onClick={() => updateQuantity(line.productId, line.variant, line.quantity - 1)}
                        className="p-1.5 hover:bg-gray-100 rounded-full"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm">{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(line.productId, line.variant, line.quantity + 1)}
                        className="p-1.5 hover:bg-gray-100 rounded-full"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => removeFromCart(line.productId, line.variant)}
                      className="flex items-center gap-1 text-xs text-link hover:text-deal"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
                <div className="text-lg font-medium shrink-0">
                  ₹{(line.product.price * line.quantity).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>

          <div className="text-right text-lg pt-2 border-t">
            Subtotal ({count} item{count !== 1 ? "s" : ""}):{" "}
            <span className="font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded shadow-card p-4 sticky top-20">
            {remaining <= 0 && (
              <p className="text-savings text-sm mb-2">
                ✓ Your order is eligible for FREE Delivery.
              </p>
            )}
            <p className="text-lg mb-3">
              Subtotal ({count} item{count !== 1 ? "s" : ""}):{" "}
              <span className="font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-accent-cart hover:bg-yellow-400 border border-accent-cartBorder rounded-full py-2 text-sm font-medium"
            >
              Proceed to Buy
            </button>
          </div>
        </div>
      </div>

      {/* Related products carousel */}
      <div className="mt-6 bg-white rounded shadow-card p-4">
        <h2 className="font-bold mb-3">Products related to items in your cart</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
          {related.map((p) => (
            <div key={p.id} className="w-40 shrink-0">
              <ProductMini product={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductMini({ product }) {
  const openProductDetail = useStore((s) => s.openProductDetail);
  const addToCart = useStore((s) => s.addToCart);
  return (
    <div>
      <button onClick={() => openProductDetail(product.id)} className="block w-full">
        <div className="aspect-square bg-gray-50 rounded overflow-hidden mb-1">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        </div>
        <p className="text-xs line-clamp-2 text-left">{product.title}</p>
        <p className="text-sm font-medium text-left mt-1">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </button>
      <button
        onClick={() => addToCart(product.id, 1)}
        className="w-full mt-1 bg-accent-cart hover:bg-yellow-400 border border-accent-cartBorder rounded-full text-xs py-1"
      >
        Add to cart
      </button>
    </div>
  );
}
