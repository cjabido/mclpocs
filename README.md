# MCP POCs

This repository stores multiple MCP experiments across frameworks.

## Projects

- `apps/backend-api` — simple backend data-store API for future experiments.
- `apps/spring-mcp-server` — Java Spring MCP server exposing the backend records API as stateless HTTP tools.

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

The Spring MCP server exposes the shared records API as MCP tools over stateless HTTP.

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

### Test with MCP Inspector

Start the backend API and Spring MCP server in separate terminals:

```bash
npm run dev:api
npm run dev:mcp:spring
```

Then start MCP Inspector:

```bash
npx @modelcontextprotocol/inspector
```

In the Inspector UI:

1. Open `http://localhost:6274`.
2. Select `Streamable HTTP` as the transport type.
3. Enter `http://localhost:8080/mcp` as the server URL.
4. Click `Connect`.
5. Open `Tools` and click `List Tools`.

Try `create_record` with:

```json
{
  "name": "Inspector test",
  "data": {
    "source": "mcp-inspector",
    "framework": "spring"
  }
}
```

Then run `list_records` to confirm the record was persisted by the backend API.

### Install to MCP Clients

With both services running, add the server to any MCP-compatible client using `http://localhost:8080/mcp` as the endpoint.

#### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "spring-records": {
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

Restart Claude Desktop to pick up the change. The five records tools will appear in the tools panel.

#### Cursor

Open **Cursor Settings → MCP** and add a new server:

```json
{
  "spring-records": {
    "url": "http://localhost:8080/mcp"
  }
}
```

#### VS Code (GitHub Copilot)

Add to `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "spring-records": {
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

You can also test from the Inspector CLI:

```bash
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/list
```

```bash
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp \
  --transport http \
  --method tools/call \
  --tool-name create_record \
  --tool-arg name="Inspector CLI test" \
  --tool-arg 'data={"source":"inspector-cli"}'
```
