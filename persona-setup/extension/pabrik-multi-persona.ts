/**
 * Pabrik Multi-Persona Extension
 *
 * Provides the `talk_to_ceo` tool for CEO-CEO communication
 * within the Pabrik Startup ecosystem.
 *
 * Usage:
 *   talk_to_ceo({
 *     target: "notifyhub",
 *     message: "Bug: Alert returns 500 on high traffic",
 *     type: "bug"
 *   })
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { spawn } from "node:child_process";
import * as path from "node:path";
import * as os from "node:os";

const PERSONAS_DIR = path.join(os.homedir(), ".pi", "agent", "personas");
const RPC_TIMEOUT_MS = 120000; // 2 minutes timeout for sub-agent response

interface TalkToCEOParams {
  target: string;
  message: string;
  type?: "bug" | "feature" | "question";
}

interface RPCRequest {
  jsonrpc: "2.0";
  method: string;
  params: Record<string, unknown>;
  id: number;
}

interface RPCResponse {
  jsonrpc: "2.0";
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
  id: number;
}

/**
 * Get list of available personas
 */
function getAvailablePersonas(): string[] {
  const fs = require("node:fs");
  try {
    const dirs = fs.readdirSync(PERSONAS_DIR, { withFileTypes: true });
    return dirs
      .filter((d: { isDirectory: () => boolean; name: string }) => d.isDirectory() && !d.name.startsWith("_"))
      .map((d: { name: string }) => d.name);
  } catch {
    return [];
  }
}

/**
 * Check if a persona exists
 */
function personaExists(name: string): boolean {
  const fs = require("node:fs");
  const personaPath = path.join(PERSONAS_DIR, name);
  const agentsFile = path.join(personaPath, "AGENTS.md");
  return fs.existsSync(personaPath) && fs.existsSync(agentsFile);
}

/**
 * Build customer support message prefix
 */
function buildMessagePrefix(type: string | undefined, requesterInfo?: string): string {
  const typeLabel = type ? `[${type.toUpperCase()}]` : "[INQUIRY]";
  const fromLabel = requesterInfo ? `from ${requesterInfo}` : "";
  return `${typeLabel} ${fromLabel}`.trim();
}

/**
 * Execute RPC call to sub-agent
 */
async function executeSubAgentRPC(
  targetPersona: string,
  message: string,
  type: string | undefined,
  signal?: AbortSignal
): Promise<{ success: boolean; response?: string; error?: string }> {
  return new Promise((resolve) => {
    const personaPath = path.join(PERSONAS_DIR, targetPersona);
    const timeout = setTimeout(() => {
      child.kill();
      resolve({ success: false, error: `Sub-agent timeout after ${RPC_TIMEOUT_MS}ms` });
    }, RPC_TIMEOUT_MS);

    // Spawn Pi in RPC mode with target persona
    const child = spawn("pi", ["--mode", "rpc"], {
      cwd: personaPath,
      env: {
        ...process.env,
        // Ensure Pi uses the persona's directory
        PI_CODING_AGENT_DIR: personaPath,
      },
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdoutBuffer = "";
    let stderrBuffer = "";
    let responseReceived = false;

    // Handle abort signal
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        child.kill();
        resolve({ success: false, error: "Aborted by user" });
      });
    }

    child.stdout?.on("data", (data: Buffer) => {
      stdoutBuffer += data.toString();

      // Try to parse complete JSON responses
      const lines = stdoutBuffer.split("\n");
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const response: RPCResponse = JSON.parse(line);
          if (response.result !== undefined && !responseReceived) {
            responseReceived = true;
            clearTimeout(timeout);
            child.kill();

            // Extract text from response
            const result = response.result as { text?: string; content?: string };
            const responseText = result.text || result.content || JSON.stringify(result);
            resolve({ success: true, response: responseText });
          }
        } catch {
          // Not a complete JSON yet, continue buffering
        }
      }
    });

    child.stderr?.on("data", (data: Buffer) => {
      stderrBuffer += data.toString();
    });

    child.on("error", (err: Error) => {
      clearTimeout(timeout);
      resolve({ success: false, error: `Failed to spawn sub-agent: ${err.message}` });
    });

    child.on("close", (code: number) => {
      clearTimeout(timeout);
      if (!responseReceived) {
        if (code !== 0) {
          resolve({
            success: false,
            error: `Sub-agent exited with code ${code}: ${stderrBuffer}`,
          });
        } else {
          resolve({ success: false, error: "Sub-agent closed without response" });
        }
      }
    });

    // Wait for Pi to be ready, then send the message
    setTimeout(() => {
      const prefix = buildMessagePrefix(type, "fellow CEO");
      const fullMessage = `${prefix}\n\n${message}`;

      const request: RPCRequest = {
        jsonrpc: "2.0",
        method: "prompt",
        params: { text: fullMessage },
        id: 1,
      };

      child.stdin?.write(JSON.stringify(request) + "\n");
    }, 2000); // Wait 2 seconds for Pi to initialize
  });
}

export default function (pi: ExtensionAPI) {
  // Notify on load
  pi.on("session_start", async (_event, ctx) => {
    const personas = getAvailablePersonas();
    ctx.ui.notify(
      `Pabrik Multi-Persona loaded. Available personas: ${personas.join(", ") || "none"}`,
      "info"
    );
  });

  // Register talk_to_ceo tool
  pi.registerTool({
    name: "talk_to_ceo",
    label: "Talk to CEO",
    description: `Spawn a sub-agent to talk to another CEO for customer support/feedback.

Use this when:
- You're not satisfied with another Pabrik company's app
- You want to report a bug
- You want to request a feature
- You have questions about another company's product

The target CEO will log your issue and respond. Bug fixes happen later, not in real-time.

Available personas can be found in ~/.pi/agent/personas/`,
    parameters: Type.Object({
      target: Type.String({
        description: "Target CEO persona name (e.g., 'notifyhub', 'paygate')",
      }),
      message: Type.String({
        description: "Your message to the CEO - describe the issue or question clearly",
      }),
      type: Type.Optional(
        Type.Union(
          [Type.Literal("bug"), Type.Literal("feature"), Type.Literal("question")],
          { description: "Type of inquiry: bug, feature, or question (default: question)" }
        )
      ),
    }),

    async execute(toolCallId, params, signal, onUpdate, ctx) {
      const { target, message, type } = params as TalkToCEOParams;

      // Validate target
      if (!target || target.trim() === "") {
        return {
          content: [{ type: "text", text: "Error: target persona name is required" }],
          isError: true,
        };
      }

      const targetName = target.trim().toLowerCase();

      // Check if target exists
      if (!personaExists(targetName)) {
        const available = getAvailablePersonas();
        return {
          content: [
            {
              type: "text",
              text: `Error: Persona "${targetName}" not found.\n\nAvailable personas: ${available.join(", ") || "none"}\n\nCreate new personas in ~/.pi/agent/personas/`,
            },
          ],
          isError: true,
        };
      }

      // Update progress
      onUpdate?.({
        content: [{ type: "text", text: `Connecting to CEO ${targetName}...` }],
      });

      // Execute sub-agent RPC
      const result = await executeSubAgentRPC(targetName, message, type, signal);

      if (!result.success) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to connect to CEO ${targetName}: ${result.error}`,
            },
          ],
          isError: true,
          details: { target: targetName, error: result.error },
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Response from CEO ${targetName}:\n\n${result.response}`,
          },
        ],
        details: { target: targetName, type: type || "question" },
      };
    },

    // Custom rendering
    renderCall(args, theme) {
      const target = args.target || "unknown";
      const type = args.type || "question";
      let text = theme.fg("toolTitle", theme.bold("talk_to_ceo "));
      text += theme.fg("accent", target);
      text += theme.fg("muted", ` (${type})`);
      return { text };
    },

    renderResult(result, options, theme) {
      if (result.isError) {
        return { text: theme.fg("error", `✗ ${result.content?.[0]?.text || "Error"}`) };
      }
      const target = result.details?.target || "unknown";
      return { text: theme.fg("success", `✓ Response received from CEO ${target}`) };
    },
  });

  // Register /personas command
  pi.registerCommand("personas", {
    description: "List all available personas",
    handler: async (_args, ctx) => {
      const personas = getAvailablePersonas();
      if (personas.length === 0) {
        ctx.ui.notify("No personas found. Create one in ~/.pi/agent/personas/", "warning");
        return;
      }
      ctx.ui.notify(`Available personas:\n${personas.map((p) => `  • ${p}`).join("\n")}`, "info");
    },
  });

  // Register /persona command
  pi.registerCommand("persona", {
    description: "Show current persona info or switch context",
    getArgumentCompletions: (prefix: string) => {
      const personas = getAvailablePersonas();
      const filtered = personas.filter((p) => p.startsWith(prefix.toLowerCase()));
      return filtered.map((p) => ({ value: p, label: p }));
    },
    handler: async (args, ctx) => {
      if (!args || args.trim() === "") {
        // Show current persona info
        const cwd = ctx.cwd;
        const personasDir = PERSONAS_DIR;
        if (cwd.startsWith(personasDir)) {
          const relative = path.relative(personasDir, cwd);
          const personaName = relative.split(path.sep)[0];
          ctx.ui.notify(`Current persona: ${personaName}`, "info");
        } else {
          ctx.ui.notify("Not in a persona directory. Use 'pi-persona <name>' to switch.", "info");
        }
        return;
      }

      // Switch to persona (just show info, actual switch needs restart)
      const targetName = args.trim().toLowerCase();
      if (!personaExists(targetName)) {
        ctx.ui.notify(`Persona "${targetName}" not found.`, "error");
        return;
      }

      ctx.ui.notify(
        `To switch to ${targetName}, run:\n  PI_CODING_AGENT_DIR=~/.pi/agent/personas/${targetName} pi`,
        "info"
      );
    },
  });
}
