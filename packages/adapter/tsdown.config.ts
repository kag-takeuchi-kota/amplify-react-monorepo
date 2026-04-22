import { defineConfig } from "tsdown";

export default defineConfig({
	inputOptions: {
		input: "src/index.ts",
	},
	outDir: "dist",
	format: ["esm"],
	outExtensions: () => ({
		js: ".mjs",
		dts: ".ts",
	}),
	dts: {
		enabled: true,
		tsconfig: "tsconfig.app.json",
		entry: "src/index.ts",
	},
});
