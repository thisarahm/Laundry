export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6">
        <img src="/images/logo.png" className="h-20 w-20 object-contain mx-auto opacity-80" alt="logo" />
      </div>

      <h1 className="text-8xl font-bold text-teal-600 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 max-w-sm mb-8">
        Sepertinya halaman yang kamu cari sudah dipindah, dihapus, atau mungkin tidak pernah ada.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href="/"
          className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Kembali ke Beranda
        </a>
        <a
          href="/layanan"
          className="border border-teal-200 text-teal-600 hover:bg-teal-50 px-6 py-3 rounded-xl font-semibold transition"
        >
          Ke Halaman Layanan
        </a>
      </div>

      <p className="text-gray-300 text-xs mt-12">© 2025 Laundry Niwasa</p>
    </div>
  );
}
