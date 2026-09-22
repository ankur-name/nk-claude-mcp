/**
 * Shared MCP server + tool registration for stdio and Streamable HTTP.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getApprovalFeedback,
  getOrderResults,
  getRecoHubDomains,
  submitClaudeRecos,
} from "./dashboard.js";
import { DEFAULT_AI_EXPORT_CONTEXT } from "./recoPrompt.js";

export const TOOL_NAMES =
  "get_reco_prompt,get_reco_hub_domains,submit_claude_recos,get_approval_feedback,get_order_results";

export function createNkClaudeServer() {
  const server = new McpServer({
    name: "nk-claude-mcp",
    version: "0.4.0",
  });

  server.registerTool(
    "get_reco_prompt",
    {
      description:
        "Return Claude reco instructions: field glossary, rules, and required JSON output format.",
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(DEFAULT_AI_EXPORT_CONTEXT, null, 2),
        },
      ],
    })
  );

  server.registerTool(
    "get_reco_hub_domains",
    {
      description:
        "Fetch Acquisition Reco Hub rows from NKDashboard (full payload, not domain names only).",
      inputSchema: {
        sourceType: z
          .enum(["ed", "es", "pd", "ltd", "all"])
          .default("ed")
          .describe("Reco Hub mode"),
        tab: z.string().default("ALL").describe("Reco Hub tab"),
        page: z.number().int().min(0).default(0),
        size: z.number().int().min(1).max(50).default(20),
        search: z.string().optional(),
        searchDomains: z.array(z.string()).optional(),
        onlyMine: z.boolean().default(false),
      },
    },
    async (args) => {
      try {
        const data = await getRecoHubDomains(args);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to fetch Reco Hub: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "submit_claude_recos",
    {
      description:
        "Save one Claude reco onto an Acquisition Reco Hub domain. Does not change human reco or approval status.",
      inputSchema: {
        domainId: z.number().describe("AcquShortlistedDomain id"),
        claudeReco: z.number().int().describe("Claude recommended bid (integer)"),
        reasoning: z
          .string()
          .default("")
          .describe("Short reason for the reco"),
      },
    },
    async ({ domainId, claudeReco, reasoning }) => {
      try {
        const data = await submitClaudeRecos([
          { domainId, claudeReco, reasoning: reasoning || undefined },
        ]);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to save Claude recos: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "get_approval_feedback",
    {
      description:
        "Read final APR and aRemark for domains that already have a Claude reco. Use this as feedback before the next reco. overridden is true when APR differs from Claude reco.",
      inputSchema: {
        size: z.number().int().min(1).max(50).default(20),
        searchDomains: z.array(z.string()).optional(),
      },
    },
    async (args) => {
      try {
        const data = await getApprovalFeedback(args);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to fetch approval feedback: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "get_order_results",
    {
      description:
        "Read order and auction outcomes for domains that already have a Claude reco. result is IN_ORDER, ORDER_PLACED, ORDER_MISSED, WON, or LOST.",
      inputSchema: {
        size: z.number().int().min(1).max(50).default(20),
      },
    },
    async (args) => {
      try {
        const data = await getOrderResults(args);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to fetch order results: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
}
