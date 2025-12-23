# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser extension for Firefox and Chrome that hides unwanted content on YouTube. The extension uses a content script with CSS to hide dismissible elements on YouTube pages.

## Development Commands

### Building
- `pnpm build` - Build both Firefox and Chrome versions
- `pnpm build:firefox` - Build Firefox version only (outputs to `dist/firefox`)
- `pnpm build:chrome` - Build Chrome version only (outputs to `dist/chrome`)
- `pnpm dev` - Build Firefox version in watch mode for development
- `pnpm clean` - Remove dist directory

### Testing
- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:ui` - Run tests with Vitest UI
- `pnpm check-types` - Type check without emitting files

### Linting
- `biome check --write .` - Format and lint all files (runs automatically via pre-commit hook)

### Running Extension
- `pnpm dev:firefox` - Run extension in Firefox with web-ext (opens YouTube)

## Architecture

### Build System
The project uses Vite with separate configurations for each browser:
- `vite.config.firefox.ts` - Firefox build (Manifest V2, outputs to `dist/firefox`)
- `vite.config.chrome.ts` - Chrome build (Manifest V3, outputs to `dist/chrome`)

Both configs use a custom Vite plugin that:
1. Bundles `src/content.ts` as an IIFE
2. Copies the browser-specific manifest (`manifest-firefox.json` or `manifest-chrome.json`) to `dist/{browser}/manifest.json`
3. Copies `src/content.css` to the dist directory

### Source Files
All source code is in the `src/` directory:
- `src/content.ts` - Main content script with core functionality
- `src/content.css` - Styles for hiding elements
- `src/content.test.ts` - Vitest tests

### Content Script Logic
The extension's main functionality is in `src/content.ts`:
- `hideJunkContent()` - Queries and hides elements matching selectors
- `observeChanges()` - Sets up MutationObserver to handle YouTube's dynamic content loading
- `init()` - Entry point that runs on page load

The content script uses debounced mutation observation to handle YouTube's SPA architecture efficiently.

### TypeScript
- Uses strict TypeScript with Chrome extension types (`@types/chrome`)
- Global type extensions are in `global.d.ts` (e.g., `Window.hideJunkTimeout`)

### Code Quality
- Biome for formatting and linting (tab indentation, double quotes)
- Husky pre-commit hook runs lint-staged
- lint-staged runs `biome check --write .` on staged files
- All tests use Vitest with jsdom environment
