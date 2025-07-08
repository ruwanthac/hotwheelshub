import { useState } from 'react';

export default function Admin() {
  const [toys, setToys] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image: '' });
  const [editingToyId, setEditingToyId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.image) return;

    if (editingToyId !== null) {
      setToys((prev) =>
        prev.map((toy) =>
          toy.id === editingToyId ? { ...toy, ...form } : toy
        )
      );
      setEditingToyId(null);
    } else {
      const newToy = {
        id: Date.now(),
        name: form.name,
        price: form.price,
        image: form.image,
      };
      setToys([...toys, newToy]);
    }

    setForm({ name: '', price: '', image: '' });
  };

  const deleteToy = (id) => {
    setToys(toys.filter((toy) => toy.id !== id));
    if (editingToyId === id) {
      setEditingToyId(null);
      setForm({ name: '', price: '', image: '' });
    }
  };

  const editToy = (toy) => {
    setForm({ name: toy.name, price: toy.price, image: toy.image });
    setEditingToyId(toy.id);
  };

  const cancelEdit = () => {
    setEditingToyId(null);
    setForm({ name: '', price: '', image: '' });
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-br from-yellow-100 via-red-100 to-blue-100">
      <h1 className="text-5xl font-extrabold mb-10 text-center text-red-600 drop-shadow-md">
        🛠️ HotWheels Admin Panel
      </h1>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-4 border-yellow-400 shadow-lg rounded-xl p-6 max-w-4xl mx-auto mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            name="name"
            placeholder="Toy Name"
            value={form.name}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
            required
          />
          <input
            name="price"
            placeholder="Price (e.g. $9.99)"
            value={form.price}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
            required
          />
          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg shadow transition"
          >
            {editingToyId ? 'Update Toy' : 'Add Toy'}
          </button>
          {editingToyId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-gray-600 underline hover:text-black font-medium"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Toy List */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {toys.map((toy) => (
          <div
            key={toy.id}
            className="bg-white rounded-2xl border-2 border-red-400 shadow-lg hover:shadow-xl transition p-4"
          >
            <img
              src={toy.image}
              alt={toy.name}
              className="w-full h-48 object-cover rounded mb-3 border border-yellow-200"
            />
            <h3 className="text-xl font-bold text-blue-800">{toy.name}</h3>
            <p className="text-lg font-semibold text-yellow-600">{toy.price}</p>
            <div className="flex justify-between mt-4 text-sm">
              <button
                onClick={() => editToy(toy)}
                className="text-blue-600 hover:underline font-semibold"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => deleteToy(toy.id)}
                className="text-red-600 hover:underline font-semibold"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
