/**
 * Streamable HTTP MCP (stateless) — Coolify / remote Claude Desktop.
 * Protect with MCP_AUTH_TOKEN Bearer when set (required in production).
 */
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { createNkClaudeServer, TOOL_NAMES } from "./createServer.js";

function unauthorized(res) {
  res.status(401).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Unauthorized" },
    id: null,
  });
}

function checkAuth(req, res) {
  const expected = (process.env.MCP_AUTH_TOKEN || "").trim();
  if (!expected) {
    // Fail closed on HTTP: public MCP without a secret is unsafe.
    process.stderr.write(
      "[nk-claude-mcp] MCP_AUTH_TOKEN is not set — refusing HTTP requests\n"
    );
    unauthorized(res);
    return false;
  }
  const header = req.headers.authorization || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (token !== expected) {
    unauthorized(res);
    return false;
  }
  return true;
}

async function handleMcpPost(req, res) {
  if (!checkAuth(req, res)) return;

  const server = createNkClaudeServer();
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    res.on("close", () => {
      transport.close().catch(() => {});
      server.close().catch(() => {});
    });
  } catch (error) {
    process.stderr.write(
      `[nk-claude-mcp] HTTP MCP error: ${error instanceof Error ? error.message : String(error)}\n`
    );
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
}

function methodNotAllowed(res) {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed." },
    id: null,
  });
}

export async function startHttpServer() {
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || "0.0.0.0";
  const app = createMcpExpressApp({ host });

  app.get("/health", (_req, res) => {
    res.status(200).json({
      ok: true,
      name: "nk-claude-mcp",
      transport: "streamable-http",
      tools: TOOL_NAMES.split(","),
    });
  });

  app.post("/mcp", handleMcpPost);
  app.get("/mcp", (_req, res) => methodNotAllowed(res));
  app.delete("/mcp", (_req, res) => methodNotAllowed(res));

  await new Promise((resolve, reject) => {
    const server = app.listen(port, host, (err) => {
      if (err) reject(err);
      else resolve(server);
    });
  });

  process.stderr.write(
    `[nk-claude-mcp] streamable-http listening on http://${host}:${port}/mcp tools=${TOOL_NAMES}\n`
  );
}
