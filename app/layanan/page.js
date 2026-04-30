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

  const handlePrint = () => {
    if (!strukRef.current) return;

    const content = strukRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");

    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Laundry</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; }
          </style>
        </head>
        <body>
          <h2>STRUK LAUNDRY NIWASA</h2>
          ${content}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 via-blue-500 to-sky-400">

      {/* ABOUT */}
      <div className="py-20 px-6 text-center bg-white shadow-md">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Laundry Niwasa 
        </h1>

        <p className="max-w-2xl mx-auto text-gray-700 mb-3">
          Laundry modern dengan layanan cepat, bersih, dan terpercaya.
        </p>

        <p className="max-w-xl mx-auto text-gray-600">
          Kami memastikan setiap pakaian Anda kembali dalam kondisi terbaik.
        </p>
      </div>

      {/* KEUNGGULAN */}
      <div className="py-16 px-6 bg-blue-100">
        <h2 className="text-2xl font-bold text-center mb-10 text-blue-700">
          Kenapa Pilih Kami?
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center border border-blue-100">
            <h3 className="font-semibold mb-2 text-blue-700">Cepat & Express</h3>
            <p className="text-gray-600 text-sm">
              Laundry selesai cepat tanpa mengurangi kualitas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center border border-blue-100">
            <h3 className="font-semibold mb-2 text-blue-700">Bersih & Higienis</h3>
            <p className="text-gray-600 text-sm">
              Proses pencucian modern dengan standar tinggi.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center border border-blue-100">
            <h3 className="font-semibold mb-2 text-blue-700">Harga Murah</h3>
            <p className="text-gray-600 text-sm">
              Laundry sat set anti dompet seret
            </p>
          </div>
        </div>
      </div>

      {/* LAYANAN */}
      <div className="py-16 px-6 bg-white">
        <h2 className="text-2xl font-bold text-center mb-10 text-blue-700">
          Layanan Kami
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-blue-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
            >
              <img src={service.image} className="w-full h-40 object-cover" />

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{service.name}</h2>
                <p className="text-gray-600 text-sm mb-3">
                  Rp {service.price} / kg
                </p>

                <button
                  onClick={() => handleOrder(service)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded hover:scale-105 hover:from-blue-700 hover:to-indigo-700 transition"
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
                    Rp {item.price}/kg
                  </p>

                  <input
                    type="number"
                    min="1"
                    value={item.weight}
                    onChange={(e) =>
                      updateWeight(index, e.target.value)
                    }
                    className="border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none px-3 py-1 w-20 mt-1 rounded-md text-gray-800 bg-white shadow-sm"
                  /> kg

                  <div className="text-right text-sm text-gray-700">
                    Rp {item.price * item.weight}
                  </div>
                </div>
              ))}

              <div className="flex justify-between font-bold mt-4 text-blue-800">
                <span>Total</span>
                <span>Rp {total}</span>
              </div>

              <button
                onClick={() => setShowReceipt(true)}
                className="mt-4 bg-green-600 text-white py-2 rounded w-full hover:bg-green-700 shadow-md"
              >
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
            className="max-w-md mx-auto bg-white p-5 rounded shadow-lg border"
          >
            <h2 className="text-center font-bold text-xl mb-2 text-blue-700">
              STRUK LAUNDRY
            </h2>

            {cart.map((item, index) => (
              <div key={index} className="flex justify-between text-sm text-gray-700">
                <span>{item.name} ({item.weight} kg)</span>
                <span>Rp {item.price * item.weight}</span>
              </div>
            ))}

            <hr className="my-2" />

            <div className="flex justify-between font-bold text-blue-800">
              <span>Total</span>
              <span>Rp {total}</span>
            </div>

            <p className="text-center mt-3 text-sm text-gray-600">
              Terima kasih 🙏
            </p>
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