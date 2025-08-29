import sharedConfig from "@dpa-id-components/dpa-shared-components/eslintConfig";
import { globalIgnores } from "eslint/config";

export default [
  {
    files: ["**/*.ts", "**/*.mts", "**/*.vue"],
  },
  globalIgnores(["**/dist/", "**/coverage/", "**/infrastructure/"]),
  ...sharedConfig,
  {
    settings: {
      "better-tailwindcss": {
        // The CSS entry point has to be manually configured in each host project.
        entryPoint: "src/assets/main.css",
      },
    },
  },
];
