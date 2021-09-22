import {createApp} from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/normalize.css"
import "bootstrap"

import vueDebounce from 'vue-debounce'
import router from "./router";

function percentage(value, decimals) {
    if(!value) {
        value = 0;
    }

    if(!decimals) {
        decimals = 0;
    }

    value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    value = value + ' %';
    return value;
}

const app = createApp(App)
app.config.globalProperties.$filters = {
    percentage
}

app.use(router).use(vueDebounce).mount('#app')
