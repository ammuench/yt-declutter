import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		outDir: "dist/firefox",
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
						JSON.parse(
							require("node:fs").readFileSync("manifest-firefox.json", "utf8"),
						),
						null,
						2,
					),
				});
				// Copy CSS
				this.emitFile({
					type: "asset",
					fileName: "content.css",
					source: require("node:fs").readFileSync("src/content.css", "utf8"),
				});
				// Copy icons
				const iconSizes = ["16", "48", "128"];
				for (const size of iconSizes) {
					this.emitFile({
						type: "asset",
						fileName: `icon-${size}.png`,
						source: require("node:fs").readFileSync(`icons/icon-${size}.png`),
					});
				}
			},
		},
	],
});
