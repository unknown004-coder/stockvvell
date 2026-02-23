import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "data.sqlite");
const JSON_FILE = path.join(process.cwd(), "db.json");

let usingSqlite = false;
let sqliteDb = null;

function id() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

// Try to dynamically import better-sqlite3. If it isn't available, fall back to JSON file storage.
try {
  const BetterSqlite3 = await import("better-sqlite3");
  const Database = BetterSqlite3.default || BetterSqlite3;
  sqliteDb = new Database(DB_FILE);
  usingSqlite = true;

  function initSqlite() {
    sqliteDb.prepare(
      `CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        quantity INTEGER DEFAULT 0,
        price REAL DEFAULT 0
      )`
    ).run();

    sqliteDb.prepare(
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        name TEXT
      )`
    ).run();

    sqliteDb.prepare(
      `CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        productId TEXT NOT NULL,
        productName TEXT,
        quantity INTEGER NOT NULL,
        amount REAL DEFAULT 0,
        date TEXT NOT NULL
      )`
    ).run();

    const count = sqliteDb.prepare(`SELECT count(1) as c FROM products`).get().c;
    if (count === 0 && fs.existsSync(JSON_FILE)) {
      try {
        const raw = fs.readFileSync(JSON_FILE, "utf8");
        const parsed = JSON.parse(raw);
        const insertP = sqliteDb.prepare(`INSERT INTO products (id,name,category,quantity,price) VALUES(?,?,?,?,?)`);
        const insertS = sqliteDb.prepare(`INSERT INTO sales (id,productId,productName,quantity,amount,date) VALUES(?,?,?,?,?,?)`);
            const insertU = sqliteDb.prepare(`INSERT INTO users (id,email,passwordHash,name) VALUES(?,?,?,?)`);
        const pTx = sqliteDb.transaction((products = [], sales = []) => {
          for (const p of products) insertP.run(p.id, p.name, p.category || "", p.quantity || 0, p.price || 0);
          for (const s of sales) insertS.run(s.id, s.productId, s.productName || "", s.quantity, s.amount || 0, s.date || new Date().toISOString());
        });
        pTx(parsed.products || [], parsed.sales || []);
      } catch (e) {
        // ignore migration errors
      }
    }
  }

  initSqlite();
} catch (e) {
  usingSqlite = false;
}

function readJSON() {
  try {
    const raw = fs.readFileSync(JSON_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return { products: [], sales: [] };
  }
}

function writeJSON(db) {
  fs.writeFileSync(JSON_FILE, JSON.stringify(db, null, 2));
}

// Exported API that works with either sqlite or JSON fallback
export function getProducts() {
  if (usingSqlite) {
    return sqliteDb.prepare(`SELECT * FROM products ORDER BY name COLLATE NOCASE`).all();
  }
  const db = readJSON();
  return db.products;
}

export function createUser({ email, passwordHash, name }) {
  if (usingSqlite) {
    const nid = id();
    sqliteDb.prepare(`INSERT INTO users (id,email,passwordHash,name) VALUES(?,?,?,?)`).run(nid, email, passwordHash, name || "");
    return sqliteDb.prepare(`SELECT id,email,name FROM users WHERE id = ?`).get(nid);
  }
  const db = readJSON();
  db.users = db.users || [];
  const nid = id();
  const user = { id: nid, email, passwordHash, name: name || "" };
  db.users.push(user);
  writeJSON(db);
  return { id: nid, email, name: user.name };
}

export function getUserByEmail(email) {
  if (usingSqlite) {
    return sqliteDb.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
  }
  const db = readJSON();
  db.users = db.users || [];
  return db.users.find((u) => u.email === email) || null;
}

export function setUserPasswordByEmail(email, passwordHash) {
  if (usingSqlite) {
    sqliteDb.prepare(`UPDATE users SET passwordHash = ? WHERE email = ?`).run(passwordHash, email);
    return sqliteDb.prepare(`SELECT id,email,name FROM users WHERE email = ?`).get(email);
  }
  const db = readJSON();
  db.users = db.users || [];
  const user = db.users.find((u) => u.email === email);
  if (!user) return null;
  user.passwordHash = passwordHash;
  writeJSON(db);
  return { id: user.id, email: user.email, name: user.name };
}

export function createProduct({ name, category = "", quantity = 0, price = 0 }) {
  if (usingSqlite) {
    const nid = id();
    sqliteDb.prepare(`INSERT INTO products (id,name,category,quantity,price) VALUES(?,?,?,?,?)`).run(nid, name, category, Number(quantity), Number(price));
    return sqliteDb.prepare(`SELECT * FROM products WHERE id = ?`).get(nid);
  }
  const db = readJSON();
  const nid = id();
  const product = { id: nid, name, category, quantity: Number(quantity), price: Number(price) };
  db.products.push(product);
  writeJSON(db);
  return product;
}

export function updateProduct(idv, { name, category, quantity, price }) {
  if (usingSqlite) {
    sqliteDb.prepare(`UPDATE products SET name = ?, category = ?, quantity = ?, price = ? WHERE id = ?`).run(name, category || "", Number(quantity), Number(price), idv);
    return sqliteDb.prepare(`SELECT * FROM products WHERE id = ?`).get(idv);
  }
  const db = readJSON();
  const idx = db.products.findIndex((p) => p.id === idv);
  if (idx === -1) return null;
  db.products[idx] = { ...db.products[idx], name, category: category || "", quantity: Number(quantity), price: Number(price) };
  writeJSON(db);
  return db.products[idx];
}

export function deleteProduct(idv) {
  if (usingSqlite) {
    return sqliteDb.prepare(`DELETE FROM products WHERE id = ?`).run(idv);
  }
  const db = readJSON();
  const before = db.products.length;
  db.products = db.products.filter((p) => p.id !== idv);
  writeJSON(db);
  return { changes: before - db.products.length };
}

export function getSales() {
  if (usingSqlite) {
    return sqliteDb.prepare(`SELECT * FROM sales ORDER BY date DESC`).all();
  }
  const db = readJSON();
  return db.sales;
}

export function clearSales() {
  if (usingSqlite) {
    sqliteDb.prepare(`DELETE FROM sales`).run();
    return { ok: true };
  }
  const db = readJSON();
  db.sales = [];
  writeJSON(db);
  return { ok: true };
}

export function createSale({ productId, quantity, amount, date }) {
  if (usingSqlite) {
    const q = Number(quantity);
    const product = sqliteDb.prepare(`SELECT * FROM products WHERE id = ?`).get(productId);
    if (!product) throw new Error("product not found");
    if (product.quantity < q) throw new Error("insufficient stock");
    const nid = id();
    const tx = sqliteDb.transaction(() => {
      sqliteDb.prepare(`UPDATE products SET quantity = quantity - ? WHERE id = ?`).run(q, productId);
      sqliteDb.prepare(`INSERT INTO sales (id,productId,productName,quantity,amount,date) VALUES(?,?,?,?,?,?)`).run(nid, productId, product.name || "", q, Number(amount || 0), date || new Date().toISOString());
    });
    tx();
    return sqliteDb.prepare(`SELECT * FROM sales WHERE id = ?`).get(nid);
  }
  const db = readJSON();
  const product = db.products.find((p) => p.id === productId);
  if (!product) throw new Error("product not found");
  const q = Number(quantity);
  if (product.quantity < q) throw new Error("insufficient stock");
  product.quantity = product.quantity - q;
  const sale = { id: id(), productId, productName: product.name, quantity: q, amount: Number(amount || 0), date: date || new Date().toISOString() };
  db.sales.push(sale);
  writeJSON(db);
  return sale;
}

export function getStats() {
  if (usingSqlite) {
    const totalProducts = sqliteDb.prepare(`SELECT count(1) as c FROM products`).get().c;
    const totalSalesRow = sqliteDb.prepare(`SELECT sum(amount) as s FROM sales`).get();
    const totalSales = totalSalesRow?.s || 0;
    const inStock = sqliteDb.prepare(`SELECT count(1) as c FROM products WHERE quantity > 0`).get().c;
    const lowStock = sqliteDb.prepare(`SELECT count(1) as c FROM products WHERE quantity > 0 AND quantity <= 5`).get().c;
    const outOfStock = sqliteDb.prepare(`SELECT count(1) as c FROM products WHERE quantity = 0`).get().c;
    return { totalProducts, totalSales, inStock, lowStock, outOfStock };
  }
  const db = readJSON();
  const totalProducts = db.products.length;
  const totalSales = db.sales.reduce((s, x) => s + Number(x.amount || 0), 0);
  const inStock = db.products.filter((p) => p.quantity > 0).length;
  const lowStock = db.products.filter((p) => p.quantity > 0 && p.quantity <= 5).length;
  const outOfStock = db.products.filter((p) => p.quantity === 0).length;
  return { totalProducts, totalSales, inStock, lowStock, outOfStock };
}

export default { getProducts, createProduct, updateProduct, deleteProduct, getSales, createSale, getStats, createUser, getUserByEmail, setUserPasswordByEmail, clearSales };
