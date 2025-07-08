import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cartcontext';
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cartItems, removeFromCart } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 shadow-lg text-white px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:scale-105 transition">
          🏁 HotWheelsHub
        </Link>

        <div className="flex gap-6 items-center text-lg">
          <Link to="/" className="hover:underline hover:text-yellow-100">Home</Link>
          <Link to="/shop" className="hover:underline hover:text-yellow-100">Shop</Link>
          <Link to="/contact" className="hover:underline hover:text-yellow-100">Contact</Link>

          {isAdmin && (
            <Link to="/admin" className="hover:underline hover:text-yellow-100">Admin</Link>
          )}

          {user ? (
            <>
              <span className="text-sm text-white">Welcome, {user.email}</span>
              <button
                onClick={logout}
                className="text-sm text-white hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline hover:text-yellow-100">Login</Link>
              <Link to="/register" className="hover:underline hover:text-yellow-100">Register</Link>
            </>
          )}

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative hover:text-white hover:scale-105 transition"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* CART DRAWER */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg border-l border-gray-300 transform transition-transform duration-300 z-50 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold text-orange-600">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-red-500 text-2xl">&times;</button>
        </div>

        {cartItems.length === 0 ? (
          <p className="p-4 text-gray-600">Your cart is empty 🛒</p>
        ) : (
          <>
            <ul className="p-4 space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded shadow">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            {/* ✅ Checkout Button */}
            <div className="p-4 border-t">
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="block w-full text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
