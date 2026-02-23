import express from "express";
import cors from "cors";
import path from "path";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

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

// Simple login (mock)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password required" });
  // This is a mock login: accept any credentials and return a token placeholder
  res.json({ ok: true, token: "mock-token", user: { email } });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
