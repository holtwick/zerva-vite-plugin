export {}

declare global {
  interface ZSocketIOEvents {
    viteEcho(data: any): any
  }
}
