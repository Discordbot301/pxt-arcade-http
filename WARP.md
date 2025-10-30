# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **MakeCode Arcade extension** that provides HTTP GET and POST functionality for MakeCode Arcade projects. It's designed to work in the web simulator via the browser's `fetch` API.

**Key constraint**: On hardware without networking support, HTTP requests fail gracefully (handlers receive status 0 and empty body).

## Architecture

### Single-File Extension
This extension consists of a single TypeScript file (`main.ts`) that defines the `http` namespace with both synchronous (callback-based) and asynchronous (Promise-based) HTTP methods.

### API Design Pattern
The extension follows a dual-interface pattern:
- **Block/callback functions** (`get`, `post`): For use in MakeCode's visual block editor and simplified TypeScript
- **Async functions** (`getAsync`, `postAsync`): For advanced Promise-based workflows

All methods gracefully handle environments without `fetch` support by catching errors and returning status 0 with an empty body.

### MakeCode Block Annotations
The code uses special JSDoc-style annotations for MakeCode integration:
- `//% block`: Defines the visual block text and parameter mapping
- `//% color`: Sets the extension color in the MakeCode toolbox
- `handlerStatement=1`: Marks parameters as statement handlers in blocks
- `weight`: Controls block ordering in the toolbox

## Development

### MakeCode Extension Manifest
The `pxt.json` file defines:
- Extension metadata (name, version, description)
- Dependencies (only `arcade`)
- Supported targets (only `arcade`)
- Source files to include

### Testing
This extension has no automated test files (`testFiles` is empty in `pxt.json`). Testing is done manually in the MakeCode Arcade editor.

To test changes:
1. Load the extension in MakeCode Arcade using "Import URL" or local development
2. Test in the web simulator (where `fetch` is available)
3. Verify graceful degradation behavior on hardware without networking

### Modifying the Extension
When making changes:
- Update `version` in `pxt.json` following semver conventions
- Ensure block annotations remain valid if modifying function signatures
- Maintain backward compatibility with existing MakeCode projects using this extension
- Test both callback-based and async function variants
- Verify error handling for unsupported environments

### Platform Support
- **Web simulator**: Full support via browser's `fetch` API
- **Physical hardware**: Depends on device networking capabilities; extension fails gracefully if unsupported
