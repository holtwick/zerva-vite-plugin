<template>
  <div>Hello Zerva {{ pong }}</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { Logger, uuid } from "zeed"
import { ZSocketIOConnection } from "zerva-socketio"

const log = Logger("app")
log("app")

const conn = ZSocketIOConnection.connect("ws://localhost:3000")

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
