// (C)opyright 2021 Dirk Holtwick, holtwick.it. All rights reserved.

import { Logger, LoggerNodeHandler, LogLevel } from "zeed"

Logger.setHandlers([
  LoggerNodeHandler({
    // level: LogLevel.info,
    filter: "*",
    colors: true,
    padding: 16,
    nameBrackets: false,
    levelHelper: false,
  }),
])

const name = "vite"
const log = Logger(`zerva:${name}`)

export const viteZervaPlugin = () => ({
  name: "configure-server",
  configureServer(server: any) {
    log("configure", Object.keys(server))

    server.middlewares.use((req, res, next) => {
      // custom handle request...
      log("req", req.url) // Object.keys(req))
      next()
    })
  },
})
