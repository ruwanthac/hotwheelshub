import { useState } from "react";

export default function Shop() {
  // Simulated dynamic product list
  const [products] = useState([
    {
      id: 1,
      name: "Hot Wheels Turbo Racer",
      price: "$9.99",
      image: "https://via.placeholder.com/400x200?text=Turbo+Racer",
    },
    {
      id: 2,
      name: "Street Beast X",
      price: "$8.49",
      image: "https://via.placeholder.com/400x200?text=Street+Beast+X",
    },
    {
      id: 3,
      name: "Monster Jam Max-D",
      price: "$12.99",
      image: "https://via.placeholder.com/400x200?text=Monster+Truck",
    },
    {
      id: 4,
      name: "Hot Wheels Drift King",
      price: "$10.99",
      image: "https://via.placeholder.com/400x200?text=Drift+King",
    },
    {
      id: 5,
      name: "Hot Wheels Shark Cruiser",
      price: "$11.49",
      image: "https://via.placeholder.com/400x200?text=Shark+Cruiser",
    },
    {
      id: 6,
      name: "Cyber Speeder",
      price: "$7.99",
      image: "https://via.placeholder.com/400x200?text=Cyber+Speeder",
    },
  ]);

  return (
    <div className="bg-white py-12 px-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Shop Hot Wheels
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-100 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{product.price}</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}