import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { currency, switchToCurrency } = useCurrency();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = getCartCount();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCurrencyChange = (newCurrency) => {
    switchToCurrency(newCurrency);
  };

  return (
    <nav className="bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:text-yellow-200 transition">
            🏎️ HotWheelsHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="hover:text-yellow-200 transition font-medium"
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className="hover:text-yellow-200 transition font-medium"
            >
              Shop
            </Link>
            <Link 
              to="/contact" 
              className="hover:text-yellow-200 transition font-medium"
            >
              Contact
            </Link>
            
            {/* Currency Switcher */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="bg-yellow-500 text-red-600 px-3 py-1 rounded font-semibold text-sm border-0 focus:ring-2 focus:ring-yellow-300 cursor-pointer"
              >
                <option value="USD">🇺🇸 USD</option>
                <option value="LKR">🇱🇰 LKR</option>
              </select>
            </div>
            
            {/* Cart Link with Badge */}
            <Link 
              to="/cart" 
              className="relative hover:text-yellow-200 transition font-medium flex items-center"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-yellow-200">
                  👋 {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded transition font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="hover:text-yellow-200 transition font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-red-600 px-4 py-2 rounded transition font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-2xl"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-red-500">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="hover:text-yellow-200 transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="hover:text-yellow-200 transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                to="/contact" 
                className="hover:text-yellow-200 transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Currency Switcher */}
              <div className="py-2">
                <label className="block text-sm text-yellow-200 mb-1">Currency:</label>
                <select
                  value={currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="bg-yellow-500 text-red-600 px-3 py-2 rounded font-semibold text-sm border-0 w-full"
                >
                  <option value="USD">🇺🇸 USD ($)</option>
                  <option value="LKR">🇱🇰 LKR (Rs)</option>
                </select>
              </div>
              
              <Link 
                to="/cart" 
                className="hover:text-yellow-200 transition font-medium flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span className="ml-2 bg-yellow-400 text-red-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-red-500">
                  <span className="text-yellow-200 text-sm">
                    👋 {user.email}
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded transition font-medium text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-red-500">
                  <Link 
                    to="/login" 
                    className="hover:text-yellow-200 transition font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-yellow-500 hover:bg-yellow-600 text-red-600 px-4 py-2 rounded transition font-bold text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
