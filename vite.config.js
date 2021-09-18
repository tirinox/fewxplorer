import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    devServer: {
        proxy: {
            '/fewpi': {
                target: 'http://localhost:3033',
                ws: true,
                changeOrigin: true
            }
        }
    }
})
