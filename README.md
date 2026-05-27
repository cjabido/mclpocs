# MCP POCs

This repository stores multiple MCP experiments across frameworks.

## Projects

- `apps/backend-api` — simple backend data-store API for future experiments.
- `apps/spring-mcp-server` — Java Spring MCP server exposing the backend records API as Streamable HTTP tools.

## Backend API

```bash
npm install
npm run dev:api
```

The API defaults to `http://localhost:3000`.

### Endpoints

- `GET /health`
- `GET /api/records`
- `POST /api/records`
- `GET /api/records/:id`
- `PUT /api/records/:id`
- `DELETE /api/records/:id`

Records are stored in `apps/backend-api/data/records.json`.

## Spring MCP Server

The Spring MCP server exposes the shared records API as MCP tools over Streamable HTTP.

```bash
npm run dev:api
npm run dev:mcp:spring
```

The MCP server requires Java 21+ and Maven. The npm scripts default `JAVA_HOME` to `/Users/cjabido/Library/Java/JavaVirtualMachines/openjdk-26.0.1/Contents/Home` when it is not already set. It defaults to `http://localhost:8080`, exposes MCP at `/mcp`, and expects the backend API at `http://localhost:3000`.

### Tools

- `list_records`
- `get_record`
- `create_record`
- `update_record`
- `delete_record`
