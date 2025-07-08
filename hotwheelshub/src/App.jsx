import { Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';

import Home from './pages/home';
import Shop from './pages/shop';
import Contact from './pages/contact';
import Cart from './pages/cart';
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import Admin from './pages/admin';
import Checkout from './pages/Checkout'; // ✅ Import the page

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/Checkout" element={<Checkout />} />
        {/* Admin Page (Protected) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
