import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { useStore } from "../store/useStore";

const genOrderId = () => {
  const rand = () => Math.floor(Math.random() * 9000000) + 1000000;
  return `402-${rand()}-${rand()}`;
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const lines = useStore((s) => s.getCartLines());
  const subtotal = useStore((s) => s.getCartSubtotal());
  const count = useStore((s) => s.getCartCount());
  const clearCart = useStore((s) => s.clearCart);

  const [address, setAddress] = useState({
    name: "",
    line1: "",
    city: "Nagpur",
    pincode: "440008",
    phone: "",
  });
  const [payment, setPayment] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(null);

  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const orderId = genOrderId();
    setOrderPlaced(orderId);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="max-w-[600px] mx-auto px-3 py-16 text-center">
        <CheckCircle2 size={56} className="mx-auto text-savings mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order placed, thank you! 🎉</h1>
        <p className="text-gray-600 mb-1">
          Your order <span className="font-bold">#{orderPlaced}</span> has been confirmed.
        </p>
        <p className="text-gray-600 mb-6">A confirmation would normally be emailed to you.</p>
        <Link
          to="/"
          className="inline-block bg-accent-cart hover:bg-yellow-400 border border-accent-cartBorder rounded-full px-6 py-2 text-sm font-medium"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="max-w-[600px] mx-auto px-3 py-16 text-center">
        <h1 className="text-xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add items to your cart before checking out.</p>
        <Link
          to="/products"
          className="inline-block bg-accent-cart hover:bg-yellow-400 border border-accent-cartBorder rounded-full px-6 py-2 text-sm font-medium"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-3 py-4">
      <div className="flex items-baseline gap-2 mb-4">
        <div className="flex items-baseline">
          <span className="text-lg font-bold text-navy">Shop</span>
          <span className="text-lg font-bold text-accent-orange">Kart</span>
        </div>
        <span className="text-gray-400">|</span>
        <h1 className="text-lg">Checkout</h1>
        <span className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
          <ShieldCheck size={14} /> Secure checkout
        </span>
      </div>

      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-4">
          {/* Address */}
          <div className="bg-white rounded shadow-card p-4">
            <h2 className="font-bold mb-3">1. Delivery Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                required
                placeholder="Full name"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                className="border rounded px-3 py-2 text-sm sm:col-span-2"
              />
              <input
                required
                placeholder="Address line (House no., Street, Area)"
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                className="border rounded px-3 py-2 text-sm sm:col-span-2"
              />
              <input
                required
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="border rounded px-3 py-2 text-sm"
              />
              <input
                required
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                className="border rounded px-3 py-2 text-sm"
              />
              <input
                required
                placeholder="Phone number"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="border rounded px-3 py-2 text-sm sm:col-span-2"
              />
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded shadow-card p-4">
            <h2 className="font-bold mb-3">2. Payment Method</h2>
            <div className="flex flex-col gap-2 text-sm">
              {[
                { id: "upi", label: "UPI (PhonePe / GPay / Paytm)" },
                { id: "card", label: "Credit or Debit Card" },
                { id: "netbanking", label: "Net Banking" },
                { id: "cod", label: "Cash on Delivery" },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer border rounded px-3 py-2 hover:border-accent-orange">
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === opt.id}
                    onChange={() => setPayment(opt.id)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded shadow-card p-4">
            <h2 className="font-bold mb-3">3. Review Items</h2>
            <div className="divide-y">
              {lines.map((line) => (
                <div key={`${line.productId}-${line.variant}`} className="flex gap-3 py-3">
                  <div className="w-16 h-16 shrink-0 bg-gray-50 rounded overflow-hidden">
                    <img src={line.product.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm line-clamp-2">{line.product.title}</p>
                    <p className="text-xs text-gray-500">Qty: {line.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">
                    ₹{(line.product.price * line.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded shadow-card p-4 sticky top-20">
            <h2 className="font-bold mb-3">Order Summary</h2>
            <div className="text-sm space-y-1.5">
              <div className="flex justify-between">
                <span>Items ({count}):</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-base font-bold text-deal">
                <span>Order Total:</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-4 bg-accent-buy hover:bg-orange-500 border border-accent-buyBorder rounded-full py-2 text-sm font-medium"
            >
              Place your order
            </button>
            <p className="text-xs text-gray-500 mt-2">
              By placing your order, you agree to ShopKart's demo terms (this is a mock checkout).
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
