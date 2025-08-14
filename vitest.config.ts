import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
	test: {
		environment: "happy-dom",
		setupFiles: ["./vitest.setup.ts"],
		globals: true,
		include: ["tests/**/*.{test,spec}.{ts,tsx}"],
		coverage: {
			enabled: false,
			reporter: ["text", "html"],
		},
	},
	resolve: {
		alias: [{ find: /^@\//, replacement: path.resolve(__dirname, "./") + "/" }],
	},
});
