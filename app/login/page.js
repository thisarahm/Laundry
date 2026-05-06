"use client";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        window.location.href = "/layanan";
      }
    } catch (err) {
      alert("Gagal connect ke backend!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/login-bg.jpg')",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

      {/* card */}
      <div className="relative bg-gradient-to-br from-blue-200 to-sky-200 p-8 rounded-2xl shadow-2xl w-80">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Login
        </h1>

        <input
          className="w-full p-2 mb-3 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full p-2 mb-4 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white p-2 rounded font-semibold transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}