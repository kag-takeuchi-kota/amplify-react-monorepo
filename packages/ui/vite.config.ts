import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, esmExternalRequirePlugin } from "vite";
import dts from "vite-plugin-dts";
import packagejson from "./package.json";

export default defineConfig({
	plugins: [
		react({}),
		tailwindcss({}),
		dts({
			tsconfigPath: "tsconfig.app.json",
		}),
	],
	build: {
		lib: {
			entry: "src/index.ts",
			name: "ui",
			formats: ["es", "cjs"],
			fileName(format, entryName) {
				switch (format) {
					case "es":
						return `${entryName}.mjs`;
					case "cjs":
						return `${entryName}.cjs`;
					default:
						return `${entryName}.${format}.js`;
				}
			},
		},
		rolldownOptions: {
			plugins: [
				esmExternalRequirePlugin({
					external: Object.keys(packagejson.peerDependencies ?? {}),
				}),
			],
		},
	},
});
