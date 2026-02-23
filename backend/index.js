import express from "express";
import cors from "cors";
import path from "path";
import db from "./db.js";
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(express.json());

// Public: login (simple check, returns a local token)
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    const user = db.getUserByEmail(email);
    if (!user) return res.status(401).json({ error: "invalid credentials" });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "invalid credentials" });
    const token = `local-${user.id}`;
    res.json({ ok: true, token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Authentication middleware
// No authentication middleware — routes are public/simple-auth

// Products
app.get("/api/products", (req, res) => {
  try {
    res.json(db.getProducts());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.post("/api/products", (req, res) => {
  try {
    const { name, category, quantity = 0, price = 0 } = req.body || {};
    if (!name) return res.status(400).json({ error: "name is required" });
    const product = db.createProduct({ name, category, quantity, price });
    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.put("/api/products/:id", (req, res) => {
  try {
    const { id: pid } = req.params;
    const updated = db.updateProduct(pid, req.body || {});
    if (!updated) return res.status(404).json({ error: "product not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.delete("/api/products/:id", (req, res) => {
  try {
    const { id: pid } = req.params;
    const result = db.deleteProduct(pid);
    if (result.changes === 0) return res.status(404).json({ error: "product not found" });
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Sales
app.get("/api/sales", (req, res) => {
  try {
    res.json(db.getSales());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.post("/api/sales", (req, res) => {
  try {
    const { productId, quantity, amount, date } = req.body || {};
    if (!productId || !quantity) return res.status(400).json({ error: "productId and quantity are required" });
    const sale = db.createSale({ productId, quantity, amount, date });
    res.status(201).json(sale);
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// Stats
app.get("/api/stats", (req, res) => {
  try {
    res.json(db.getStats());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Clear all sales (reset demand graph)
app.delete("/api/sales", (req, res) => {
  try {
    db.clearSales();
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Note: previous mock login replaced by real login endpoint above

const PORT = process.env.PORT || 4000;
// Create a default user on startup if one doesn't exist
try {
  const defaultEmail = process.env.DEFAULT_USER_EMAIL || "stockvvell@gmail.com";
  const defaultPassword = process.env.DEFAULT_USER_PASSWORD || "Stockvvell@1";
  const existing = db.getUserByEmail(defaultEmail);
  const passwordHash = bcrypt.hashSync(defaultPassword, 10);
  if (!existing) {
    db.createUser({ email: defaultEmail, passwordHash, name: "Stockvvell" });
    console.log(`Created default user: ${defaultEmail}`);
  } else {
    // Ensure the existing user's password matches the desired default (overwrite)
    db.setUserPasswordByEmail(defaultEmail, passwordHash);
    console.log(`Ensured default user password for: ${defaultEmail}`);
  }
} catch (e) {
  console.error("Failed to ensure default user:", e);
}

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
