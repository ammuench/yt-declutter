<img src="icons/icon-1000.png" alt="YT Declutter Icon" width="128" height="128">

# YT Declutter

A lightweight browser extension for Firefox and Chrome that declutters YouTube by automatically hiding unwanted recommendation content.

## Features

- Automatically removes dismissible recommendation shelves and unwanted content
- Works when scrolling and adding new content
- That's it

## Installation

### From Extension Stores

**Firefox Add-ons:** https://addons.mozilla.org/en-CA/firefox/addon/yt-declutter-er/

**Chrome Web Store:** [Coming soon]

### Manual Installation

**Firefox:**
1. Download the latest release and extract
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on" and select `manifest.json` from `dist/firefox/`

**Chrome:**
1. Download the latest release and extract
2. Navigate to `chrome://extensions` and enable "Developer mode"
3. Click "Load unpacked" and select the `dist/chrome/` directory

## How It Works

The extension uses a content script that hides unwanted elements on page load and monitors DOM changes with a MutationObserver to handle YouTube's dynamic content. It marks hidden elements to avoid reprocessing and debounces operations for optimal performance

## Development

**Prerequisites:** Node.js and pnpm 10.14.0+

**Setup:**
```bash
pnpm install
pnpm build
pnpm dev:firefox
# Rerun `pnpm build` in dev mode to see changes updated
```

**Common Commands:**
- `pnpm build` - Build both browsers
- `pnpm dev` - Watch mode for Firefox
- `pnpm dev:firefox` - Run extension in Firefox (opens YouTube)
- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `biome check --write .` - Format and lint (runs on commit)

**Tech Stack:** TypeScript, Vite, Vitest, Biome

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contributing

Contributions welcome! Feel free to submit a Pull Request.

If there are new selectors or targets to add, please feel to create an [issue](https://github.com/ammuench/yt-declutter/issues) and I'll update it
