import React from 'react';
import { useCart } from '../context/cartcontext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cartItems, removeFromCart } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty 🛒</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-blue-700">{item.name}</h3>
                  <p className="text-gray-700">Qty: {item.quantity}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  ❌ Remove
                </button>
              </li>
            ))}
          </ul>

          {/* ✅ Proceed to Checkout Button */}
          <div className="mt-8 flex justify-end">
            <Link
              to="/checkout"
              className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
            >
              ✅ Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
