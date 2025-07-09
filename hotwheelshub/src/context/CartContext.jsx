import React, { createContext, useContext, useState } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook to access the cart context
export const useCart = () => useContext(CartContext);

// Cart Provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add item to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // ✅ Update item quantity in cart
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // ✅ Get cart total count (items)
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // ✅ Get cart total in USD (base currency)
  const getCartTotalUSD = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        updateQuantity,
        removeFromCart, 
        clearCart,
        getCartCount,
        getCartTotalUSD
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
