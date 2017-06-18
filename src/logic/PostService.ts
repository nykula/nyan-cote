import { Publisher } from "../utils/Publisher/Publisher";
import { PublisherInjector } from "../utils/Publisher/PublisherInjector";
import { PostBroadcast } from "./PostBroadcast";

@PublisherInjector()
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
