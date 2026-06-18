"use client";
import { useState, useEffect } from "react";

const ratingLabels = ["", "Sangat Buruk", "Buruk", "Cukup", "Bagus", "Sangat Bagus"];

const statusStyle = {
  Menunggu:     "bg-yellow-50 text-yellow-600 border-yellow-200",
  Diproses:     "bg-blue-50 text-blue-600 border-blue-200",
  "Siap Diambil": "bg-purple-50 text-purple-600 border-purple-200",
  Selesai:      "bg-teal-50 text-teal-700 border-teal-200",
};

export default function Riwayat() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState({ show: false, transaksiId: null });
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Read user from localStorage only on the client inside effect
    if (typeof window === "undefined") return;
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) {
      window.location.href = "/login";
      return;
    }
    setUser(u);

    let socket;

    const fetchRiwayat = () => {
      fetch(`http://localhost:5000/api/riwayat/${u.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setOrders(data);
          } else {
            console.warn("Unexpected /api/riwayat response:", data);
            setOrders([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch riwayat:", err);
          setOrders([]);
          setLoading(false);
        });
    };

    // initial fetch
    fetchRiwayat();

    // connect to backend WebSocket for real-time updates
    try {
      socket = new WebSocket("ws://localhost:5000");
      socket.addEventListener("open", () => console.log("[ws] connected to backend"));
      socket.addEventListener("message", (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (!msg || !msg.type) return;
          if (msg.type === "new-transaksi" && msg.payload?.user_id === u.id) {
            fetchRiwayat();
          } else if ((msg.type === "status-update" || msg.type === "rating") && msg.payload?.user_id === u.id) {
            fetchRiwayat();
          }
        } catch (e) {
          console.error("Failed parse ws message", e);
        }
      });
    } catch (e) {
      console.warn("WebSocket connection failed", e);
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) socket.close();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const openRatingModal = (transaksiId) => {
    setRatingModal({ show: true, transaksiId });
    setSelectedRating(0);
    setHoverRating(0);
    setKomentar("");
  };

  const submitRating = async () => {
    if (selectedRating === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaksi_id: ratingModal.transaksiId,
          user_id: user.id,
          rating: selectedRating,
          komentar,
        }),
      });
      if (res.ok) {
        setOrders(orders.map((o) =>
          o.id === ratingModal.transaksiId
            ? { ...o, rating: selectedRating, komentar }
            : o
        ));
        setRatingModal({ show: false, transaksiId: null });
        setToast("Rating berhasil dikirim!");
        setTimeout(() => setToast(""), 2500);
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-teal-600 text-white px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium">
          <span>⭐</span> {toast}
        </div>
      )}

      {/* MODAL RATING */}
      {ratingModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Beri Rating</h2>
            <p className="text-gray-500 text-sm mb-6">Bagaimana pengalaman laundry kamu?</p>

            {/* Bintang */}
            <div className="flex justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setSelectedRating(star)}
                  className="text-4xl transition-transform hover:scale-110"
                >
                  <span
                    className={
                      star <= (hoverRating || selectedRating)
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-teal-600 font-medium mb-5 h-5">
              {selectedRating > 0 ? ratingLabels[selectedRating] : ""}
            </p>

            <textarea
              placeholder="Tulis komentar (opsional)..."
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none mb-5"
              rows={3}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setRatingModal({ show: false, transaksiId: null })}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl font-semibold transition text-sm"
              >
                Batal
              </button>
              <button
                onClick={submitRating}
                disabled={selectedRating === 0 || submitting}
                className="flex-1 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-300 text-white py-2.5 rounded-xl font-semibold transition text-sm"
              >
                {submitting ? "Mengirim..." : "Kirim Rating"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/layanan"
              className="text-gray-400 hover:text-teal-600 transition text-sm flex items-center gap-1"
            >
              ← Kembali
            </a>
            <div className="w-px h-5 bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" className="h-9 w-9 object-contain" alt="logo" />
              <div>
                <p className="font-bold text-teal-700 leading-tight text-sm">Laundry Niwasa</p>
                <p className="text-xs text-gray-400">Halo, {user?.username || "Pengguna"} 👋</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition"
          >
            Keluar
          </button>
        </div>
      </nav>

      {/* HEADER */}
      <div className="bg-linear-to-br from-teal-700 to-teal-500 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Riwayat Pesanan</h1>
          <p className="text-teal-100 text-sm">Semua pesanan laundry kamu tercatat di sini</p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="py-10 px-6">
        <div className="max-w-4xl mx-auto">

          {loading ? (
            <div className="text-center py-20 text-gray-400 text-sm">Memuat riwayat...</div>
          ) : !Array.isArray(orders) || orders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">📋</p>
              <p className="text-gray-600 font-medium">Belum ada pesanan</p>
              <p className="text-gray-400 text-sm mt-1">Yuk mulai laundry pertamamu!</p>
              <a
                href="/layanan"
                className="mt-5 inline-block bg-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-500 transition"
              >
                Pesan Sekarang
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Header kartu */}
                  <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
                        #{order.id}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">Pesanan #{order.id}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.tanggal).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyle[order.status] || statusStyle["Menunggu"]}`}>
                      {order.status || "Menunggu"}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="px-5 py-4 space-y-2.5">
                    {order.items.map((item, j) => (
                      <div key={j} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.nama_layanan}{" "}
                          <span className="text-gray-400">({item.berat} kg)</span>
                        </span>
                        <span className="font-medium text-gray-800">
                          Rp {Number(item.subtotal).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer kartu */}
                  <div className="px-5 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div>
                      {order.rating ? (
                        <div>
                          <div className="flex gap-0.5 mb-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span
                                key={s}
                                className={`text-base ${s <= order.rating ? "text-yellow-400" : "text-gray-200"}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          {order.komentar && (
                            <p className="text-xs text-gray-400 max-w-xs">"{order.komentar}"</p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => openRatingModal(order.id)}
                          className="text-xs text-teal-600 border border-teal-200 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition font-medium"
                        >
                          ⭐ Beri Rating
                        </button>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">Total Pembayaran</p>
                      <p className="font-bold text-teal-700">
                        Rp {Number(order.total_harga).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
