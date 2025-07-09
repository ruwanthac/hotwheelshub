import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await signup(form.email, form.password);
      navigate("/"); // Redirect to home after successful registration
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3 py-2 border rounded"
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-3 py-2 border rounded"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
