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
// RIWAYAT PESANAN
// =======================
app.get("/api/riwayat/:user_id", (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT t.id AS transaksi_id, t.total_harga, t.tanggal, t.status,
           dt.berat, dt.subtotal,
           s.nama_layanan,
           r.rating, r.komentar
    FROM transaksi t
    JOIN detail_transaksi dt ON t.id = dt.transaksi_id
    JOIN services s ON dt.service_id = s.id
    LEFT JOIN ratings r ON t.id = r.transaksi_id
    WHERE t.user_id = ?
    ORDER BY t.tanggal DESC
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Gagal mengambil riwayat" });
    }

    const grouped = {};
    result.forEach((row) => {
      if (!grouped[row.transaksi_id]) {
        grouped[row.transaksi_id] = {
          id: row.transaksi_id,
          total_harga: row.total_harga,
          tanggal: row.tanggal,
          status: row.status || "Menunggu",
          rating: row.rating || null,
          komentar: row.komentar || null,
          items: [],
        };
      }
      grouped[row.transaksi_id].items.push({
        nama_layanan: row.nama_layanan,
        berat: row.berat,
        subtotal: row.subtotal,
      });
    });

    res.json(Object.values(grouped));
  });
});

// =======================
// BERI RATING
// =======================
app.post("/api/rating", (req, res) => {
  const { transaksi_id, user_id, rating, komentar } = req.body;

  if (!transaksi_id || !user_id || !rating) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const checkSql = "SELECT id FROM ratings WHERE transaksi_id = ? AND user_id = ?";
  db.query(checkSql, [transaksi_id, user_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error database" });

    if (result.length > 0) {
      return res.status(400).json({ message: "Pesanan ini sudah diberi rating" });
    }

    const sql = "INSERT INTO ratings (transaksi_id, user_id, rating, komentar) VALUES (?, ?, ?, ?)";
    db.query(sql, [transaksi_id, user_id, rating, komentar || null], (err) => {
      if (err) return res.status(500).json({ message: "Gagal menyimpan rating" });
      res.json({ message: "Rating berhasil disimpan" });
    });
  });
});

// =======================
// ADMIN - STATISTIK
// =======================
app.get("/api/admin/stats", (req, res) => {
  const sqlPesananHariIni = "SELECT COUNT(*) AS total FROM transaksi WHERE DATE(tanggal) = CURDATE()";
  const sqlPendapatan = "SELECT COALESCE(SUM(total_harga), 0) AS total FROM transaksi";
  const sqlUsers = "SELECT COUNT(*) AS total FROM users WHERE role = 'user'";

  db.query(sqlPesananHariIni, (err, r1) => {
    if (err) return res.status(500).json({ message: "Error" });
    db.query(sqlPendapatan, (err, r2) => {
      if (err) return res.status(500).json({ message: "Error" });
      db.query(sqlUsers, (err, r3) => {
        if (err) return res.status(500).json({ message: "Error" });
        res.json({
          pesanan_hari_ini: r1[0].total,
          total_pendapatan: r2[0].total,
          total_users: r3[0].total,
        });
      });
    });
  });
});

// =======================
// ADMIN - SEMUA PESANAN
// =======================
app.get("/api/admin/pesanan", (req, res) => {
  const sql = `
    SELECT t.id, t.total_harga, t.tanggal, t.status,
           u.username,
           GROUP_CONCAT(s.nama_layanan ORDER BY s.id SEPARATOR ', ') AS layanan
    FROM transaksi t
    JOIN users u ON t.user_id = u.id
    JOIN detail_transaksi dt ON t.id = dt.transaksi_id
    JOIN services s ON dt.service_id = s.id
    GROUP BY t.id
    ORDER BY t.tanggal DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil pesanan" });
    res.json(result);
  });
});

// =======================
// ADMIN - UPDATE STATUS
// =======================
app.put("/api/admin/pesanan/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const valid = ["Menunggu", "Diproses", "Siap Diambil", "Selesai"];
  if (!valid.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  db.query("UPDATE transaksi SET status = ? WHERE id = ?", [status, id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal update status" });
    res.json({ message: "Status diperbarui" });
  });
});

// =======================
// ADMIN - SEMUA RATING
// =======================
app.get("/api/admin/ratings", (req, res) => {
  const sql = `
    SELECT r.id, r.rating, r.komentar, r.tanggal,
           u.username,
           t.id AS transaksi_id, t.total_harga
    FROM ratings r
    JOIN users u ON r.user_id = u.id
    JOIN transaksi t ON r.transaksi_id = t.id
    ORDER BY r.tanggal DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil rating" });
    res.json(result);
  });
});

// =======================
// SERVER
// =======================
app.listen(5000, () => {
  console.log("Backend jalan di port 5000");
});