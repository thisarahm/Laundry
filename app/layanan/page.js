"use client";
import { useState, useRef, useEffect } from "react";

const services = [
  { id: 1, name: "Cuci Kering", price: 7000, image: "/images/cucikering.jpg" },
  { id: 2, name: "Cuci Setrika", price: 10000, image: "/images/cucisetrika.jpg" },
  { id: 3, name: "Setrika Saja", price: 5000, image: "/images/setrikasaja.jpg" },
  { id: 4, name: "Express (1 Hari)", price: 15000, image: "/images/express.jpg" },
];

const steps = [
  { icon: "📞", title: "Hubungi via WhatsApp", desc: "Tinggal chat kami untuk mulai laundry" },
  { icon: "🚚", title: "Jemput Pakaian", desc: "Kami bisa jemput laundry ke rumah Anda" },
  { icon: "🧼", title: "Cuci & Kering", desc: "Dicuci dengan standar kebersihan terbaik" },
  { icon: "👕", title: "Siap Dipakai", desc: "Rapi, wangi, dan siap digunakan" },
];

const faqs = [
  {
    q: "Berapa lama estimasi pengerjaan laundry?",
    a: "Pengerjaan standar membutuhkan 2–3 hari:\n• Hari ke-1: Pakaian dipilah berdasarkan warna/bahan, dicuci, dan dikeringkan.\n• Hari ke-2: Proses penyetrikaan dan pelipatan.\n• Hari ke-3: Pengecekan akhir (quality control), pengemasan plastik, dan siap diambil/diantar.\n\nUntuk layanan Express, selesai dalam 1 hari.",
  },
  {
    q: "Apakah ada layanan antar jemput?",
    a: "Ada! Kami melayani antar jemput untuk area Jakarta Timur secara gratis. Untuk area di luar Jakarta Timur dikenakan biaya tambahan Rp10.000.",
  },
  {
    q: "Apa saja metode pembayaran yang diterima?",
    a: "Kami menerima Cash (tunai), Transfer bank, dan QRIS.",
  },
  {
    q: "Bagaimana cara memesan layanan?",
    a: "Kamu bisa langsung pesan melalui website ini, atau hubungi kami via WhatsApp untuk pemesanan dan info lebih lanjut.",
  },
];

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Pelanggan Setia",
    review: "Laundry Niwasa selalu bersih dan wangi! Pakaian saya kembali seperti baru. Sudah langganan lebih dari 2 tahun.",
    rating: 5,
    avatar: "BS",
  },
  {
    name: "Siti Rahayu",
    role: "Ibu Rumah Tangga",
    review: "Pelayanannya ramah dan cepat banget. Pakai layanan express, beneran selesai dalam 1 hari. Recommended!",
    rating: 5,
    avatar: "SR",
  },
  {
    name: "Ahmad Fauzi",
    role: "Mahasiswa",
    review: "Harga terjangkau, kualitas tidak mengecewakan. Cocok banget buat anak kos yang sibuk kuliah.",
    rating: 5,
    avatar: "AF",
  },
];

export default function Layanan() {
  const [cart, setCart] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [search, setSearch] = useState("");
  const [checkoutMsg, setCheckoutMsg] = useState("");
  const [checkoutOk, setCheckoutOk] = useState(false);
  const [lastTransaksiId, setLastTransaksiId] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [cartToast, setCartToast] = useState({ show: false, name: "" });
  const [openFaq, setOpenFaq] = useState(null);
  const strukRef = useRef();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  useEffect(() => {
    history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      history.pushState(null, "", window.location.href);
      setShowLogoutModal(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleOrder = (service) => {
    setCart([...cart, { ...service, weight: 1 }]);
    setCartToast({ show: true, name: service.name });
    setTimeout(() => setCartToast({ show: false, name: "" }), 2500);
  };

  const updateWeight = (index, value) => {
    const newCart = [...cart];
    newCart[index].weight = Math.max(1, Number(value));
    setCart(newCart);
  };

  const removeItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.weight, 0);

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const data = {
        user_id: user?.id || 1,
        total_harga: total,
        cart: cart.map((item) => ({
          service_id: item.id,
          weight: item.weight,
          subtotal: item.price * item.weight,
        })),
      };
      const res = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setCheckoutMsg(result.message);
      if (res.ok) {
        setCheckoutOk(true);
        setShowReceipt(true);
        setLastTransaksiId(result.transaksi_id || null);
        setCart([]);
      }
    } catch {
      setCheckoutMsg("Gagal checkout, coba lagi");
      setCheckoutOk(false);
    }
  };

  const handlePrint = () => {
    if (!strukRef.current) return;
    const content = strukRef.current.innerHTML;
    const printWindow = window.open("", "", "width=400,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Laundry</title>
          <style>
            body { font-family: monospace; padding: 20px; width: 250px; margin: auto; }
            h3 { text-align: center; margin: 0; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .center { text-align: center; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h3>LAUNDRY NIWASA</h3>
          <div class="divider"></div>
          ${content}
          <div class="divider"></div>
          <p class="center">${new Date().toLocaleString("id-ID")}</p>
          <p class="center">Terima kasih!</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* MODAL KONFIRMASI LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚪</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Keluar dari Akun?</h2>
            <p className="text-gray-500 text-sm mb-7">
              Apakah kamu yakin ingin logout? Kamu perlu login ulang untuk mengakses layanan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl font-semibold transition"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 hover:bg-red-400 text-white py-2.5 rounded-xl font-semibold transition"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOMBOL WHATSAPP FLOATING */}
      <a
        href="https://wa.me/6281282870710"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-4 py-3 rounded-2xl shadow-lg transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.83L.057 23.704a.75.75 0 0 0 .92.92l5.874-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.726 9.726 0 0 1-4.964-1.355l-.356-.21-3.687.921.937-3.588-.232-.37A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
        </svg>
        <span className="text-sm font-semibold">Hubungi Kami</span>
      </a>

      {/* TOAST TAMBAH KERANJANG */}
      {cartToast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-teal-600 text-white px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium">
          <span className="text-lg">🛒</span>
          <span><strong>{cartToast.name}</strong> ditambahkan ke keranjang</span>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" className="h-9 w-9 object-contain" alt="logo" />
            <div>
              <p className="font-bold text-teal-700 leading-tight text-sm">Laundry Niwasa</p>
              <p className="text-xs text-gray-400">
                Halo, {user?.username || "Pengguna"} 👋
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/riwayat"
              className="text-sm text-teal-600 border border-teal-200 hover:bg-teal-50 px-4 py-2 rounded-xl transition"
            >
              Riwayat Pesanan
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition"
            >
              Keluar
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="bg-linear-to-br from-teal-700 to-teal-500 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Laundry Niwasa</h1>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto text-lg">
            Laundry modern dengan layanan cepat, bersih, dan terpercaya.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {["⚡ Express 1 Hari", "✨ Bersih & Wangi", "💰 Harga Terjangkau"].map((text) => (
              <span
                key={text}
                className="bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-sm"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CARA KERJA */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <img
              src="/images/kilo.png"
              className="w-full h-full object-cover"
              alt="kilo"
            />
          </div>
          <div>
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-2">
              Proses Kami
            </p>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Bagaimana Kami Bekerja
            </h2>
            <p className="text-gray-500 mb-8">
              Proses laundry dibuat sederhana dan efisien agar Anda mendapatkan
              hasil terbaik tanpa ribet.
            </p>
            <div className="space-y-5">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="shrink-0 w-11 h-11 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center text-xl">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{step.title}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONI */}
      <div className="py-20 px-6 bg-teal-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-teal-300 font-semibold text-sm uppercase tracking-widest mb-2">
              Kata Mereka
            </p>
            <h2 className="text-3xl font-bold text-white">Apa Kata Pelanggan Kami</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <span key={s} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-6">
                  "{t.review}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-teal-300 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOKASI & FAQ */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14">

          {/* LOKASI */}
          <div>
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-2">
              Temukan Kami
            </p>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Lokasi & Jam Buka</h2>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-11 h-11 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                📍
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm mb-1">Alamat</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Jalan Raden Inten II, RT.3/RW.2, Duren Sawit, Kec. Duren Sawit,
                  Kota Jakarta Timur, DKI Jakarta 13440
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Jalan+Raden+Inten+II+Duren+Sawit+Jakarta+Timur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 text-sm font-medium mt-2 inline-block hover:text-teal-500 transition"
                >
                  Lihat di Google Maps →
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                🕐
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm mb-3">Jam Operasional</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl">
                    <span className="text-sm text-gray-600">Senin – Jumat</span>
                    <span className="text-sm font-semibold text-teal-700">08.00 – 20.00</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl">
                    <span className="text-sm text-gray-600">Sabtu – Minggu</span>
                    <span className="text-sm font-semibold text-teal-700">10.00 – 18.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-2">
              FAQ
            </p>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Pertanyaan Umum</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-gray-800 hover:bg-slate-50 transition"
                  >
                    <span className="pr-4">{faq.q}</span>
                    <span
                      className={`text-teal-600 text-xl shrink-0 transition-transform duration-200 ${
                        openFaq === i ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3 whitespace-pre-line">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* LAYANAN */}
      <div className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-2">
              Pilihan Layanan
            </p>
            <h2 className="text-3xl font-bold text-gray-800">Layanan Kami</h2>
          </div>

          {/* Search */}
          <div className="max-w-sm mx-auto mb-8">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Cari layanan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent shadow-sm transition"
              />
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="relative">
                  <img
                    src={service.image}
                    className="w-full h-44 object-cover"
                    alt={service.name}
                  />
                  <div className="absolute top-3 right-3 bg-teal-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                    Rp {service.price.toLocaleString("id-ID")}/kg
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">{service.name}</h3>
                  <button
                    onClick={() => handleOrder(service)}
                    className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded-xl text-sm font-semibold transition"
                  >
                    + Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KERANJANG */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🧺 Keranjang</h2>

          {checkoutMsg && (
            <div
              className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium border ${
                checkoutOk
                  ? "bg-teal-50 border-teal-200 text-teal-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {checkoutMsg}
            </div>
          )}

          {cart.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-gray-200 rounded-2xl py-14 text-center">
              <p className="text-5xl mb-3">🧺</p>
              <p className="text-gray-600 font-medium">Keranjang masih kosong</p>
              <p className="text-gray-400 text-sm mt-1">
                Pilih layanan di atas untuk memulai
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {cart.map((item, index) => (
                  <div key={index} className="p-4 flex items-center gap-4">
                    <img
                      src={item.image}
                      className="w-14 h-14 object-cover rounded-xl shrink-0"
                      alt={item.name}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Rp {item.price.toLocaleString("id-ID")}/kg
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        value={item.weight}
                        onChange={(e) => updateWeight(index, e.target.value)}
                        className="w-16 text-center border border-gray-200 bg-white rounded-lg py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                      />
                      <span className="text-xs text-gray-400">kg</span>
                    </div>
                    <div className="text-right shrink-0 w-24">
                      <p className="text-sm font-semibold text-gray-800">
                        Rp {(item.price * item.weight).toLocaleString("id-ID")}
                      </p>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-xs text-red-400 hover:text-red-600 mt-1 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-white border-t border-gray-100">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-gray-600 font-medium">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-teal-700">
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white py-3.5 rounded-xl font-semibold transition"
                >
                  Checkout Sekarang
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STRUK */}
      {showReceipt && (
        <div className="py-16 px-6 bg-slate-50">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Struk Pembayaran
            </h2>
            <div
              ref={strukRef}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="text-center mb-4">
                <p className="font-bold text-gray-900 text-lg">LAUNDRY NIWASA</p>
                <p className="text-xs text-gray-400 mt-0.5">Struk Pembayaran</p>
              </div>
              <div className="border-t border-dashed border-gray-300 my-4" />
              <div className="space-y-2.5">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span>
                      {item.name} ({item.weight} kg)
                    </span>
                    <span className="font-medium">
                      Rp {(item.price * item.weight).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-300 my-4" />
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="mt-4 w-full bg-teal-600 hover:bg-teal-500 text-white py-3.5 rounded-xl font-semibold transition"
            >
              Cetak / Download PDF
            </button>
            {lastTransaksiId && (
              <button
                onClick={() => (window.location.href = "/riwayat")}
                className="mt-3 w-full bg-white border border-teal-600 text-teal-600 py-3.5 rounded-xl font-semibold transition"
              >
                Lihat Riwayat Pesanan
              </button>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-teal-800 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src="/images/logo.png" className="h-8 w-8 object-contain opacity-90" alt="logo" />
            <p className="font-bold text-lg">Laundry Niwasa</p>
          </div>
          <p className="text-teal-300 text-sm">Bersih, Wangi, dan Terpercaya</p>
          <p className="text-teal-500 text-xs mt-4">
            © 2025 Laundry Niwasa. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
