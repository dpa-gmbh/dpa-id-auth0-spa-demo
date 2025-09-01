import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [basicSsl(), vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "local.dpa-id-auth0-spa-demo-app.de",
    port: 3000,
  },
  preview: {
    host: "local.dpa-id-auth0-spa-demo-app.de",
    port: 3000,
  },
});
