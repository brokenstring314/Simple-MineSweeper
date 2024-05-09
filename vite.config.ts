import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), UnoCSS()],
    server: {
        port: 23456 // 设置服务器端口为 23456
    },
})
