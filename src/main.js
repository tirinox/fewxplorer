import {createApp} from 'vue'
import App from './App.vue'
// import App from './TestApp.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/normalize.css"
import "bootstrap"

import vueDebounce from 'vue-debounce'
import router from "./router";
import {agoTS, percentage} from "./helpers/util";

const app = createApp(App)
app.config.globalProperties.$filters = {
    percentage,
    agoTS
}

app.use(router).use(vueDebounce).mount('#app')
// app.use(vueDebounce).mount('#app')
