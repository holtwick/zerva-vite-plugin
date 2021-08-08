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

const log = Logger("app")
log("app")

const conn = ZSocketIOConnection.connect("ws://" + location.host)

export default defineComponent({
  setup() {
    let pong = ref("")
    conn.emit("serverPing", { echo: uuid() }).then((r: any) => {
      log("pong", r)
      pong.value = r
    })
    return {
      pong,
    }
  },
})
</script>
