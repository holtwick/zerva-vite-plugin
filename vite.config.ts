import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { viteZervaPlugin } from "./src/module"
import { useSocketIO } from "zerva-socketio"

export default defineConfig({
  plugins: [
    vue(),
    viteZervaPlugin(() => {
      useSocketIO({})
    }),
  ],
})
