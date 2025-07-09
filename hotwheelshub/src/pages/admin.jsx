import { useState, useEffect } from 'react';
import { productsService, ordersService } from '../firebase';
import { useCurrency } from '../context/CurrencyContext';

export default function Admin() {
  const [toys, setToys] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image: '' });
  const [editingToyId, setEditingToyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const { formatPrice, currency, exchangeRate } = useCurrency(); // ✅ Add currency context

  // ✅ Load products and orders from Firebase on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, ordersData] = await Promise.all([
        productsService.getProducts(),
        ordersService.getOrders()
      ]);
      setToys(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Seed sample data function
  const seedSampleData = async () => {
    try {
      setLoading(true);
      setError('');
      const products = await productsService.seedProducts();
      setToys(products);
    } catch (error) {
      console.error('Error seeding products:', error);
      setError('Failed to seed sample data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.price || !form.image) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      if (editingToyId !== null) {
        // ✅ Update existing product in Firebase
        const updatedProduct = await productsService.updateProduct(editingToyId, form);
        setToys((prev) =>
          prev.map((toy) =>
            toy.id === editingToyId ? updatedProduct : toy
          )
        );
        setEditingToyId(null);
      } else {
        // ✅ Add new product to Firebase
        const newProduct = await productsService.addProduct(form);
        setToys([...toys, newProduct]);
      }

      setForm({ name: '', price: '', image: '' });
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const deleteToy = async (id) => {
    try {
      setLoading(true);
      // ✅ Delete from Firebase
      await productsService.deleteProduct(id);
      setToys(toys.filter((toy) => toy.id !== id));
      
      if (editingToyId === id) {
        setEditingToyId(null);
        setForm({ name: '', price: '', image: '' });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const editToy = (toy) => {
    setForm({ name: toy.name, price: toy.price, image: toy.image });
    setEditingToyId(toy.id);
    setActiveTab('products'); // Switch to products tab when editing
  };

  const cancelEdit = () => {
    setEditingToyId(null);
    setForm({ name: '', price: '', image: '' });
  };

  // ✅ Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await ordersService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete order
  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    try {
      setLoading(true);
      await ordersService.deleteOrder(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Failed to delete order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-6 bg-gradient-to-br from-yellow-100 via-red-100 to-blue-100">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-red-600 drop-shadow-md">
        🛠️ HotWheels Admin Dashboard
      </h1>

      {/* Currency indicator */}
      <div className="max-w-6xl mx-auto mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-center">
          💱 Prices displayed in: <strong>{currency === 'USD' ? '🇺🇸 USD ($)' : '🇱🇰 LKR (Rs)'}</strong>
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex space-x-2 bg-white rounded-lg p-2 shadow-md">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
              activeTab === 'products' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📦 Products ({toys.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
              activeTab === 'orders' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🛒 Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <>
          {/* Seed Data Section */}
          {toys.length === 0 && !loading && (
            <div className="max-w-6xl mx-auto mb-8 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
              <h2 className="text-2xl font-bold text-yellow-800 mb-3">🚀 Get Started</h2>
              <p className="text-yellow-700 mb-4">
                No products found! Want to populate your store with some awesome Hot Wheels to get started?
              </p>
              <button
                onClick={seedSampleData}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-lg shadow transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Adding Sample Data...' : '🎯 Add Sample Hot Wheels'}
              </button>
            </div>
          )}

          {/* Add/Edit Product Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border-4 border-yellow-400 shadow-lg rounded-xl p-6 max-w-6xl mx-auto mb-8"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {editingToyId ? 'Edit Product' : 'Add New Product'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
                disabled={loading}
                required
              />
              <input
                name="price"
                placeholder="Price (e.g. $9.99)"
                value={form.price}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
                disabled={loading}
                required
              />
              <input
                name="image"
                placeholder="Image URL"
                value={form.image}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
                disabled={loading}
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg shadow transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : (editingToyId ? 'Update Product' : 'Add Product')}
              </button>
              {editingToyId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-lg shadow transition"
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Products Table */}
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Image</th>
                    <th className="px-6 py-4 text-left font-semibold">Product Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Price</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {toys.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        {loading ? 'Loading products...' : 'No products found. Add your first product!'}
                      </td>
                    </tr>
                  ) : (
                    toys.map((toy) => (
                      <tr key={toy.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <img
                            src={toy.image}
                            alt={toy.name}
                            className="w-16 h-16 object-cover rounded border"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">{toy.name}</td>
                        <td className="px-6 py-4 text-yellow-600 font-semibold">{formatPrice(toy.price)}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => editToy(toy)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition disabled:opacity-50"
                              disabled={loading}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => deleteToy(toy.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition disabled:opacity-50"
                              disabled={loading}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold">Order #</th>
                  <th className="px-4 py-4 text-left font-semibold">Customer</th>
                  <th className="px-4 py-4 text-left font-semibold">Items</th>
                  <th className="px-4 py-4 text-left font-semibold">Total</th>
                  <th className="px-4 py-4 text-left font-semibold">Status</th>
                  <th className="px-4 py-4 text-left font-semibold">Date</th>
                  <th className="px-4 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      {loading ? 'Loading orders...' : 'No orders found yet. Orders will appear here when customers make purchases.'}
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    // Calculate total in current currency
                    const orderTotalUSD = order.totalAmount || 0;
                    const orderTotal = currency === 'LKR' ? orderTotalUSD * exchangeRate : orderTotalUSD;
                    const formattedTotal = currency === 'USD' 
                      ? `$${orderTotal.toFixed(2)}` 
                      : `Rs ${orderTotal.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`;

                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 font-mono text-sm text-blue-600 font-semibold">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{order.customerInfo.name}</div>
                            <div className="text-sm text-gray-500">{order.customerInfo.email}</div>
                            <div className="text-xs text-gray-400">{order.customerInfo.phone}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-2 mb-1">
                                <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                                <span>{item.name} x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold text-green-600">
                          {formattedTotal}
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border-0 ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}
                            disabled={loading}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {order.createdAt.toLocaleDateString()} <br/>
                          {order.createdAt.toLocaleTimeString()}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition disabled:opacity-50"
                            disabled={loading}
                          >
                            🗑 Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
