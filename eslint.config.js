import sharedConfig from "@dpa-id-components/dpa-shared-components/eslintConfig";
import { globalIgnores } from "eslint/config";

export default [
  {
    files: ["**/*.{ts,vue}"],
  },
  globalIgnores([
    "**/dist/",
    "**/coverage/",
    "**/infrastructure/**/*.{js,d.ts}",
  ]),
  ...sharedConfig,
  {
    settings: {
      "better-tailwindcss": {
        // The CSS entry point has to be manually configured in each host project.
        entryPoint: "src/assets/main.css",
      },
    },
    rules: {
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
