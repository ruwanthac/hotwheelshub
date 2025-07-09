import { useState } from "react";
import { db } from "../firebase"; // ✅ Import Firestore
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      // ✅ Save contact to Firestore
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });

      // Optional: Auto-hide message after a few seconds
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      alert("❌ Failed to send message: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-red-500 to-blue-600 py-16 px-4 text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-10 drop-shadow-lg">
          🚗 Contact HotWheelsHub
        </h1>

        {submitted && (
          <div className="mb-6 text-center bg-green-200 text-green-800 font-bold py-3 px-5 rounded-lg shadow-lg">
            ✅ Your message has been sent successfully!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-black bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-6"
        >
          <div>
            <label className="block mb-2 text-yellow-300 font-semibold">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-300"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block mb-2 text-yellow-300 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-300"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-2 text-yellow-300 font-semibold">
              Message
            </label>
            <textarea
              name="message"
              rows="5"
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-300"
              placeholder="Write your message..."
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={sending}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {sending ? "Sending..." : "✉️ Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
