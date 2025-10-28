import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
// icon
import '@mdi/font/css/materialdesignicons.css';
// fonts
import 'unfonts.css';

// router
import router from './router/index.js';

// pinia
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  },
  icons: {
    defaultSet: 'mdi'
  }
});

// vue3-toastify
import 'vue3-toastify/dist/index.css';
import Vue3Toastify from 'vue3-toastify';


app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
  theme: "colored",
  hideProgressBar: false,
  pauseOnHover: false,
  pauseOnFocusLoss: false,
});

app
  .use(router)
  .use(vuetify)
  .use(pinia)
  .mount('#app');
