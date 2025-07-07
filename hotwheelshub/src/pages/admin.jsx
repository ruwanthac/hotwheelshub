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
      // 🔁 Update existing toy
      setToys((prevToys) =>
        prevToys.map((toy) =>
          toy.id === editingToyId ? { ...toy, ...form } : toy
        )
      );
      setEditingToyId(null);
    } else {
      // ➕ Add new toy
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
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

      {/* Add/Edit Toy Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-6 rounded mb-10 shadow">
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded"
          name="name"
          placeholder="Toy Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded"
          name="price"
          placeholder="Price (e.g. $9.99)"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          required
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {editingToyId !== null ? 'Update Toy' : 'Add Toy'}
          </button>
          {editingToyId !== null && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-gray-500 underline hover:text-gray-700"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Toy List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {toys.map((toy) => (
          <div
            key={toy.id}
            className="bg-white border border-gray-300 rounded shadow p-4 relative"
          >
            <img
              src={toy.image}
              alt={toy.name}
              className="w-full h-40 object-cover rounded mb-3"
            />
            <h3 className="font-semibold text-lg">{toy.name}</h3>
            <p className="text-gray-600">{toy.price}</p>
            <div className="flex justify-between mt-3 text-sm">
              <button
                onClick={() => editToy(toy)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteToy(toy.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}