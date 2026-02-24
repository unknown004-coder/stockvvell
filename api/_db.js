const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'backend', 'db.json');

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { products: [], sales: [], users: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  getProducts() {
    return readDB().products || [];
  },
  createProduct(p) {
    const db = readDB();
    const id = (db.products.reduce((m, x) => Math.max(m, x.id || 0), 0) || 0) + 1;
    const prod = { id, ...p };
    db.products.push(prod);
    writeDB(db);
    return prod;
  },
  updateProduct(id, attrs) {
    const db = readDB();
    const i = db.products.findIndex((x) => String(x.id) === String(id));
    if (i === -1) return null;
    db.products[i] = { ...db.products[i], ...attrs };
    writeDB(db);
    return db.products[i];
  },
  deleteProduct(id) {
    const db = readDB();
    const before = db.products.length;
    db.products = db.products.filter((x) => String(x.id) !== String(id));
    writeDB(db);
    return { changes: before - db.products.length };
  },
  getSales() {
    return readDB().sales || [];
  },
  createSale(s) {
    const db = readDB();
    const id = (db.sales.reduce((m, x) => Math.max(m, x.id || 0), 0) || 0) + 1;
    const snapshotName = s.productName || (s.product && s.product.name) || '';
    const sale = { id, ...s, productName: snapshotName };
    db.sales.push(sale);
    writeDB(db);
    return sale;
  },
  clearSales() {
    const db = readDB();
    db.sales = [];
    writeDB(db);
  },
  deleteSale(id) {
    const db = readDB();
    const before = db.sales.length;
    db.sales = db.sales.filter((s) => String(s.id) !== String(id));
    writeDB(db);
    return { changes: before - db.sales.length };
  },
  getStats() {
    const db = readDB();
    // simple stats: totalProducts, totalSales, revenue
    const totalProducts = (db.products || []).length;
    const totalSales = (db.sales || []).length;
    const revenue = (db.sales || []).reduce((sum, s) => sum + (s.amount || 0), 0);
    return { totalProducts, totalSales, revenue };
  },
};
