const db = require('../_db');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const sales = db.getSales();
      return res.status(200).json(sales);
    }

    if (req.method === 'POST') {
      const payload = req.body || {};
      const sale = db.createSale(payload);
      return res.status(201).json(sale);
    }

    if (req.method === 'DELETE') {
      // Clear all sales (used by the frontend "Reset Sales" button)
      db.clearSales();
      return res.status(204).end();
    }

    res.setHeader('Allow', 'GET,POST,DELETE');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
