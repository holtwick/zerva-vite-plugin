import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import { Logger } from "zeed"
import { on } from "zerva"
import { useSocketIO } from "zerva-socketio"
import { viteZervaPlugin } from "zerva-vite-plugin"
import "./src/protocol"

const log = Logger("demo")

const zervaSetup = async () => {
  useSocketIO()

  on("socketIOConnect", (conn) => {
    conn.on("viteEcho", (data: any) => data)
  })

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
