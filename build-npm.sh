#!/bin/bash
# Build script for npm package
# This compiles TypeScript to JavaScript in the dist directory

set -e

echo "Building Cascade MCP npm package..."

# Clean dist directory
rm -rf dist/server
mkdir -p dist/server

# Compile TypeScript with noEmit=false for server files
npx tsc \
  --outDir dist \
  --rootDir . \
  --moduleResolution node \
  --module ESNext \
  --target ES2022 \
  --esModuleInterop \
  --skipLibCheck \
  --noEmit false \
  server/**/*.ts

echo "Build complete!"
