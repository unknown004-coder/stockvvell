import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// For ES modules, we need to handle __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const app = express();
  const PORT = process.env.PORT || 4000;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });

  // Load and mount serverless handlers (CommonJS)
  // We need to dynamically import CommonJS modules
  const productsHandler = (await import('./api/products/index.js')).default;
  const productByIdHandler = (await import('./api/products/[id].js')).default;
  const salesHandler = (await import('./api/sales/index.js')).default;
  const salesByIdHandler = (await import('./api/sales/[id].js')).default;
  const statsHandler = (await import('./api/stats.js')).default;
  const pingHandler = (await import('./api/ping.js')).default;

  // Products routes
  app.get('/api/products', (req, res) => productsHandler(req, res));
  app.post('/api/products', (req, res) => productsHandler(req, res));
  app.get('/api/products/:id', (req, res) => {
    const newReq = { ...req, query: { id: req.params.id } };
    productByIdHandler(newReq, res);
  });
  app.put('/api/products/:id', (req, res) => {
    const newReq = { ...req, query: { id: req.params.id } };
    productByIdHandler(newReq, res);
  });
  app.delete('/api/products/:id', (req, res) => {
    const newReq = { ...req, query: { id: req.params.id } };
    productByIdHandler(newReq, res);
  });

  // Sales routes
  app.get('/api/sales', (req, res) => salesHandler(req, res));
  app.post('/api/sales', (req, res) => salesHandler(req, res));
  app.delete('/api/sales', (req, res) => salesHandler(req, res));
  app.get('/api/sales/:id', (req, res) => {
    const newReq = { ...req, query: { id: req.params.id } };
    salesByIdHandler(newReq, res);
  });
  app.delete('/api/sales/:id', (req, res) => {
    const newReq = { ...req, query: { id: req.params.id } };
    salesByIdHandler(newReq, res);
  });

  // Stats route
  app.get('/api/stats', (req, res) => statsHandler(req, res));

  // Health route
  app.get('/api/ping', (req, res) => pingHandler(req, res));

  // Fallback 404
  app.use((req, res) => {
    res.status(404).json({ error: 'not found' });
  });

  app.listen(PORT, () => {
    console.log(`\n✓ API server running at http://localhost:${PORT}`);
    console.log('\nAvailable endpoints:');
    console.log('  GET    /api/products');
    console.log('  POST   /api/products');
    console.log('  GET    /api/products/:id');
    console.log('  PUT    /api/products/:id');
    console.log('  DELETE /api/products/:id');
    console.log('  GET    /api/sales');
    console.log('  POST   /api/sales');
    console.log('  DELETE /api/sales (clear all)');
    console.log('  GET    /api/sales/:id');
    console.log('  DELETE /api/sales/:id');
    console.log('  GET    /api/stats');
    console.log('  GET    /api/ping');
    console.log();
  });
})();
