<template>
  <div>Hello Vite, pong via socket.io => {{ pong }}</div>
  <div>
    <iframe src="/zerva"></iframe>
    <iframe src="/data.json"></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { Logger, uuid } from "zeed"
import { ZSocketIOConnection } from "zerva-socketio"
import "./protocol"

const log = Logger("app")
log("app")

const conn = ZSocketIOConnection.connect()

export default defineComponent({
  setup() {
    let pong = ref("")

    conn.on("serverPong", (data) => log("serverPong", data))

    conn.emit("serverPing", { echo: uuid() }).then((r: any) => {
      log("pong", r)
      pong.value = r
    })

    conn
      .emit("viteEcho", { hello: "world" })
      .then((data) => log("viteEcho direct", data))

    return {
      pong,
    }
  },
})
</script>
