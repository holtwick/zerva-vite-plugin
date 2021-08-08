import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { viteZervaPlugin } from "./plugin"
import { useSocketIO } from "zerva-socketio"
import { on } from "zerva"

useSocketIO()

import { Logger } from "zeed"
const log = Logger("demo")

on("httpInit", ({ get }) => {
  get("/zerva", `Hello, this is Zerva!`)
  get("/data.json", ({ req, res }) => {
    // log("req", Object.keys(req))
    // log("res", Object.keys(res))
    // res.setHeader("Cache-Control", "no-cache")
    // res.setHeader("Content-Type", "text/json")
    // res.setHeader("Access-Control-Allow-Origin", "*")
    return { hello: "world" }
  })
})

export default defineConfig({
  plugins: [vue(), viteZervaPlugin()],
})
