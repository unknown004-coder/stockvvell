import db from '../_db.js';

export default async function handler(req, res) {
  try {
    const { id } = req.query || {};
    if (!id) return res.status(400).json({ error: 'missing id' });

    if (req.method === 'PUT') {
      const updated = db.updateProduct(id, req.body || {});
      if (!updated) return res.status(404).json({ error: 'product not found' });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const result = db.deleteProduct(id);
      if (result.changes === 0) return res.status(404).json({ error: 'product not found' });
      return res.status(204).end();
    }

    if (req.method === 'GET') {
      const prod = db.getProducts().find((p) => String(p.id) === String(id));
      if (!prod) return res.status(404).json({ error: 'product not found' });
      return res.status(200).json(prod);
    }

    res.setHeader('Allow', 'GET,PUT,DELETE');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
