import React from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { formatPrice, currency, exchangeRate } = useCurrency();

  // Calculate total in selected currency
  const calculateTotal = () => {
    const usdTotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return sum + (price * item.quantity);
    }, 0);

    if (currency === 'LKR') {
      return usdTotal * exchangeRate;
    }
    return usdTotal;
  };

  const total = calculateTotal();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-orange-100 to-red-100 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-red-600 mb-8">🛒 Your Cart</h1>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty!</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any awesome Hot Wheels to your cart yet.</p>
            <Link
              to="/shop"
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Start Shopping 🏎️
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-orange-100 to-red-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-8 drop-shadow-lg">
          🛒 Your Hot Wheels Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Cart Items ({cartItems.length})</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const price = parseFloat(item.price.replace('$', ''));
                  const itemTotalUSD = price * item.quantity;
                  const itemTotal = currency === 'LKR' ? itemTotalUSD * exchangeRate : itemTotalUSD;
                  const currencySymbol = currency === 'USD' ? '$' : 'Rs ';
                  const formattedItemTotal = currency === 'LKR' 
                    ? `${currencySymbol}${itemTotal.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`
                    : `${currencySymbol}${itemTotal.toFixed(2)}`;
                  
                  return (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-center space-x-4">
                        
                        {/* Product Image */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-orange-200"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                        
                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-orange-600 font-semibold">{formatPrice(item.price)} each</p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition flex items-center justify-center font-bold"
                          >
                            −
                          </button>
                          
                          <span className="w-12 text-center font-semibold text-gray-800">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Item Total */}
                        <div className="text-right min-w-[100px]">
                          <p className="text-lg font-bold text-gray-900">{formattedItemTotal}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium mt-1"
                          >
                            🗑 Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>
                    {currency === 'USD' 
                      ? `$${total.toFixed(2)}` 
                      : `Rs ${total.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`
                    }
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total:</span>
                    <span>
                      {currency === 'USD' 
                        ? `$${total.toFixed(2)}` 
                        : `Rs ${total.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-semibold text-center block"
                >
                  🛍️ Proceed to Checkout
                </Link>
                
                <Link
                  to="/shop"
                  className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition font-semibold text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
