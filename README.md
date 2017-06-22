# nyan-cote

Lets you write `cote` microservices with type safety, code completion and less
naming boilerplate. You call a method on your TypeScript class instance;
processes discover each other and comunicate behind the scenes.

## Usage

### See `cote` docs first

- https://github.com/dashersw/cote#components-reference


### Install `nyan-cote`

```bash
yarn add nyan-cote
```

### Enable decorators in tsconfig.json

```json
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```

### Create a requester

```typescript
// src/example/randomRequester.ts

import { Requester, RequesterInjector } from "nyan-cote";

@RequesterInjector()
class RandomRequester {
  @Requester()
  public randomResponder: RandomResponder;

  constructor() {
    setInterval(async () => {
      const val = Math.floor(Math.random() * 10);
      const response = await this.randomResponder.randomRequest({ val });
      console.log("sending", val, "response", response);
    }, 5000);
  }
}

export default new RandomRequester();
```

Equivalent without `nyan-cote`:

```typescript
// src/example/randomRequester.cote.ts

import { Requester } from "cote";

class RandomRequester {
  public requester = new Requester({
    key: "RandomResponder",
    name: "Requester--RandomResponder",
  });

  constructor() {
    setInterval(async () => {
      const val = Math.floor(Math.random() * 10);

      const { payload } = await this.requester.send({
        payload: { val },
        type: "randomRequest",
      });

      console.log("sending", val, "response", payload);
    }, 5000);
  }
}

export default new RandomRequester();
```

### Create a responder

```typescript
// src/example/randomResponder.ts

import { RequestHandler, Responder } from "nyan-cote";

@Responder()
class RandomResponder {
  @RequestHandler()
  public async randomRequest({ val }: { val: number }) {
    const answer = Math.floor(Math.random() * 10);
    console.log("request", val, "answering with", answer);
    return answer;
  }
}

export default new RandomResponder();
```

Equivalent without `nyan-cote`:

```typescript
// src/example/randomResponder.cote.ts

import { Responder } from "nyan-cote";

class RandomResponder {
  public responder = new Responder({
    key: "RandomResponder",
    name: "Responder--RandomResponder",
  });

  constructor() {
    this.responder.on("randomRequest", ({ payload }) => {
      return this.randomRequest(payload);
    });
  }

  public async randomRequest({ val }: { val: number }) {
    const answer = Math.floor(Math.random() * 10);
    console.log("request", val, "answering with", answer);
    return answer;
  }
}

export default new RandomResponder();
```

### Create a publisher

```typescript
// src/example/randomPublisher.ts

import { Publisher, PublisherInjector } from "nyan-cote";

@PublisherInjector()
class RandomPublisher {
  @Publisher()
  public randomSubscriber: RandomSubscriber;

  constructor() {
    setInterval(() => {
      const val = Math.floor(Math.random() * 1000);
      console.log("emitting", val);
      this.randomSubscriber.randomUpdate({ val });
    }, 3000);
  }
}

export default new RandomPublisher();
```

Equivalent without `nyan-cote`:

```typescript
// src/example/randomPublisher.cote.ts

import { Publisher } from "cote";

class RandomPublisher {
  public publisher = new Publisher({
    key: "RandomSubscriber",
    name: "Publisher--RandomSubscriber",
  });

  constructor() {
    setInterval(() => {
      const val = Math.floor(Math.random() * 1000);
      console.log("emitting", val);
      this.publisher.publish("randomUpdate", {
        payload: { val },
        type: "randomUpdate",
      });
    }, 3000);
  }
}

export default new RandomPublisher();
```

### Create a subscriber

```typescript
// src/example/randomSubscriber.ts

import { EventHandler, Subscriber } from "nyan-cote";

@Subscriber()
class RandomSubscriber {
  @EventHandler()
  public randomUpdate({ val }: { val: number }) {
    console.log("notified of", val);
  }
}

export default new RandomSubscriber();
```

Equivalent without `nyan-cote`:

```typescript
// src/example/randomSubscriber.cote.ts

import { Subscriber } from "cote";

class RandomSubscriber {
  public subscriber = new Subscriber({
    key: "RandomSubscriber",
    name: "Subscriber--RandomSubscriber",
  });

  constructor() {
    this.subscriber.on("randomUpdate", ({ payload }) => {
      this.randomUpdate(payload);
    });
  }

  public randomUpdate({ val }: { val: number }) {
    console.log("notified of", val);
  }
}

export default new RandomSubscriber();
```

## Debug

Environment:

* https://nodejs.org/en/download/
* https://yarnpkg.com/en/docs/install
* https://code.visualstudio.com/Download

Install:

```bash
git clone https://github.com/makepost/nyan-cote
cd $_
yarn
```

Test, in terminal:

```bash
yarn build
yarn test
yarn coverage
```

Back end, in VS Code:

* Run build task with `Ctrl+Shift+B`.

* Wait until activity indicator in status bar disappears.

* In debug tab, choose the launch task you want to debug.

* Start with `F5`.

## License

MIT
