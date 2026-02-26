#!/usr/bin/env node
/**
 * Stdio wrapper for Cascade MCP Server
 * This script loads the TypeScript file using the ts-node loader
 */

import { createRequire } from 'node:module';
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

// Get the directory where this script is located
const require = createRequire(import.meta.url);
const tsNodePath = require.resolve('ts-node/esm');
const tsNodeDir = tsNodePath.substring(0, tsNodePath.lastIndexOf('/'));

// Register TypeScript loader with explicit path
import { register } from "node:module";
register("ts-node/esm", pathToFileURL(tsNodeDir));

// Import and run the actual server
await import("./server/server-stdio.ts");