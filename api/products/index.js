import db from '../_db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const products = db.getProducts();
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const payload = req.body || {};
      const p = db.createProduct(payload);
      return res.status(201).json(p);
    }

    res.setHeader('Allow', 'GET,POST');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
