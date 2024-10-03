import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import pluginQuery from "@tanstack/eslint-plugin-query";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
	{ ignores: ["dist"] },
	{
		extends: [js.configs.recommended, ...pluginQuery.configs["flat/recommended"], ...tseslint.configs.recommended],
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			"unused-imports": unusedImports,
			"simple-import-sort": simpleImportSort,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
			"no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"warn",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],

			"sort-imports": "off",
			"simple-import-sort/imports": [
				"error",
				{
					groups: [
						// Packages `@astrojs` related packages come first.
						["^react", String.raw`^@?\w`],
						// Side effect imports.
						[String.raw`^\u0000`],
						//Type imports
						[String.raw`^.*\u0000$`],
						// Parent imports. Put `..` last.
						[String.raw`^\.\.(?!/?$)`, String.raw`^\.\./?$`],
						// Other relative imports. Put same-folder imports and `.` last.
						[String.raw`^\./(?=.*/)(?!/?$)`, String.raw`^\.(?!/?$)`, String.raw`^\./?$`],
						// Style imports.
						[String.raw`^.+\.?(css)$`],
					],
				},
			],
			"simple-import-sort/exports": "error",
		},
	},
);
