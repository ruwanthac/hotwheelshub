// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 🔐 Try to register
      const userCredential = await signup(form.email, form.password);
      const user = userCredential.user;

      // 💾 Save user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: form.email,
        createdAt: new Date(),
      });

      alert("✅ Account created successfully!");
      navigate("/");
    } catch (err) {
      // 🔁 If user already exists, try logging in
      if (err.code === "auth/email-already-in-use") {
        try {
          await signInWithEmailAndPassword(auth, form.email, form.password);
          alert("✅ Account exists. You have been logged in.");
          navigate("/");
        } catch (loginErr) {
          setError("❌ Account exists, but password is incorrect.");
        }
      } else if (err.code === "auth/invalid-email") {
        setError("❌ Invalid email format.");
      } else if (err.code === "auth/weak-password") {
        setError("🔒 Password must be at least 6 characters.");
      } else {
        setError("Registration failed: " + err.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3 py-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-3 py-2 border"
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
