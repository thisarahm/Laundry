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
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        <input
          className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-700"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 hover:bg-green-700 p-2 rounded font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}