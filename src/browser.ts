import { empty, Logger, promisify } from "zeed"
import { Socket } from "socket.io-client"
import io from "socket.io-client"

const log = Logger("socketio-conn")

// export interface VRoomJoinSuccess {
//   success: true
//   token: string
//   peerData: string[]
//   userInfo?: any
// }

// export interface VRoomJoinError {
//   success: false
//   error: string
//   userInfo?: any
// }

// export interface VRoomRequestSuccess {
//   success: true
//   data: string // Secret reply
//   userInfo?: any
// }

// export interface VRoomRequestError {
//   success: false
//   authFailed: boolean
//   error: string
//   userInfo?: any
// }

// //

// export type VHistorySubscriptionToken = string

// export interface VHistoryItem {
//   module: string
//   info: any
// }

//

export interface SocketEvents {
  serverPing(data: any): any
  serverPong(data: any): any
  serverConfig(): any

  /** New peer asks to join the `room`. `data` contains verification data, usually encrypted. */
  // roomJoin(msg: {
  //   room: string
  //   data: string
  // }): Promise<VRoomJoinSuccess | VRoomJoinError>

  // /** On join one of the peers is asked to verify the request. If `success = true` the new peer is allowed to join. */
  // roomRequest(msg: {
  //   room: string
  //   data: string
  // }): Promise<VRoomRequestSuccess | VRoomRequestError>

  // // roomStatus(msg: { role: VRoomRole }): boolean

  // /** For debugging only */
  // // roomInfo(msg: { room: string }): Promise<VRoomDescription>

  // roomSignal(msg: { id: string; data: string }): Promise<boolean>

  // roomLeft(msg: { id: string }): Promise<void>

  // historySubscribe(): VHistorySubscriptionToken
  // historyUnsubscribe(token: VHistorySubscriptionToken): boolean
  // history(msg: {
  //   token: VHistorySubscriptionToken
  //   history: VHistoryItem[]
  // }): void
}

export class ZSocketIOConnection {
  private socket?: Socket

  constructor(socket: Socket) {
    this.socket = socket
    // this.socket.onAny((...args) => {
    //   log("onAny", ...args)
    // })
  }

  get id(): string {
    let id = this?.socket?.id
    if (empty(id)) {
      log.warn("Expected to find a socket ID")
    }
    return id || ""
  }

  get shortId() {
    return String(this?.socket?.id || "").substr(0, 6)
  }

  emit<U extends keyof SocketEvents>(
    event: U,
    ...args: Parameters<SocketEvents[U]>
  ): Promise<ReturnType<SocketEvents[U]>> {
    return new Promise((resolve) => {
      log("=> EMIT  ", this.shortId, event, JSON.stringify(args).substr(0, 40))
      this.socket?.emit(event, args[0], (value: any) => {
        log(
          "->   EMIT",
          this.shortId,
          event,
          JSON.stringify(value).substr(0, 40)
        )
        resolve(value)
      })
    })
  }

  async on<U extends keyof SocketEvents>(event: U, listener: SocketEvents[U]) {
    // @ts-ignore
    this.socket?.on(event, async (data: any, callback: any) => {
      try {
        log(
          "=> ON    ",
          this.shortId,
          event,
          JSON.stringify(data).substr(0, 40)
        )
        let result = await promisify(listener(data))
        log(
          "->   ON  ",
          this.shortId,
          event,
          result ? JSON.stringify(result).substr(0, 40) : ""
        )
        if (callback) callback(result)
      } catch (err) {
        log.warn("#>   ON  ", this.shortId, event, err)
        if (callback) callback({ error: err.message })
      }
    })
  }

  // onAny(fn: any) {
  //   this.socket.onAny((...args) => {
  //     log("onAny", ...args)
  //     fn(...args)
  //   })
  // }

  close() {
    this.socket?.disconnect()
    this.socket = undefined
  }

  static connect(host: string): ZSocketIOConnection {
    log("connect", host)
    const socket = io(host, {
      reconnectionDelayMax: 3000,
      transports: ["websocket"],
    })
    const conn = new ZSocketIOConnection(socket)
    // let didResolve = false
    // socket.on("connect", () => {
    //   if (!didResolve) resolve(conn)
    //   didResolve = true
    // })
    socket.on("error", (err) => conn.close())
    socket.on("disconnect", (err) => conn.close())
    return conn
  }
  // static async broadcast<U extends keyof SocketEvents>(
  //   connections: Connection[],
  //   event: U,
  //   ...args: Parameters<SocketEvents[U]>
  // ): Promise<void> {
  //   await Promise.all(connections.map((conn) => conn.emit(event, ...args)))
  // }
}
