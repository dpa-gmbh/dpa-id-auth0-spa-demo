import { createApp } from "vue";

import App from "./App.vue";
import { auth0Init } from "./auth0Init.ts";
import router from "./router/index.ts";

const app = createApp(App);
app.use(auth0Init);
app.use(router(app));
app.mount("#app");
