import { useCart } from "../context/CartContext"; // ✅ Import the cart context
import { useCurrency } from "../context/CurrencyContext"; // ✅ Import currency context
import { useState, useEffect } from "react";
import { productsService } from "../firebase";

export default function Home() {
  const { addToCart } = useCart(); // ✅ Use the addToCart function
  const { formatPrice } = useCurrency(); // ✅ Use currency formatting
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load featured products from Firebase on component mount
  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const products = await productsService.getProducts();
      // Show first 3 products as featured
      setFeaturedCars(products.slice(0, 3));
    } catch (error) {
      console.error('Error loading featured products:', error);
      // Fallback to empty array on error
      setFeaturedCars([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Tiny Cars. Big Dreams.</h1>
          <p className="text-xl mb-6">Fuel your passion for collecting with our top Hot Wheels!</p>
          <button className="bg-white text-orange-600 font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition">
            Shop Now
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">Featured Hot Wheels</h2>

          {loading ? (
            <div className="text-center text-gray-600">
              <p className="text-lg">Loading featured products...</p>
            </div>
          ) : featuredCars.length === 0 ? (
            <div className="text-center text-gray-600">
              <p className="text-lg">No featured products available yet.</p>
              <p className="text-sm mt-2">Visit our admin panel to add some awesome Hot Wheels!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <div key={car.id} className="bg-gray-100 rounded-xl shadow hover:shadow-lg overflow-hidden transition">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{car.name}</h3>
                    <p className="text-gray-600 mb-2">{formatPrice(car.price)}</p>
                    <button
                      onClick={() => addToCart(car)} // ✅ Add to cart functionality
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      ➕ Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-12 px-6 text-center">
        <h3 className="text-2xl font-semibold mb-3">Ready to race?</h3>
        <p className="mb-4">Join the Hot Wheels community and find your dream toy car today!</p>
        <button className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition">
          View All Products
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-sm py-6 text-center">
        © {new Date().getFullYear()} HotWheelsHub. All rights reserved.
      </footer>
    </div>
  );
}
