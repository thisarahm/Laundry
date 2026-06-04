export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/latar.jpg')" }}
    >
      <div className="absolute inset-0 bg-teal-900/70"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" className="h-10 w-10 object-contain" alt="logo" />
          <span className="text-white font-bold text-xl tracking-wide">Laundry Niwasa</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="text-white/80 hover:text-white text-sm font-medium transition"
          >
            Masuk
          </a>
          <a
            href="/register"
            className="bg-white text-teal-700 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-teal-50 transition"
          >
            Daftar
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
          Bersih, Wangi,
          <br />
          <span className="text-teal-300">&amp; Terpercaya</span>
        </h1>

        <p className="text-white/70 text-lg max-w-md mb-10">
          Solusi laundry modern untuk kebutuhan harianmu. Cepat, bersih, dan siap antar jemput.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/login"
            className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-teal-900/40 transition"
          >
            Mulai Sekarang
          </a>
          <a
            href="/register"
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold backdrop-blur-sm transition"
          >
            Buat Akun
          </a>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="relative z-10 border-t border-white/10 bg-black/25 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto grid grid-cols-3 divide-x divide-white/10 py-5 px-6">
          {[
            { label: "Express 1 Hari", icon: "⚡" },
            { label: "Bersih & Wangi", icon: "✨" },
            { label: "Harga Terjangkau", icon: "💰" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-center gap-2 text-white/80 text-sm px-4 py-1"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
