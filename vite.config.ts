import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { viteZervaPlugin } from "./src/module"
import { useSocketIO } from "zerva-socketio"

useSocketIO({})

export default defineConfig({
  plugins: [vue(), viteZervaPlugin()],
})
