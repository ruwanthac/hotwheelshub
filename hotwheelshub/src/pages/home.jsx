export default function Home() {
  const featuredCars = [
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
  ];

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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <div key={car.id} className="bg-gray-100 rounded-xl shadow hover:shadow-lg overflow-hidden transition">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{car.name}</h3>
                  <p className="text-gray-600 mb-2">{car.price}</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
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