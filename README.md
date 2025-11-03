# Chat Summarizer Agent using Mastra
This project is a Mastra AI Agent that summarizes text or chat conversations using a custom-built summarizer tool.
It supports two summary modes — academic for formal, structured writing and chat for conversational, message-style summaries.

## Features

- Summarizes long texts or chat logs into concise summaries
- Two summary modes:
    - Academic Mode: Produces formal, well-structured summaries (~100–150 words)

    - Chat Mode: Generates casual, conversational summaries

- Built with Mastra Core and Zod for type-safe input validation

- Easy integration with Mastra Agents and Telex.im workflows

- Tested directly inside Mastra Studio

## Setup

To run this project locally, follow these steps:

### Prerequisites

*   Node.js verison 18 upward but (LTS version recommended)
*   npm or yarn

### Environment Variables

You need to set up the following environment variables in a `.env` file in the project root:

*   `GOOGLE_GENERATIVE_AI_API_KEY`: Your API key for Google's Generative AI.
*   `MASTRA_CLOUD_ACCESS_TOKEN`: Your API key for Mastra cloud access token or you will get a gateway error 

Example `.env` file:

```
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key_here
EXA_API_KEY=your_exa_api_key_here
```

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Afaks-11/HNG-Stage3-Ai-Agent-Using-Mastra.git
    cd HNG-Stage3-Ai-Agent-Using-Mastra
    ```
2.  Install the dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

## How to Run Locally

### Development Mode

To run the agent in development mode, which typically involves a Mastra development server:

```bash
npm run dev

### Building the Project

To build the project for production:

```bash
npm run build```

This will compile the TypeScript code into JavaScript, typically outputting to a `dist` directory.

## Project Structure

*   `src/mastra/`: Contains the core Mastra agent definitions.
    *   `index.ts`: Initializes the Mastra application with agents, scorers, and storage.
    *   `agents/`: Defines the AI agents.
        *   `devilAdvocateAgent.ts`: Implements the "Devil's Advocate" agent, including its instructions, model, and tools.
    *   `scorers/`: Contains the custom and built-in scorers for evaluating agent performance.
        *   `devilsAdvocateScorer.ts`: Defines the `toolCallAppropriatenessScorer`, `completenessScorer`, `competitorResearchScorer`, and `criticalAnalysisDepthScorer`.
    *   `tools/`: Defines the tools available to the agents.
        *   `competitorSearchTool.ts`: Implements the `webSearch` tool using Exa for competitor research.