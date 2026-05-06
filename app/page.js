export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-start pl-20 bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/latar.jpg')",
      }}
    >
      {/* overlay biar elegan */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* card */}
      <div className="relative bg-gradient-to-r from-teal-500/90 to-cyan-400/90 p-10 rounded-2xl shadow-2xl text-white max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">
          Selamat Datang di Laundry Niwasa
        </h1>
        <p className="mb-6 text-sm">
          Solusi laundry cepat, bersih, dan terpercaya untuk kebutuhan harianmu.
        </p>

        <div className="flex gap-4">
          <a
            href="/login"
            className="flex-1 bg-white text-teal-600 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="flex-1 bg-white text-teal-600 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}