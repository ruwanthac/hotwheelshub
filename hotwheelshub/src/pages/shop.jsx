import { useState } from "react";
import { useCart } from "../context/cartcontext"; // ✅ Add this line

export default function Shop() {
  const [products] = useState([
    {
      id: 1,
      name: "Hot Wheels Turbo Racer",
      price: "$9.99",
      image: "https://car-images.bauersecure.com/wp-images/4644/iwc_hotwheels_1.jpeg",
    },
    {
      id: 2,
      name: "Street Beast X",
      price: "$8.49",
      image: "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://media.easy-peasy.ai/5b7a60dd-211a-4672-982f-b0d49111025a/8dc85a76-f330-4a54-8b4d-8cbe32726b4f.png",
    },
    {
      id: 3,
      name: "Monster Jam Max-D",
      price: "$12.99",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhSVWxkRWQMUMHsKFkgy9ftCZcxl0FEihSvzmhE64EwATBLVCmNoHtzj_Jhq3VSEjTPSXBeuWvveAaTfzsxBKHz92MjeU-XqdqtjYIGsXG6eYmz_bQE7t8KLSZyU0hplzDmBmRSaj1Eb9NA/s1600/IMG_0199.JPG",
    },
    {
      id: 4,
      name: "Hot Wheels Drift King",
      price: "$10.99",
      image: "https://www.characterbrands.co.uk/images/productextrazoom/887961379433-2-1.jpg",
    },
    {
      id: 5,
      name: "Hot Wheels Shark Cruiser",
      price: "$11.49",
      image: "https://www.hamleys.com/media/catalog/product/h/o/hot_wheels_monster_action_sharkcruiser_1013634_a.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=&width=&canvas=:",
    },
    {
      id: 6,
      name: "Cyber Speeder",
      price: "$7.99",
      image: "https://i.ytimg.com/vi/QzkJEUW9ZGA/maxresdefault.jpg",
    },
  ]);

  const { addToCart } = useCart(); // ✅ Access addToCart function

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-orange-100 to-red-100 py-12 px-6">
      <h1 className="text-5xl font-extrabold text-center text-red-600 mb-14 drop-shadow-lg">
        🏁 Shop Hot Wheels
      </h1>

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
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-800 mb-1">{product.name}</h3>
              <p className="text-md text-orange-600 font-semibold mb-4">{product.price}</p>
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
    </div>
  );
}
