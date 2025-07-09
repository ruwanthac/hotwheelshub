import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext"; // ✅ Fixed import casing
import { useCurrency } from "../context/CurrencyContext"; // ✅ Import currency context
import { productsService } from "../firebase";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart(); // ✅ Access addToCart function
  const { formatPrice } = useCurrency(); // ✅ Use currency formatting

  // ✅ Load products from Firebase on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await productsService.getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-orange-100 to-red-100 py-12 px-6">
        <h1 className="text-5xl font-extrabold text-center text-red-600 mb-14 drop-shadow-lg">
          🏁 Shop Hot Wheels
        </h1>
        <div className="text-center text-gray-600">
          <p className="text-xl">Loading awesome Hot Wheels toys...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-orange-100 to-red-100 py-12 px-6">
        <h1 className="text-5xl font-extrabold text-center text-red-600 mb-14 drop-shadow-lg">
          🏁 Shop Hot Wheels
        </h1>
        <div className="text-center text-red-600">
          <p className="text-xl">{error}</p>
          <button 
            onClick={loadProducts}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-orange-100 to-red-100 py-12 px-6">
      <h1 className="text-5xl font-extrabold text-center text-red-600 mb-14 drop-shadow-lg">
        🏁 Shop Hot Wheels
      </h1>

      {products.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-xl">No products available yet.</p>
          <p className="text-lg mt-2">Check back soon or visit our admin panel to add products!</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border-4 border-orange-400 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-xl border-b-4 border-yellow-400"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                }}
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-blue-800 mb-1">{product.name}</h3>
                <p className="text-md text-orange-600 font-semibold mb-4">{formatPrice(product.price)}</p>
                <button
                  onClick={() => addToCart(product)} // ✅ Add to cart on click
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-4 py-2 rounded-lg w-full hover:from-green-600 hover:to-green-700 transition"
                >
                  ➕ Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
