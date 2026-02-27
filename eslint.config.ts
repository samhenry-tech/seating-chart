import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { eslintConfig } from "@samhenrytech/eslint-config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  ...eslintConfig,

  // JavaScript and TypeScript files
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow Vite virtual modules like `virtual:pwa-register` to resolve via Vite,
      // not the filesystem, so `import/no-unresolved` doesn't flag them.
      "import/no-unresolved": [
        "error",
        {
          ignore: ["^virtual:"],
        },
      ],
    },
  },
];
