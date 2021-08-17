import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { viteZervaPlugin } from "zerva-vite-plugin"
import { useSocketIO } from "zerva-socketio"
import { on } from "zerva"

import { Logger } from "zeed"
const log = Logger("demo")

const zervaSetup = async () => {
  useSocketIO()
  on("httpInit", ({ get, addStatic }) => {
    get("/zerva", `Hello, this is Zerva!`)
    get("/data.json", ({ req, res }) => {
      return { hello: "world" }
    })

    // This will be ignored
    addStatic("test", "test")
  })
}

export default defineConfig({
  plugins: [vue(), viteZervaPlugin(zervaSetup)],
})
