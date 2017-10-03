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

### Create a responder

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

### Create a publisher

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

### Create a subscriber

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

## Develop

Environment:

* https://nodejs.org/en/download/
* https://yarnpkg.com/en/docs/install
* https://code.visualstudio.com/Download

Install:

```bash
git clone https://github.com/makepost/nyan-cote
cd nyan-cote
yarn
yarn build
```

Extract examples:

```bash
EXTRACT=true yarn readme
yarn build # This time also builds extracted examples.
```

Test, in terminal:

```bash
yarn test # TODO
yarn coverage # TODO
```

Back end, in VS Code:

* Run build task with `Ctrl+Shift+B`.

* Wait until activity indicator in status bar disappears.

* In debug tab, choose the launch task you want to debug.

* Start with `F5`.

## License

MIT
