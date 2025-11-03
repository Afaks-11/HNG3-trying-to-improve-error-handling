import { registerApiRoute } from "@mastra/core/server";
import { randomUUID } from "crypto";

export const a2aAgentRoute = registerApiRoute("/a2a/agent/:agentId", {
  method: "POST",
  handler: async (c) => {
    let requestBody: any;

    try {
      const mastra = c.get("mastra");
      const agentId = c.req.param("agentId");

      // Parse request body and store it in a variable accessible in catch block
      requestBody = await c.req.json();

      // Log for debugging
      console.log(
        "Received A2A request:",
        JSON.stringify(requestBody, null, 2)
      );

      // Validate JSON-RPC 2.0 format with better error handling
      if (!requestBody || requestBody.jsonrpc !== "2.0") {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestBody?.id || null,
            error: {
              code: -32600,
              message: "Invalid Request: jsonrpc must be '2.0'",
            },
          },
          400
        );
      }

      const { id: requestId, method, params } = requestBody;

      // Get agent
      const agent = mastra.getAgent(agentId);
      if (!agent) {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestId,
            error: {
              code: -32601,
              message: `Agent '${agentId}' not found`,
            },
          },
          404
        );
      }

      // Extract task data from params
      const { task } = params || {};
      if (!task) {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestId,
            error: {
              code: -32602,
              message: "Missing required parameter: task",
            },
          },
          400
        );
      }

      const { contextId, id: taskId, history = [] } = task;

      // Extract messages from history
      const messages = history
        .filter((item: any) => item.kind === "message")
        .map((msg: any) => ({
          role: msg.role,
          content:
            msg.parts
              ?.map((part: any) => {
                if (part.kind === "text") return part.text;
                if (part.kind === "data") return JSON.stringify(part.data);
                return "";
              })
              .join("\n") || "",
        }));

      if (messages.length === 0) {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestId,
            error: {
              code: -32602,
              message: "No messages found in history",
            },
          },
          400
        );
      }

      // Execute agent
      const response = await agent.generate(messages);
      const agentText = response.text || "I've processed your request.";

      // Create A2A-compliant response
      const responseMessage = {
        kind: "message",
        role: "agent",
        parts: [{ kind: "text", text: agentText }],
        messageId: randomUUID(),
      };

      const result = {
        jsonrpc: "2.0",
        id: requestId,
        result: {
          task: {
            id: taskId || randomUUID(),
            contextId: contextId || randomUUID(),
            kind: "task",
            status: {
              state: "completed",
              timestamp: new Date().toISOString(),
            },
            history: [...history, responseMessage],
          },
        },
      };

      console.log("Sending A2A response:", JSON.stringify(result, null, 2));
      return c.json(result);
    } catch (error: any) {
      console.error("A2A endpoint error:", error);

      return c.json(
        {
          jsonrpc: "2.0",
          id: requestBody?.id || null,
          error: {
            code: -32603,
            message: "Internal error",
            data: {
              details: error.message,
              stack:
                process.env.NODE_ENV === "development"
                  ? error.stack
                  : undefined,
            },
          },
        },
        500
      );
    }
  },
});
