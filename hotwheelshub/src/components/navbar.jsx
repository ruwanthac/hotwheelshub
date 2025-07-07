import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-center gap-8">
      <Link to="/" className="hover:text-yellow-400">Home</Link>
      <Link to="/shop" className="hover:text-yellow-400">Shop</Link>
      <Link to="/contact" className="hover:text-yellow-400">Contact</Link>
      <Link to="/admin" className="hover:text-yellow-400">Admin</Link>
    </nav>
  );
}