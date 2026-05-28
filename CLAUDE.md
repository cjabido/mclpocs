# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

A monorepo for MCP (Model Context Protocol) proof-of-concept experiments. The root workspace is managed by npm workspaces. New MCP server experiments live as additional packages under `apps/`.

## Commands

All commands run from the repo root unless noted.

```bash
# Install dependencies
npm install

# Backend API (TypeScript/Express, port 3000)
npm run dev:api          # dev mode with tsx watch
npm run build:api        # compile to dist/
npm run start:api        # run compiled output

# Spring MCP server (Java 21+/Maven, port 8080) — requires dev:api running first
npm run dev:mcp:spring   # mvn spring-boot:run
npm run build:mcp:spring # mvn test (runs tests and compiles)
```

Set `JAVA_HOME` before running Spring scripts if not already in your environment; the npm scripts default it to the openjdk-26 path on this machine.

Override the backend API data file path with `DATA_FILE=<path>` when starting `dev:api`.

## Architecture

### Backend API (`apps/backend-api`)

TypeScript/Express REST API. Two entry points:
- `src/server.ts` — creates the HTTP server and binds the port
- `src/app.ts` — builds the Express app (CORS, JSON body parsing, mounts routes)

The only route module (`src/routes/records.ts`) delegates all logic to `RecordStore` (`src/services/recordStore.ts`), which persists records as a JSON array at `apps/backend-api/data/records.json`. `RecordStore` accepts a `DATA_FILE` env override.

### Spring MCP Server (`apps/spring-mcp-server`)

Java Spring Boot service that wraps the backend API as MCP tools over Streamable HTTP.

Key layers:
- `RecordTools` — `@Tool`-annotated methods that become MCP tools; validates required fields then delegates to `RecordApiClient`
- `RecordApiClient` — Spring `RestClient` wrapper around the backend REST API
- `config/` — `RecordsApiProperties` binds `records.api.base-url` from `application.yml`; `RestClientConfig` builds the `RestClient` bean; `ToolConfig` registers `RecordTools` as the MCP tool callback

MCP endpoint: `http://localhost:8080/mcp` (Streamable HTTP transport)

## Testing with MCP Inspector

```bash
# Start both services
npm run dev:api
npm run dev:mcp:spring

# Launch inspector UI (http://localhost:6274)
npx @modelcontextprotocol/inspector

# Or use the CLI
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/list
```

In the Inspector UI: select **Streamable HTTP**, enter `http://localhost:8080/mcp`, connect, then use the Tools tab.

## Adding a New MCP Server

1. Create a new package under `apps/` and add it to the npm workspaces (already covered by the `apps/*` glob).
2. Wire it to the backend API at `http://localhost:3000` for a shared data store, or use a fresh data file via `DATA_FILE`.
3. Add `dev:mcp:<name>` and `build:mcp:<name>` scripts to the root `package.json`.
