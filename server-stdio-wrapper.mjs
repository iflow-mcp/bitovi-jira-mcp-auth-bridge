#!/usr/bin/env node
/**
 * Stdio wrapper for Cascade MCP Server
 * This script loads the TypeScript file using the ts-node loader
 */

import { register } from "node:module";
import { pathToFileURL } from "node:url";
import { config } from "dotenv";

// Set test mode to silence winston logger
process.env.TEST_MODE = 'true';

// Suppress Node.js deprecation warnings
process.noDeprecation = true;

// Redirect all console output to stderr to avoid mixing with JSON-RPC responses
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

console.log = (...args) => process.stderr.write(args.join(' ') + '\n');
console.warn = (...args) => process.stderr.write(args.join(' ') + '\n');
console.info = (...args) => process.stderr.write(args.join(' ') + '\n');

// Load environment variables first
config();

// Register TypeScript loader
register("ts-node/esm", pathToFileURL("./"));

// Import and run the actual server
await import("./server/server-stdio.ts");