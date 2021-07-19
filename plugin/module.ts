// (C)opyright 2021 Dirk Holtwick, holtwick.it. All rights reserved.

import { Logger, LoggerNodeHandler } from "zeed"
import {
  emit,
  httpGetHandler,
  promisify,
  register,
  setContext,
  serveStop,
  onInit,
  hasModule,
} from "zerva"

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

// A fresh start, otherwise old contexts hang around
serveStop()
setContext()

export const viteZervaPlugin = (setup?: () => void) => ({
  name: "vite-zerva",
  async configureServer(server: any) {
    console.info("Starting zerva for vite...")

    function get(path: string, handler: httpGetHandler): void {
      if (!path.startsWith("/")) {
        path = `/${path}`
      }
      log(`register get ${path}`)

      // https://vitejs.dev/guide/api-javascript.html#vitedevserver
      // https://github.com/senchalabs/connect#readme
      // @ts-ignore
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith(path)) next()
        else {
          // custom handle request...
          log("req", req.url) // Object.keys(req))
          if (typeof handler === "string") {
            res.end(handler)
          } else {
            promisify(handler({ res, req }))
              .then((result) => {
                if (result != null) {
                  res.end(result)
                }
              })
              .catch((err) => {
                next(err)
              })
          }
        }
      })
    }

    // Pretend being a regular http module
    register("http")

    // Now call setup that depends on http
    if (setup) {
      setup()
    }

    onInit(() => {
      if (hasModule("http")) {
        log.warn(
          "Better not call useHttp, instead reuse the vite http sever via httpInit event"
        )
      }
    })

    // Get started
    await emit("httpInit", {
      app: null,
      http: server.httpServer,
      get,
    })
  },
})
