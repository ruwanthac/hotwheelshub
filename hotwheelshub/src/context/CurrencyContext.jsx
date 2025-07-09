import React, { createContext, useContext, useState } from 'react';

// Create the context
const CurrencyContext = createContext();

// Custom hook to access the currency context
export const useCurrency = () => useContext(CurrencyContext);

// Currency Provider
export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD'); // Default to USD
  
  // Exchange rate: 1 USD = 320 LKR (approximate rate)
  const exchangeRate = 320;

  // Convert price from USD to selected currency
  const convertPrice = (usdPrice) => {
    // Extract numeric value from price string (e.g., "$9.99" -> 9.99)
    const numericPrice = parseFloat(usdPrice.replace('$', ''));
    
    if (currency === 'LKR') {
      const lkrPrice = numericPrice * exchangeRate;
      return `Rs ${lkrPrice.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`;
    }
    
    // Return original USD price
    return usdPrice;
  };

  // Format price with proper currency symbol
  const formatPrice = (usdPrice) => {
    return convertPrice(usdPrice);
  };

  // Get currency symbol
  const getCurrencySymbol = () => {
    return currency === 'USD' ? '$' : 'Rs';
  };

  // Toggle between currencies
  const toggleCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'LKR' : 'USD');
  };

  // Switch to specific currency
  const switchToCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        convertPrice,
        formatPrice,
        getCurrencySymbol,
        toggleCurrency,
        switchToCurrency,
        exchangeRate
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}; 