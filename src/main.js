import {createApp} from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/normalize.css"
import "bootstrap"

import vueDebounce from 'vue-debounce'
import router from "./router";

createApp(App).use(router).use(vueDebounce).mount('#app')
