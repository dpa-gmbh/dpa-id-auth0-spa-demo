import { createApp } from "vue";
import App from "./App.vue";
import { auth0Init } from "./auth0Init";
import router from "./router";

const app = createApp(App);
app.use(auth0Init);
app.use(router(app));
app.mount("#app");
