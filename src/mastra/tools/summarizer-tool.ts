// import { createTool } from "@mastra/core/tools";
// import { z } from "zod";

// export const summarizerTool = createTool({
//   id: "summarize-text",
//   description:
//     "Summarize chat or academic text into short, concise summaries. Choose between 'academic' or 'chat' mode.",

//   inputSchema: z.object({
//     messages: z
//       .array(z.string())
//       .describe("An array of messages or paragraphs to summarize."),
//     mode: z
//       .enum(["academic", "chat"])
//       .default("academic")
//       .describe(
//         "Select summary style: 'academic' for formal tone or 'chat' for conversational tone."
//       ),
//   }),

//   outputSchema: z.object({
//     summary: z.string().describe("The summarized version of the messages."),
//   }),

//   execute: async ({ context }) => {
//     try {
//       const { messages, mode } = context;

//       if (!messages || messages.length === 0) {
//         throw new Error("No messages provided for summarization.");
//       }

//       const text = messages.join(" ").trim();

//       if (text.length <= 10) {
//         return { summary: text };
//       }

//       // Basic summarization
//       const sentences = text.split(/[.!?]\s+/).filter(Boolean);
//       const selected = [
//         sentences[0],
//         sentences[Math.floor(sentences.length / 2)],
//         sentences[sentences.length - 1],
//       ]
//         .filter(Boolean)
//         .join(". ");

//       const words = selected.split(" ");
//       let summary = words.slice(0, 100).join(" ");
//       if (words.length > 100) summary += "...";

//       if (mode === "chat") summary = "Here’s a quick summary:\n" + summary;

//       return { summary: summary.trim() };
//     } catch (error: any) {
//       // Throw an error with extra details
//       throw new Error(
//         `[SummarizerTool Error] ${error.message || "Internal server error"}`
//       );
//     }
//   }

// });

import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const summarizerTool = createTool({
  id: "summarize-text",
  description: "Summarize text content in either academic or chat mode",

  inputSchema: z.object({
    text: z.string().describe("The text content to summarize"),
    mode: z
      .enum(["academic", "chat"])
      .default("chat")
      .describe("Summary style: 'academic' for formal, 'chat' for casual"),
  }),

  outputSchema: z.object({
    summary: z.string().describe("The summarized version of the text"),
    originalLength: z.number().describe("Original text length in characters"),
    summaryLength: z.number().describe("Summary length in characters"),
    reduction: z.number().describe("Reduction percentage"),
  }),

  execute: async ({ context }) => {
    try {
      const { text, mode } = context;

      if (!text || text.trim().length === 0) {
        throw new Error("No text provided for summarization");
      }

      const originalText = text.trim();
      const originalLength = originalText.length;

      // Simple summarization logic - you might want to use an AI model here
      const sentences = originalText
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 0);

      let summary = "";

      if (sentences.length <= 2) {
        // For very short text, just return as is
        summary = originalText;
      } else {
        // Take first, middle, and last sentences for basic summarization
        const firstSentence = sentences[0];
        const middleSentence = sentences[Math.floor(sentences.length / 2)];
        const lastSentence = sentences[sentences.length - 1];

        summary =
          [firstSentence, middleSentence, lastSentence]
            .filter(Boolean)
            .join(". ") + ".";
      }

      // Add mode-specific formatting
      if (mode === "chat") {
        summary = `Here's the summary: ${summary}`;
      }

      const summaryLength = summary.length;
      const reduction = Math.round(
        ((originalLength - summaryLength) / originalLength) * 100
      );

      return {
        summary,
        originalLength,
        summaryLength,
        reduction: Math.max(0, reduction), // Ensure non-negative
      };
    } catch (error: any) {
      throw new Error(`Summarization failed: ${error.message}`);
    }
  },
});
