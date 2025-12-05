import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { createPinia } from "pinia";

import router from "./router";

createApp(App).use(vuetify).use(createPinia()).use(router).mount("#app");
