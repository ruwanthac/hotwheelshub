import React, { useState } from 'react';
import { useCart } from '../context/cartcontext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  // Form state for shipping info
  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    phone: '',
  });

  // Handle form changes
  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  // ✅ Fixed total price calculation
  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price);
    const quantity = parseInt(item.quantity);
    if (isNaN(price) || isNaN(quantity)) return sum;
    return sum + price * quantity;
  }, 0);

  // Handle form submission
  const handleCheckout = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!shipping.name || !shipping.address || !shipping.phone) {
      alert("Please fill in all shipping details.");
      return;
    }

    alert(`✅ Order placed successfully!\nThank you, ${shipping.name}`);
    clearCart(); // Empty the cart
    navigate("/"); // Redirect to homepage
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {/* 🛒 Display Cart Items */}
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {cartItems.map(item => {
              const price = parseFloat(item.price);
              const quantity = parseInt(item.quantity);
              const itemTotal = !isNaN(price) && !isNaN(quantity) ? (price * quantity).toFixed(2) : "0.00";
              return (
                <li key={item.id} className="flex justify-between items-center border-b pb-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>Rs. {itemTotal}</span>
                </li>
              );
            })}
          </ul>

          {/* 💰 Show Total Price */}
          <div className="text-xl font-semibold mb-6">
            Total: Rs. {isNaN(total) ? "0.00" : total.toFixed(2)}
          </div>

          {/* 📦 Shipping Form */}
          <form onSubmit={handleCheckout} className="space-y-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={shipping.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Shipping Address"
              value={shipping.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={shipping.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />

            {/* 🧾 Place Order Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Place Order
            </button>
          </form>
        </>
      )}
    </div>
  );
}
