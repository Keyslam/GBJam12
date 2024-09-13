import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
	{
		files: ["src**/*.ts"],
		rules: {
			"@typescript-eslint/strict-boolean-expressions": "error",
			eqeqeq: ["error", "always"],
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
];
