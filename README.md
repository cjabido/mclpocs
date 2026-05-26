# MCP POCs

This repository stores multiple MCP experiments across frameworks.

## Projects

- `apps/backend-api` — simple backend data-store API for future experiments.

## Backend API

```bash
npm install
npm run dev:api
```

The API defaults to `http://localhost:3000`.

### Endpoints

- `GET /health`
- `GET /api/items`
- `POST /api/items`
- `GET /api/items/:id`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`

Items are stored in `apps/backend-api/data/items.json`.
