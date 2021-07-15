import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { viteZervaPlugin } from "./src/module"
import { useSocketIO } from "zerva-socketio"

useSocketIO({})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    //
    vue(),
    viteZervaPlugin(),
  ],
})
