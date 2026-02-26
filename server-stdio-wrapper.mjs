#!/usr/bin/env node
/**
 * Stdio wrapper for Cascade MCP Server
 * This script uses tsx to run TypeScript files directly
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
config();

// Set test mode to silence winston logger
process.env.TEST_MODE = 'true';

// Set default JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'devsecret_change_in_production_test';
}

if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = 'changeme_in_production_test';
}

// Suppress Node.js deprecation warnings
process.noDeprecation = true;

// Use npx tsx to run the TypeScript file
const serverPath = join(__dirname, './server/server-stdio.ts');

const child = spawn('npx', ['tsx', serverPath], {
  stdio: ['inherit', 'inherit', 'inherit'],
  env: {
    ...process.env,
    TEST_MODE: 'true',
    JWT_SECRET: process.env.JWT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET
  },
  shell: true
});

child.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});