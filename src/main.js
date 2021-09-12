import {createApp} from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/normalize.css"
import "bootstrap"

import vueDebounce from 'vue-debounce'

createApp(App).use(vueDebounce).mount('#app')
