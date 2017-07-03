# nyan-cote

Lets you write `cote` microservices with type safety, code completion and less
naming boilerplate. You call a method on your TypeScript class instance;
processes discover each other and communicate behind the scenes.

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

With `nyan-cote`:

```typescript
// src/example/RandomRequester.ts

import { Nyan, Requester } from "nyan-cote";
import { RandomResponder } from "./RandomResponder";

export class RandomRequester {
  public nyan = new Nyan(this);

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
```

```javascript
// bin/randomRequester.js

const { RandomRequester } = require('../out/example/RandomRequester')
new RandomRequester()
```

Equivalent without `nyan-cote`:

```typescript
// src/example/RandomRequester.cote.ts

import { Requester } from "cote";

export class RandomRequester {
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
```

```javascript
// bin/randomRequester.cote.js

const { RandomRequester } = require('../out/example/RandomRequester.cote')
new RandomRequester()
```

### Create a responder

With `nyan-cote`:

```typescript
// src/example/RandomResponder.ts

import { Nyan, RequestHandler } from "nyan-cote";

export class RandomResponder {
  public nyan = new Nyan(this);

  @RequestHandler()
  public async randomRequest({ val }: { val: number }) {
    const answer = Math.floor(Math.random() * 10);
    console.log("request", val, "answering with", answer);
    return answer;
  }
}
```

```javascript
// bin/randomResponder.js

const { RandomResponder } = require('../out/example/RandomResponder')
new RandomResponder()
```

Equivalent without `nyan-cote`:

```typescript
// src/example/RandomResponder.cote.ts

import { Responder } from "cote";

export class RandomResponder {
  public responder = new Responder({
    key: "RandomResponder",
    name: "Responder--RandomResponder",
  });

  constructor() {
    this.responder.on("randomRequest", ({ payload }: {
      type: "randomRequest",
      payload: { val: number },
    }) => {
      return this.randomRequest(payload);
    });
  }

  public async randomRequest({ val }: { val: number }) {
    const answer = Math.floor(Math.random() * 10);
    console.log("request", val, "answering with", answer);
    return answer;
  }
}
```

```javascript
// bin/randomResponder.cote.js

const { RandomResponder } = require('../out/example/RandomResponder.cote')
new RandomResponder()
```

### Create a publisher

With `nyan-cote`:

```typescript
// src/example/RandomPublisher.ts

import { Nyan, Publisher } from "nyan-cote";
import { RandomSubscriber } from "./RandomSubscriber";

export class RandomPublisher {
  public nyan = new Nyan(this);

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
```

```javascript
// bin/randomPublisher.js

const { RandomPublisher } = require('../out/example/RandomPublisher')
new RandomPublisher()
```

Equivalent without `nyan-cote`:

```typescript
// src/example/RandomPublisher.cote.ts

import { Publisher } from "cote";

export class RandomPublisher {
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
```

```javascript
// bin/randomPublisher.cote.js

const { RandomPublisher } = require('../out/example/RandomPublisher.cote')
new RandomPublisher()
```

### Create a subscriber

With `nyan-cote`:

```typescript
// src/example/RandomSubscriber.ts

import { EventHandler, Nyan } from "nyan-cote";

export class RandomSubscriber {
  public nyan = new Nyan(this);

  @EventHandler()
  public randomUpdate({ val }: { val: number }) {
    console.log("notified of", val);
  }
}
```

```javascript
// bin/randomSubscriber.js

const { RandomSubscriber } = require('../out/example/RandomSubscriber')
new RandomSubscriber()
```

Equivalent without `nyan-cote`:

```typescript
// src/example/RandomSubscriber.cote.ts

import { Subscriber } from "cote";

export class RandomSubscriber {
  public subscriber = new Subscriber({
    key: "RandomSubscriber",
    name: "Subscriber--RandomSubscriber",
  });

  constructor() {
    this.subscriber.on("randomUpdate", ({ payload }: {
      type: "randomUpdate"
      payload: { val: number },
    }) => {
      this.randomUpdate(payload);
    });
  }

  public randomUpdate({ val }: { val: number }) {
    console.log("notified of", val);
  }
}
```

```javascript
// bin/randomSubscriber.cote.js

const { RandomSubscriber } = require('../out/example/RandomSubscriber.cote')
new RandomSubscriber()
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
yarn test // TODO
yarn coverage // TODO
```

Back end, in VS Code:

* Run build task with `Ctrl+Shift+B`.

* Wait until activity indicator in status bar disappears.

* In debug tab, choose the launch task you want to debug.

* Start with `F5`.

## License

MIT
