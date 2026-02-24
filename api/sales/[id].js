const db = require('../_db');

module.exports = async function handler(req, res) {
  try {
    const { id } = req.query || {};
    if (!id) return res.status(400).json({ error: 'missing id' });

    if (req.method === 'GET') {
      const sales = db.getSales();
      const sale = sales.find((s) => String(s.id) === String(id));
      if (!sale) return res.status(404).json({ error: 'sale not found' });
      return res.status(200).json(sale);
    }

    if (req.method === 'DELETE') {
      const result = db.deleteSale ? db.deleteSale(id) : null;
      if (result && result.changes === 0) return res.status(404).json({ error: 'sale not found' });
      // If underlying DB doesn't return result, just return 204
      return res.status(204).end();
    }

    res.setHeader('Allow', 'GET,DELETE');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
