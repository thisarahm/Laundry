"use client";
import { useState, useEffect } from "react";

const statusOptions = ["Menunggu", "Diproses", "Siap Diambil", "Selesai"];

const statusStyle = {
  Menunggu:       "bg-yellow-50 text-yellow-600 border-yellow-200",
  Diproses:       "bg-blue-50 text-blue-600 border-blue-200",
  "Siap Diambil": "bg-purple-50 text-purple-600 border-purple-200",
  Selesai:        "bg-teal-50 text-teal-700 border-teal-200",
};

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [pesanan, setPesanan] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [activeTab, setActiveTab] = useState("pesanan");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  useEffect(() => {
    if (!user || user.role !== "admin") {
      window.location.href = "/login";
      return;
    }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [s, p, r] = await Promise.all([
        fetch("http://localhost:5000/api/admin/stats").then((r) => r.json()),
        fetch("http://localhost:5000/api/admin/pesanan").then((r) => r.json()),
        fetch("http://localhost:5000/api/admin/ratings").then((r) => r.json()),
      ]);
      setStats(s);
      setPesanan(p);
      setRatings(r);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    await fetch(`http://localhost:5000/api/admin/pesanan/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setPesanan(pesanan.map((p) => (p.id === id ? { ...p, status } : p)));
    setUpdatingId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const avgRating =
    ratings.length > 0
      ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1)
      : "-";

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-teal-700 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" className="h-9 w-9 object-contain" alt="logo" />
            <div>
              <p className="font-bold text-white leading-tight text-sm">Laundry Niwasa</p>
              <p className="text-teal-300 text-xs">Dashboard Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-white/80 hover:text-white border border-white/30 hover:border-white px-4 py-2 rounded-xl transition"
          >
            Keluar
          </button>
        </div>
      </nav>

      {loading ? (
        <div className="flex items-center justify-center py-40 text-gray-400 text-sm">
          Memuat data...
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { label: "Pesanan Hari Ini", value: stats?.pesanan_hari_ini ?? 0, icon: "📦", color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Total Pesanan", value: pesanan.length, icon: "🧺", color: "text-teal-600", bg: "bg-teal-50" },
              { label: "Total Pendapatan", value: `Rp ${Number(stats?.total_pendapatan ?? 0).toLocaleString("id-ID")}`, icon: "💰", color: "text-green-600", bg: "bg-green-50" },
              { label: "Pengguna Terdaftar", value: stats?.total_users ?? 0, icon: "👥", color: "text-purple-600", bg: "bg-purple-50" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center text-2xl shrink-0`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div className="flex gap-2 mb-6">
            {["pesanan", "rating"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-white text-gray-500 border border-gray-200 hover:bg-slate-50"
                }`}
              >
                {tab === "pesanan" ? `Pesanan (${pesanan.length})` : `Rating (${ratings.length})`}
              </button>
            ))}
          </div>

          {/* TAB PESANAN */}
          {activeTab === "pesanan" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {pesanan.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-sm">Belum ada pesanan masuk</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-100">
                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pelanggan</th>
                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Layanan</th>
                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tanggal</th>
                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pesanan.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="px-5 py-4 font-semibold text-gray-500">#{p.id}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-xs">
                                {p.username[0].toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-800">{p.username}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-500 max-w-[200px] truncate">{p.layanan}</td>
                          <td className="px-5 py-4 text-gray-500">
                            {new Date(p.tanggal).toLocaleDateString("id-ID", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </td>
                          <td className="px-5 py-4 font-semibold text-gray-800">
                            Rp {Number(p.total_harga).toLocaleString("id-ID")}
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={p.status || "Menunggu"}
                              onChange={(e) => updateStatus(p.id, e.target.value)}
                              disabled={updatingId === p.id}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
                                statusStyle[p.status] || statusStyle["Menunggu"]
                              }`}
                            >
                              {statusOptions.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB RATING */}
          {activeTab === "rating" && (
            <div>
              {ratings.length > 0 && (
                <div className="bg-teal-600 text-white rounded-2xl p-5 mb-5 flex items-center gap-4">
                  <div className="text-4xl font-bold">{avgRating}</div>
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {[1,2,3,4,5].map((s) => (
                        <span key={s} className={`text-lg ${s <= Math.round(avgRating) ? "text-yellow-300" : "text-white/30"}`}>★</span>
                      ))}
                    </div>
                    <p className="text-teal-100 text-sm">Rata-rata dari {ratings.length} ulasan</p>
                  </div>
                </div>
              )}

              {ratings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center text-gray-400 text-sm">
                  Belum ada rating masuk
                </div>
              ) : (
                <div className="space-y-3">
                  {ratings.map((r) => (
                    <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
                            {r.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{r.username}</p>
                            <p className="text-xs text-gray-400">Pesanan #{r.transaksi_id}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex gap-0.5 justify-end">
                            {[1,2,3,4,5].map((s) => (
                              <span key={s} className={`text-base ${s <= r.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                            ))}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(r.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      {r.komentar && (
                        <p className="text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100">
                          "{r.komentar}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
