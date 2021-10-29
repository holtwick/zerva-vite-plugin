# 🌱 Zerva Vite

> DEPRECATED. Please use [zerva-vite](https://github.com/holtwick/zerva-vite) instead. Thanks.

---

**This is a side project of [Zerva](https://github.com/holtwick/zerva)**

Integrate [Zerva](https://github.com/holtwick/zerva) modules into `vite.config.ts` using this Vite Plugin.

This is perfect to use and test your server side code while developing the frontend without handling parallel launching and running server processes.

The plugin already calls `useHttp` with the same port as the vite process. In fact it is the same server instance Vite uses. Custom routes can be added or sockets get bound to it.

## Get started

```ts
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { useSocketIO } from "zerva-socketio"
import { viteZervaPlugin } from "./src/module"

export default defineConfig({
  plugins: [
    vue(),

    // Make use of Zerva from inside Vite server
    viteZervaPlugin(async () => {
      // Zerva modules
      useSocketIO()
    }),
  ],
})
```

See [demo](demo) for a more complex example.
