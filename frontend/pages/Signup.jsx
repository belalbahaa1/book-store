import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/auth/context";

const Signup = () => {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);
    try {
      const res = await register(form);

      if (!res.success) {
        throw new Error(res.error || "Register Failed");
      }

      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto py-10 mt-50">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={onSubmit}>
        <input
          className="w-full my-2 border p-2 rounded"
          type="text"
          value={form.name}
          placeholder="Name"
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <input
          className="w-full my-2 border p-2 rounded"
          type="email"
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />

        <input
          className="w-full border my-2 p-2 rounded"
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
          disabled={loading}
        >
          {loading ? "..." : "Create account"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
