import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import { ordersService } from '../firebase';

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice, currency, exchangeRate } = useCurrency();
  const navigate = useNavigate();

  // Form state for customer and shipping info
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
    address: '',
    phone: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user && user.email) {
      setCustomerInfo(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user]);

  // Handle form changes
  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  // ✅ Calculate total price in selected currency
  const calculateTotal = () => {
    const usdTotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      const quantity = parseInt(item.quantity);
      if (isNaN(price) || isNaN(quantity)) return sum;
      return sum + price * quantity;
    }, 0);

    return currency === 'LKR' ? usdTotal * exchangeRate : usdTotal;
  };

  const total = calculateTotal();

  // Handle form submission
  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form fields
    if (!customerInfo.email || !customerInfo.name || !customerInfo.address || !customerInfo.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      // Always store USD amount in database for consistency
      const usdTotal = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        const quantity = parseInt(item.quantity);
        if (isNaN(price) || isNaN(quantity)) return sum;
        return sum + price * quantity;
      }, 0);

      // Prepare order data
      const orderData = {
        customerInfo: {
          email: customerInfo.email,
          name: customerInfo.name,
          address: customerInfo.address,
          phone: customerInfo.phone,
          userId: user?.uid || null, // Include user ID if logged in
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: usdTotal, // Store USD amount
        totalDisplayed: total, // Store displayed amount for reference
        currency: currency, // Store currency used at checkout
        orderNumber: `HW-${Date.now()}`, // Generate order number
        status: 'pending'
      };

      // Save order to Firebase
      await ordersService.createOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Show success message with currency
      const displayTotal = currency === 'USD' 
        ? `$${total.toFixed(2)}` 
        : `Rs ${total.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`;
      
      alert(`✅ Order placed successfully!\n\nOrder Number: ${orderData.orderNumber}\nThank you, ${customerInfo.name}!\nTotal: ${displayTotal}\n\nYou will receive a confirmation email at ${customerInfo.email}`);
      
      navigate("/"); // Redirect to homepage
      
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show empty cart message
  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Add some awesome Hot Wheels to your cart first!</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🛒 Checkout</h2>
      
      {/* Currency indicator */}
      <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-center">
          💱 Prices displayed in: <strong>{currency === 'USD' ? '🇺🇸 USD ($)' : '🇱🇰 LKR (Rs)'}</strong>
        </p>
      </div>
      
      {/* Show user status */}
      {user ? (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">✅ Logged in as: <strong>{user.email}</strong></p>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">📧 You're checking out as a guest. Your email will be used for order confirmation.</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 🛒 Cart Items Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-3 mb-4">
              {cartItems.map(item => {
                const price = parseFloat(item.price.replace('$', ''));
                const quantity = parseInt(item.quantity);
                const itemTotalUSD = !isNaN(price) && !isNaN(quantity) ? price * quantity : 0;
                const itemTotal = currency === 'LKR' ? itemTotalUSD * exchangeRate : itemTotalUSD;
                const formattedItemTotal = currency === 'USD' 
                  ? `$${itemTotal.toFixed(2)}` 
                  : `Rs ${itemTotal.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`;
                
                return (
                  <li key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 text-sm block">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-semibold">{formattedItemTotal}</span>
                  </li>
                );
              })}
            </ul>

            {/* 💰 Total Price */}
            <div className="border-t border-gray-300 pt-3">
              <div className="flex justify-between items-center text-xl font-bold text-gray-800">
                <span>Total:</span>
                <span>
                  {currency === 'USD' 
                    ? `$${isNaN(total) ? "0.00" : total.toFixed(2)}` 
                    : `Rs ${isNaN(total) ? "0" : total.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 📦 Customer Info Form */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {user ? 'Shipping Information' : 'Customer & Shipping Information'}
          </h3>
          
          <form onSubmit={handleCheckout} className="space-y-4">
            
            {/* Email field - pre-filled if logged in */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={customerInfo.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                readOnly={user ? true : false}
                style={user ? { backgroundColor: '#f9f9f9' } : {}}
              />
              {user && <p className="text-xs text-gray-500 mt-1">Email auto-filled from your account</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={customerInfo.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address *</label>
              <textarea
                name="address"
                placeholder="123 Main St, City, State, ZIP Code"
                value={customerInfo.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={customerInfo.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* 🧾 Place Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Placing Order...' : 
                `🛍️ Place Order - ${currency === 'USD' 
                  ? `$${total.toFixed(2)}` 
                  : `Rs ${total.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`
                }`
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
