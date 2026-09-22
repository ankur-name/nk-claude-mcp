#!/usr/bin/env node
/**
 * NKDEV-894 MCP server — Acquisition Reco Hub ↔ Claude pipe.
 *
 * MCP_TRANSPORT=stdio (default) — Cursor / local Claude Desktop
 * MCP_TRANSPORT=http — Streamable HTTP for Coolify / remote clients
 */
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createNkClaudeServer, TOOL_NAMES } from "./createServer.js";
import { startHttpServer } from "./httpServer.js";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(rootDir, "..", ".env") });

const transportMode = String(process.env.MCP_TRANSPORT || "stdio")
  .trim()
  .toLowerCase();

if (transportMode === "http" || transportMode === "streamable-http") {
  await startHttpServer();
} else {
  const server = createNkClaudeServer();
  process.stderr.write(
    `[nk-claude-mcp] ready transport=stdio tools=${TOOL_NAMES}\n`
  );
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
