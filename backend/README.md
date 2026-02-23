# Simple Stock Tracker — Backend

This is a minimal Express backend for the frontend in this workspace. It uses SQLite (`data.sqlite`) for storage.

Quick start:

1. cd into the backend folder

```bash
cd backend
# install dependencies and run migration to create SQLite DB (migrates from db.json if present)
npm run migrate
# then start server
npm start
```

The server listens on port `4000` by default. Endpoints:

- `GET /api/products` — list products
- `POST /api/products` — add product { name, category, quantity, price }
- `PUT /api/products/:id` — update product
- `DELETE /api/products/:id` — delete product
- `GET /api/sales` — list sales
- `POST /api/sales` — create sale { productId, quantity, amount }
- `GET /api/stats` — basic dashboard stats
- `POST /api/login` — mock login
