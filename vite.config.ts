import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { viteZervaPlugin } from "./plugin"
import { useSocketIO } from "zerva-socketio"
import { on } from "zerva"

useSocketIO()

on("httpInit", ({ get }) => {
  get("/zerva", `Hello, this is Zerva!`)
})

export default defineConfig({
  plugins: [vue(), viteZervaPlugin()],
})
