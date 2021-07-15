# 🌱 Zerva Vite

**This is a side project of [Zerva](https://github.com/holtwick/zerva)** 

Integrate Zerva modules into `vite.config.ts` using this Vite Plugin.

## Get started

```ts
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { viteZervaPlugin } from "./src/module"
import { useSocketIO } from "zerva-socketio"

// Zerva modules
useSocketIO({})

export default defineConfig({
  plugins: [
    vue(), 

    // Make use of Zerva from inside Vite server
    viteZervaPlugin()
  ],
})
```
