import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	build: {
		outDir: "dist/chrome",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				content: resolve(__dirname, "src/content.ts"),
			},
			output: {
				entryFileNames: "[name].js",
				format: "iife",
			},
		},
	},
	plugins: [
		{
			name: "copy-files",
			generateBundle() {
				// Copy manifest
				this.emitFile({
					type: "asset",
					fileName: "manifest.json",
					source: JSON.stringify(
						JSON.parse(readFileSync("manifest-chrome.json", "utf8")),
						null,
						2,
					),
				});
				// Copy CSS
				this.emitFile({
					type: "asset",
					fileName: "content.css",
					source: readFileSync("src/content.css", "utf8"),
				});
				// Copy icons
				const iconSizes = ["16", "48", "128"];
				for (const size of iconSizes) {
					this.emitFile({
						type: "asset",
						fileName: `icon-${size}.png`,
						source: readFileSync(`icons/icon-${size}.png`),
					});
				}
			},
		},
	],
});
