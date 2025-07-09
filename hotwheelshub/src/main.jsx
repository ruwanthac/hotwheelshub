import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx'; // ✅ fixed casing
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext.jsx'; // ✅ Add currency provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
