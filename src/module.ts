// (C)opyright 2021 Dirk Holtwick, holtwick.it. All rights reserved.

import { Logger, LoggerNodeHandler, LogLevel } from "zeed"
import { emit, httpGetHandler, promisify, register } from "zerva"

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

export const viteZervaPlugin = (setup?: () => void) => ({
  name: "vite-zerva",
  async configureServer(server: any) {
    log("configure", Object.keys(server))

    const { app } = server

    function get(path: string, handler: httpGetHandler): void {
      if (!path.startsWith("/")) {
        path = `/${path}`
      }
      log(`register get ${path}`)
      app.get(path, async (req: any, res: any) => {
        log(`get ${path}`)
        let result = await promisify(handler({ res, req }))
        if (result != null) {
          res.send(result)
        }
      })
    }

    // Pretend being a regular http module
    register("http")

    // Now call setup that depends on http
    if (setup) {
      setup()
    }

    // Get started
    await emit("httpInit", {
      app,
      http: server.httpServer,
      get,
    })

    // server.middlewares.use((req, res, next) => {
    //   // custom handle request...
    //   log("req", req.url) // Object.keys(req))
    //   next()
    // })
  },
})
