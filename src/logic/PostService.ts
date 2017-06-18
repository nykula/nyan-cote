import { Publisher } from "../utils/Publisher/Publisher";
import { SubscriberInjector } from "../utils/Publisher/SubscriberInjector";
import { PostBroadcast } from "./PostBroadcast";

@SubscriberInjector()
export class PostService {
  @Publisher()
  public postBroadcast: PostBroadcast;

  constructor() {
    setInterval(() => {
      this.postBroadcast.postCreated({
        board: "anime",
        createdAt: Math.floor(Date.now() / 1000),
      });
    }, 1000);
  }
}
