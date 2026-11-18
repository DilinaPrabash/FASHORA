
import Navbar from "./components/Navbar";
import CategorySection from "./components/CategorySection";
import FeaturedProducts from "./components/FeaturedProducts";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      <Navbar />
      <Home />
      <CategorySection />
      <FeaturedProducts />
    </>
  );
}
