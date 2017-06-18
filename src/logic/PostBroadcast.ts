import * as SocketIO from "socket.io";
import { EventHandler } from "../utils/Subscriber/EventHandler";
import { Subscriber } from "../utils/Subscriber/Subscriber";

@Subscriber()
export class PostBroadcast {
  public io: SocketIO.Server;

  constructor(port: number) {
    this.io = SocketIO(port);
  }

  @EventHandler()
  public postCreated(post: {
    board: string,
    createdAt: number,
  }) {
    this.io.sockets.emit("postCreated", post);
  }
}
