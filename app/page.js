"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex items-center justify-start p-6 md:pl-20 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/images/latar.jpg')",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* CARD */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 max-w-xl w-full text-left">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Selamat Datang di Laundry Niwasa 
        </h1>

        <p className="text-gray-600 mb-6">
          Solusi laundry cepat, bersih, dan terpercaya untuk kebutuhan harianmu.
        </p>

        {/* BUTTON */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition hover:scale-105 w-full"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition hover:scale-105 w-full"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}