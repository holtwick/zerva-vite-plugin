// (C)opyright 2021 Dirk Holtwick, holtwick.it. All rights reserved.

import { ViteDevServer } from "vite"
import { Logger, LoggerNodeHandler } from "zeed"
import {
  emit,
  hasModule,
  httpGetHandler,
  onInit,
  promisify,
  register,
  serveStop,
  setContext,
} from "zerva"

Logger.setHandlers([
  LoggerNodeHandler({
    filter: "*",
    colors: true,
    padding: 32,
    nameBrackets: false,
    levelHelper: false,
  }),
])

const name = "vite"
const log = Logger(`zerva:${name}`)

export const viteZervaPlugin: any = (setup?: () => Promise<void> | void) => ({
  name: "vite-zerva",
  apply: "serve",
  async configureServer(server: ViteDevServer) {
    console.info("Starting zerva for vite...")

    // A fresh start, otherwise old contexts hang around
    serveStop()
    setContext()

    function get(path: string, handler: httpGetHandler): void {
      if (!path.startsWith("/")) {
        path = `/${path}`
      }
      log(`register get ${path}`)

      // https://vitejs.dev/guide/api-javascript.html#vitedevserver
      // middleware https://github.com/senchalabs/connect#readme
      // node response https://nodejs.org/api/http.html#http_request_end_data_encoding_callback
      // @ts-ignore
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith(path)) next()
        else {
          // custom handle request...
          log("req", req.url) // Object.keys(req))

          // Static content
          if (typeof handler === "string") {
            res.end(handler)
          }

          // Dynamic content
          else {
            promisify(handler({ res, req }))
              .then((result) => {
                if (result != null) {
                  res.setHeader("Cache-Control", "no-cache")
                  res.setHeader("Access-Control-Allow-Origin", "*")
                  if (typeof result === "number") {
                    res.statusCode = result
                    res.end()
                  } else {
                    if (typeof result === "string") {
                      res.setHeader(
                        "Content-Type",
                        // @ts-ignore
                        result.startsWith("<") ? "text/html" : "text/plain"
                      )
                    } else {
                      res.setHeader("Content-Type", "text/json")
                      result = JSON.stringify(result, null, 2)
                    }
                    res.end(result)
                  }
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
      await promisify(setup())
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
      // @ts-ignore
      app: undefined,
      http: server.httpServer,
      get,
      post: get,
      addStatic(p) {
        log.info(`http.addStatic for ${p} is ignored`)
      },
    })
  },
})
