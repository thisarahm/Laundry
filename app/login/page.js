"use client";
import { useState, useEffect } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showToast("Username dan password wajib diisi");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = data.user.role === "admin" ? "/admin" : "/layanan";
      } else {
        showToast(data.message || "Username atau password salah");
      }
    } catch {
      showToast("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-teal-900/65 backdrop-blur-sm"></div>

      {/* Toast */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white border border-red-200 text-red-600 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium animate-bounce">
          <span className="text-lg">⚠️</span>
          {toast.message}
        </div>
      )}

      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <h1 className="text-white font-bold text-2xl">Laundry Niwasa</h1>
          <p className="text-white/60 text-sm mt-1">Masuk ke akun kamu</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <input
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 w-full bg-teal-600 hover:bg-teal-500 disabled:bg-teal-300 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-5">
            Belum punya akun?{" "}
            <a href="/register" className="text-teal-600 font-semibold hover:text-teal-500 transition">
              Daftar sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
