
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import CategorySection from "./components/CategorySection";
import FeaturedProducts from "./components/FeaturedProducts";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Collections from "./pages/Collections";
import ProductDetails from "./pages/ProductDetails";

function HomePage() {
  return (
    <>
      <Home />
      <CategorySection />
      <FeaturedProducts />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/products/:id" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
