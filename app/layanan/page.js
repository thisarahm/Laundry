"use client";
import { useState, useRef } from "react";


const services = [
  { id: 1, name: "Cuci Kering", price: 7000, image: "/images/cucikering.jpg" },
  { id: 2, name: "Cuci Setrika", price: 10000, image: "/images/cucisetrika.jpg" },
  { id: 3, name: "Setrika Saja", price: 5000, image: "/images/setrikasaja.jpg" },
  { id: 4, name: "Express (1 Hari)", price: 15000, image: "/images/express.jpg" },
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

const user =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user"))
    : null;
    console.log("USER DARI LOCALSTORAGE =", user);  

const handleLogout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login";
};
  const strukRef = useRef();

  const handleOrder = (service) => {
    setCart([...cart, { ...service, weight: 1 }]);
  };

  const updateWeight = (index, value) => {
    const newCart = [...cart];
    newCart[index].weight = Number(value);
    setCart(newCart);
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.weight,
    0
  );
  const filteredServices = services.filter((service) =>
  service.name.toLowerCase().includes(search.toLowerCase())
);

  const handleCheckout = async () => {
  try {
    const data = {
      user_id: 1,
      total_harga: total,
      cart: cart.map((item) => ({
        service_id: item.id,
        weight: item.weight,
        subtotal: item.price * item.weight,
      })),
    };

    const res = await fetch(
      "http://localhost:5000/api/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();

    setMessage(result.message);

    if (res.ok) {
      setShowReceipt(true);
    }
  } catch (err) {
    alert("Gagal checkout");
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
            body {
              font-family: monospace;
              padding: 20px;
              width: 250px;
              margin: auto;
            }

            h3 {
              text-align: center;
              margin: 0;
            }

            .divider {
              border-top: 1px dashed #000;
              margin: 8px 0;
            }

            .center {
              text-align: center;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <h3>LAUNDRY NIWASA</h3>
          <div class="divider"></div>

          ${content}

          <div class="divider"></div>
          <p class="center">${new Date().toLocaleString("id-ID")}</p>
          <p class="center">Terima kasih 🙏</p>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 via-blue-500 to-sky-400">
      <div className="bg-white p-4 flex justify-between items-center shadow">
  <div>
  <h2 className="text-xl font-bold text-blue-700">
    Halo, {user?.username || "Pengguna"} 
  </h2>

  <p className="text-sm text-gray-500">
    Selamat datang di Laundry Niwasa
  </p>
</div>

  <button
    onClick={handleLogout}
    className="bg-red-500 text-white px-4 py-2 rounded"
  >
    Logout
  </button>
</div>
      {/*  */}
      <div className="py-20 px-6 text-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <h1 className="text-4xl font-bold mb-3">
          Laundry Niwasa 
        </h1>

        <p className="max-w-2xl mx-auto mb-6 text-white/90">
          Laundry modern dengan layanan cepat, bersih, dan terpercaya.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <div className="bg-white/20 px-4 py-2 rounded-lg text-sm">
             Express 1 Hari
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg text-sm">
             Bersih & Wangi
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg text-sm">
             Harga Terjangkau
          </div>
        </div>
      </div>


    {/* CARA KERJA */}
<div className="py-20 px-6 bg-white">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

    {/* GAMBAR */}
    <div>
      <img
        src="/images/kilo.png"
        className="w-full rounded-xl shadow-lg"
      />
    </div>

    {/* STEP */}
    <div>
      

      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Bagaimana Kami Bekerja
      </h2>

      <p className="text-gray-600 mb-6">
        Proses laundry kami dibuat sederhana dan efisien agar Anda mendapatkan hasil terbaik tanpa ribet.
      </p>

      <div className="space-y-6">

        <div className="flex items-start gap-4">
          <div className="bg-orange-400 text-white p-3 rounded-lg">📞</div>
          <div>
            <h3 className="font-bold text-sm text-black -600">Hubungi via WhatsApp</h3>
            <p className="text-sm text-black -600">
              Tinggal chat kami untuk mulai laundry
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-orange-400 text-white p-3 rounded-lg">🚚</div>
          <div>
            <h3 className="font-bold text-sm text-black -600">Jemput Pakaian</h3>
            <p className="text-sm text-gray-600">
              Kami bisa jemput laundry ke rumah Anda
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-orange-400 text-white p-3 rounded-lg">🧼</div>
          <div>
            <h3 className="font-bold text-sm text-black -600">Cuci & Kering</h3>
            <p className="text-sm text-gray-600">
              Dicuci dengan standar terbaik
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-orange-400 text-white p-3 rounded-lg">👕</div>
          <div>
            <h3 className="font-bold text-sm text-black -600">Siap Dipakai</h3>
            <p className="text-sm text-gray-600">
              Rapi, wangi, dan siap digunakan
            </p>
          </div>
        </div>

      </div>
    </div>

  </div>
</div>

      {/* LAYANAN */}
      <div className="py-16 px-6 bg-white">
      {message && (
    <div className="max-w-4xl mx-auto mt-5 bg-green-100 text-green-700 p-3 rounded">
    {message}
    </div>
    )}
    <div className="max-w-md mx-auto mb-6">
<div className="max-w-md mx-auto mb-6">
  <input
    type="text"
    placeholder="🔍 Cari layanan..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="
      w-full
      px-4
      py-3
      border-2
      border-gray-300
      rounded-xl
      shadow-sm
      text-gray-800
      placeholder:text-gray-400
      focus:ring-2
      focus:ring-blue-400
      focus:border-blue-400
      bg-white
    "
  />
</div>
</div>
        <h2 className="text-2xl font-bold text-center mb-10 text-blue-700">
          Layanan Kami
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-blue-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
            >
              <img src={service.image} className="w-full h-40 object-cover" />

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {service.name}
                </h2>
                <p className="text-gray-600 text-sm mb-3">
                  Rp {service.price.toLocaleString("id-ID")} / kg
                </p>

                <button
                  onClick={() => handleOrder(service)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded hover:scale-105 transition"
                >
                  Pilih Layanan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KERANJANG */}
      <div className="py-16 px-6 bg-blue-100">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-blue-100">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Keranjang</h2>

          {cart.length === 0 ? (
            <p className="text-gray-600">Belum ada layanan</p>
          ) : (
            <>
              {cart.map((item, index) => (
                <div key={index} className="mb-3 border-b pb-2">
                  <div className="flex justify-between">
                    <span className="text-gray-800">{item.name}</span>
                    <button onClick={() => removeItem(index)}>❌</button>
                  </div>

                  <p className="text-sm text-gray-600">
                    Rp {item.price.toLocaleString("id-ID")} / kg
                  </p>

                  <input
                    type="number"
                    min="1"
                    value={item.weight}
                    onChange={(e) =>
                      updateWeight(index, e.target.value)
                    }
                    className="border-2 border-blue-400 px-3 py-1 w-20 mt-1 rounded-md text-gray-800"
                  /> kg

                  <div className="text-right text-sm text-gray-700">
                    Rp {(item.price * item.weight).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}

              <div className="flex justify-between font-bold mt-4 text-blue-800">
                <span>Total</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>

              <button
              onClick={handleCheckout}
              className="mt-4 bg-green-600 text-white py-2 rounded w-full hover:bg-green-700">
              Checkout
              </button>
            </>
          )}
        </div>
      </div>

      {/* STRUK */}
      {showReceipt && (
        <div className="py-16 px-6 bg-white">
          <div
            ref={strukRef}
            className="max-w-md mx-auto bg-white p-5 rounded shadow-lg border text-black"
          >
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between text-sm text-gray-800">
                <span>{item.name} ({item.weight} kg)</span>
                <span>
                  Rp {(item.price * item.weight).toLocaleString("id-ID")}
                </span>
              </div>
            ))}

            <hr className="my-2 border-dashed border-gray-400" />

            <div className="flex justify-between font-bold text-black">
              <span>Total</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full max-w-md mx-auto block hover:bg-blue-700"
          >
            Download PDF
          </button>
        </div>
      )}

    </div>
  );
}