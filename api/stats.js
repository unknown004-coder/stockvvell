const db = require('./_db');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const stats = db.getStats();
    return res.status(200).json(stats);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
