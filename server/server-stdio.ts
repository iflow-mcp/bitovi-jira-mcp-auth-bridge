/**
 * MCP Server - Stdio Transport Entry Point
 * 
 * This entry point provides stdio transport support for the Cascade MCP server.
 * It creates a single MCP server instance and connects it via stdio.
 */

// Redirect console.log to console.error to avoid mixing with JSON-RPC responses
const originalConsoleLog = console.log;
console.log = (...args) => {
  // Only log errors, not regular info
  const message = args.join(' ');
  if (message.includes('Error') || message.includes('error')) {
    originalConsoleLog(...args);
  }
};

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './mcp-core/server-factory.js';
import type { AuthContext, ProviderAuthInfo } from './mcp-core/auth-context-store.js';

async function main() {
  // Create auth context (for stdio, we'll start with empty context)
  // Users will need to provide credentials through environment variables
  const createAtlassianAuth = (): ProviderAuthInfo | undefined => {
    if (!process.env.JIRA_ACCESS_TOKEN) return undefined;
    return {
      access_token: process.env.JIRA_ACCESS_TOKEN,
      refresh_token: process.env.JIRA_REFRESH_TOKEN || '',
      expires_at: process.env.JIRA_EXPIRES_AT ? parseInt(process.env.JIRA_EXPIRES_AT) : Math.floor(Date.now() / 1000) + 3600,
      cloudId: process.env.JIRA_CLOUD_ID
    };
  };
  
  const createFigmaAuth = (): ProviderAuthInfo | undefined => {
    if (!process.env.FIGMA_ACCESS_TOKEN) return undefined;
    return {
      access_token: process.env.FIGMA_ACCESS_TOKEN,
      refresh_token: process.env.FIGMA_REFRESH_TOKEN || '',
      expires_at: process.env.FIGMA_EXPIRES_AT ? parseInt(process.env.FIGMA_EXPIRES_AT) : Math.floor(Date.now() / 1000) + 3600
    };
  };
  
  const createGoogleAuth = (): ProviderAuthInfo | undefined => {
    if (!process.env.GOOGLE_ACCESS_TOKEN) return undefined;
    return {
      access_token: process.env.GOOGLE_ACCESS_TOKEN,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN || '',
      expires_at: process.env.GOOGLE_EXPIRES_AT ? parseInt(process.env.GOOGLE_EXPIRES_AT) : Math.floor(Date.now() / 1000) + 3600
    };
  };
  
  const authContext: AuthContext = {
    sessionId: 'stdio-session',
    atlassian: createAtlassianAuth(),
    figma: createFigmaAuth(),
    google: createGoogleAuth()
  };
  
  // Create MCP server instance
  const server = createMcpServer(authContext);
  
  // Create stdio transport
  const transport = new StdioServerTransport();
  
  // Connect server to transport
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Fatal error starting server:', error);
  process.exit(1);
});