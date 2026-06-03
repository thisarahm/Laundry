const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// KONEKSI DATABASE
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "laundry_niwasa",
});

db.connect((err) => {
  if (err) {
    console.log("Gagal konek database:", err);
  } else {
    console.log("MySQL Connected!");
  }
});

// =======================
// REGISTER
// =======================
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username & password wajib diisi",
    });
  }

  const sql =
    "INSERT INTO users (username, password) VALUES (?, ?)";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "User sudah ada atau error database",
      });
    }

    res.json({
      message: "Register berhasil",
    });
  });
});

// =======================
// LOGIN
// =======================
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE username=? AND password=?";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error database",
      });
    }

    if (result.length > 0) {
      res.json({
        message: "Login sukses",
        user: result[0],
      });
    } else {
      res.status(401).json({
        message: "Login gagal",
      });
    }
  });
});

// =======================
// AMBIL SEMUA LAYANAN
// =======================
app.get("/api/services", (req, res) => {
  const sql = "SELECT * FROM services";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil layanan",
      });
    }

    res.json(result);
  });
});

// =======================
// CHECKOUT
// =======================
app.post("/api/checkout", (req, res) => {
  const { user_id, total_harga, cart } = req.body;

  const transaksiSql =
    "INSERT INTO transaksi (user_id, total_harga) VALUES (?, ?)";

  db.query(
    transaksiSql,
    [user_id, total_harga],
    (err, transaksiResult) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Gagal simpan transaksi",
        });
      }

      const transaksiId = transaksiResult.insertId;

      const values = cart.map((item) => [
        transaksiId,
        item.service_id,
        item.weight,
        item.subtotal,
      ]);

      const detailSql =
        "INSERT INTO detail_transaksi (transaksi_id, service_id, berat, subtotal) VALUES ?";

      db.query(detailSql, [values], (err) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Gagal simpan detail transaksi",
          });
        }

        res.json({
          message: "Checkout berhasil",
          transaksi_id: transaksiId,
        });
      });
    }
  );
});

// =======================
// SERVER
// =======================
app.listen(5000, () => {
  console.log("Backend jalan di port 5000");
});