import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const DIST_DIR = import.meta.filename.endsWith(".ts")
  ? path.join(import.meta.dirname, "dist")
  : import.meta.dirname;

export function createServer(): McpServer {
  const server = new McpServer({
    name: "Color Picker MCP App",
    version: "1.0.0",
  });

  const resourceUri = "ui://color-picker/mcp-app.html";

  registerAppTool(
    server,
    "color-picker",
    {
      title: "Color Picker",
      description:
        "Opens an interactive color picker UI. The user can select any color and the chosen hex, RGB, and HSL values are sent back to the conversation.",
      inputSchema: {
        initialColor: z
          .string()
          .regex(/^#[0-9a-fA-F]{6}$/)
          .optional()
          .describe("Optional initial color as a hex string (e.g. #ff6600)"),
      },
      outputSchema: z.object({
        message: z.string(),
      }),
      _meta: { ui: { resourceUri } },
    },
    async (args): Promise<CallToolResult> => {
      const initial = args.initialColor ?? "#3b82f6";
      return {
        content: [
          {
            type: "text",
            text: `Color picker opened with initial color ${initial}. The user will select a color from the interactive UI.`,
          },
        ],
        structuredContent: { message: `Color picker opened. Initial color: ${initial}` },
      };
    },
  );

  registerAppResource(
    server,
    resourceUri,
    resourceUri,
    { mimeType: RESOURCE_MIME_TYPE },
    async (): Promise<ReadResourceResult> => {
      const html = await fs.readFile(path.join(DIST_DIR, "mcp-app.html"), "utf-8");
      return {
        contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
      };
    },
  );

  return server;
}
