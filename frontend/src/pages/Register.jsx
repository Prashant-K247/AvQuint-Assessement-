import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await API.post("/auth/register", formData);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f5] px-4 font-sans text-[#1a1a1a] antialiased">
      <div className="w-full max-w-sm bg-white border border-[#e8e8e5] rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-[#1a1a1a] rounded-[7px] flex items-center justify-center text-white text-sm font-medium">
            AQ
          </div>
          <h1 className="text-base font-semibold tracking-tight text-[#1a1a1a]">
            Create your account
          </h1>
        </div>

        {error && (
          <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-100 rounded-lg p-2.5 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#666] mb-1.5 tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Jane Doe"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full text-sm text-[#1a1a1a] bg-[#fafaf9] border border-[#e0e0dc] rounded-lg px-3 py-2 placeholder-neutral-300 focus:outline-none focus:border-[#1a1a1a] focus:bg-white focus:ring-[3px] focus:ring-neutral-900/5 transition-all duration-150"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#666] mb-1.5 tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full text-sm text-[#1a1a1a] bg-[#fafaf9] border border-[#e0e0dc] rounded-lg px-3 py-2 placeholder-neutral-300 focus:outline-none focus:border-[#1a1a1a] focus:bg-white focus:ring-[3px] focus:ring-neutral-900/5 transition-all duration-150"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#666] mb-1.5 tracking-wide">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full text-sm text-[#1a1a1a] bg-[#fafaf9] border border-[#e0e0dc] rounded-lg px-3 py-2 placeholder-neutral-300 focus:outline-none focus:border-[#1a1a1a] focus:bg-white focus:ring-[3px] focus:ring-neutral-900/5 transition-all duration-150"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-sm font-semibold text-white bg-[#1a1a1a] border-none rounded-lg p-2.5 hover:bg-[#333] disabled:opacity-50 transition-all duration-150 cursor-pointer mt-2"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-5 pt-4 border-t border-[#e8e8e5] text-xs text-center text-[#555]">
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-[#1a1a1a] hover:underline underline-offset-2">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;