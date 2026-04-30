const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];

// REGISTER
app.post("/api/register", (req, res) => {
  console.log("MASUK REGISTER:", req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username & password wajib diisi" });
  }

  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "User sudah ada" });
  }

  users.push({ username, password });

  res.json({ message: "Register berhasil" });
});

// LOGIN
app.post("/api/login", (req, res) => {
  console.log("MASUK LOGIN:", req.body);

  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.json({ message: "Login sukses" });
  } else {
    res.status(401).json({ message: "Login gagal" });
  }
});

// WAJIB PALING BAWAH
app.listen(5000, () => console.log("Backend jalan di port 5000"));