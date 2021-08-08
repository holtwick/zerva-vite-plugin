import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { viteZervaPlugin } from "zerva-vite-plugin"
import { useSocketIO } from "zerva-socketio"
import { on } from "zerva"

useSocketIO()

import { Logger } from "zeed"
const log = Logger("demo")

on("httpInit", ({ get }) => {
  get("/zerva", `Hello, this is Zerva!`)
  get("/data.json", ({ req, res }) => {
    return { hello: "world" }
  })
})

export default defineConfig({
  plugins: [vue(), viteZervaPlugin()],
})
