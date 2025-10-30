# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **MakeCode Arcade extension** that provides HTTP GET and POST functionality for MakeCode Arcade projects, with built-in Discord webhook integration. It's designed to work in the web simulator via the browser's `fetch` API.

**Key constraint**: On hardware without networking support, HTTP requests fail gracefully (handlers receive status 0 and empty body).

**Primary use case**: Send game events, account creation requests, and notifications to Discord channels via webhooks.

## Architecture

### Single-File Extension
This extension consists of a single TypeScript file (`main.ts`) that defines the `http` namespace with both synchronous (callback-based) and asynchronous (Promise-based) HTTP methods.

### API Design Pattern
The extension follows a dual-interface pattern:
- **Block/callback functions** (`get`, `post`, `discordSendMessage`, `discordSendEmbed`, `discordSendRequest`): For use in MakeCode's visual block editor and simplified TypeScript
- **Async functions** (`getAsync`, `postAsync`, `discordSendMessageAsync`, etc.): For advanced Promise-based workflows

All methods gracefully handle environments without `fetch` support by catching errors and returning status 0 with an empty body.

### Discord Webhook Integration
Three levels of Discord webhook functionality:
1. **Simple messages** (`discordSendMessage`): Plain text messages
2. **Rich embeds** (`discordSendEmbed`): Formatted messages with title, description, and color
3. **Structured requests** (`discordSendRequest`): Pre-formatted embeds for account creation or similar requests with username, email, and request type fields

All Discord functions return HTTP status codes (204 = success for Discord webhooks).

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
