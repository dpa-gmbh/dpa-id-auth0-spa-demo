import sharedConfig from "@dpa-id-components/dpa-shared-components/eslintConfig";
import { globalIgnores } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  {
    files: ["**/*.ts", "**/*.mts", "**/*.vue"],
  },
  globalIgnores([
    "**/dist/",
    "**/coverage/",
    "**/infrastructure/**/*.{js,d.ts}",
  ]),
  ...sharedConfig,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    settings: {
      "better-tailwindcss": {
        // The CSS entry point has to be manually configured in each host project.
        entryPoint: "src/assets/main.css",
      },
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "vue/no-undef-components": [
        "error",
        {
          ignorePatterns: [
            // vue-i18n
            "i18n-t",

            // vue-router
            "RouterLink",
            "RouterView",
          ],
        },
      ],
    },
  },
];
