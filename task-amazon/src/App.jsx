import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ProductDetailDrawer from "./components/ProductDetailDrawer";
import Toast from "./components/Toast";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-pagebg">
      <Header />
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
      <Footer />
      <ProductDetailDrawer />
      <Toast />
    </div>
  );
}
