import { createRouter, createWebHistory } from "vue-router";
import { createAuthGuard } from "@auth0/auth0-vue";
import type { App } from "vue";

const router = (app: App) =>
  createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: "/",
        redirect: "/demo",
      },
      {
        path: "/demo",
        name: "demo",
        components: {
          default: () => import("../views/ProfileView.vue"),
          Header: () => import("../components/DemoHeader.vue"),
        },
        beforeEnter: createAuthGuard(app),
      },
    ],
  });

export default router;
