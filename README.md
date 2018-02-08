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

### Create a service

```typescript
// src/app/Random/RandomService.ts

import { Nyan, Publisher, RequestHandler } from "nyan-cote";
import { RandomController } from "./RandomController";

/**
 * Example service. Responds with a random value on request. Publishes the
 * value to all subscribers. You run this on as many computers in your network
 * as you need.
 */
export class RandomService {
  public nyan = new Nyan(this);

  @Publisher()
  private randomController!: RandomController;
  // Exclamation mark: -> ^ <-
  //
  // Since TypeScript 2.7, one has to say explicitly that Nyan initializes
  // this property, using a "definite assignment assertion".
  //
  // Don't need the exclamation mark with earlier versions.

  @RequestHandler()
  public async getOne(a: number, b: number) {
    if (!a || !b) {
      throw new Error("FalsyValue");
    }

    const value = Math.floor(Math.random() * (a + b));

    console.log(`request (${a}, ${b}) answering and publishing ${value}`);

    this.randomController.notifyAllSubscribers({ a, b, value });

    return value;
  }
}
```

```javascript
// bin/app/random.js
// Service entry point. Start/stop this with, for example, PM2.

const { RandomService } = require('../../out/app/Random/RandomService')
const randomService = new RandomService()

// Manual shutdown:
// randomService.nyan.close()
```

### Expose it to users

```typescript
// src/app/Random/RandomController.ts

import { Request, Response, Router } from "express";
import { EventHandler, Nyan, Requester } from "nyan-cote";
import { RandomService } from "./RandomService";

/**
 * Example controller. Behind the scenes, discovers RandomService instances in
 * your network and queries them in a round-robin fashion. Lets remote users
 * make HTTP requests and subscribe to all values the services generate.
 */
export class RandomController {
  public nyan = new Nyan(this);

  @Requester()
  public randomService!: RandomService;
  // Exclamation: --> ^ <-
  //
  // Since TypeScript 2.7, one has to say explicitly that Nyan initializes
  // this property, using a "definite assignment assertion".
  //
  // Don't need the exclamation mark with earlier versions.

  constructor(
    private io: SocketIO.Server,
    router: Router,
  ) {
    router.get("/random/:a/:b", this.getOne);
  }

  @EventHandler()
  public notifyAllSubscribers({ a, b, value }: { a: number, b: number, value: number }) {
    this.io.emit(`notified of a=${a}, b=${b}, value=${value}`);
  }

  private getOne = async (req: Request, res: Response) => {
    const a = Number(req.params.a);
    const b = Number(req.params.b);

    try {
      const response = await this.randomService.getOne(a, b);

      console.log(`sending (${a}, ${b}) response ${response}`);

      res.send({ response });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
```

```typescript
// src/app/Api.ts

import * as Express from "express";
import * as SocketIO from "socket.io";
import { RandomController } from "./Random/RandomController";

/**
 * Example API. Instantiates Express, Socket.IO and your controllers. Nyan is
 * completely transparent at this level.
 */
export class Api {
  public express = Express();

  public io = SocketIO();

  public randomController = new RandomController(this.io, this.express);
}
```

```javascript
// bin/app/api.js
// API entry point. Start/stop this with, for example, PM2.

const { Api } = require('../../out/app/Api')
const api = new Api()
const server = api.express.listen(8000)
api.io.attach(server)

// Manual shutdown:
// server.close()
// api.randomController.nyan.close()
```

### Organize your source

Please don't separate by pattern:

```
# Not ok, navigation becomes awkward in large apps very quickly.
package.json
tsconfig.json
bin/index.js
bin/component-name.js
src/controllers/ComponentName.ts
src/entities/ComponentName.ts
src/enums/ComponentNameType.ts
src/seeds/ComponentNameSeed.ts
src/services/ComponentNameService.ts
src/tests/ComponentNameController.ts
src/tests/ComponentNameSeed.ts
src/tests/ComponentNameService.ts
```

Use vertical slices, separate by concern:

```
# Ok.
package.json
tsconfig.json
bin/index.js
bin/component-name.js
src/app/Api.ts
src/app/ComponentName/ComponentNameController.ts
src/app/ComponentName/ComponentNameController.test.ts
src/app/ComponentName/ComponentNameSeed.ts
src/app/ComponentName/ComponentNameSeed.test.ts
src/app/ComponentName/ComponentNameService.ts
src/app/ComponentName/ComponentNameService.test.ts
src/domain/ComponentName.ts
src/domain/ComponentNameType.ts
```

### Security

Cote is for [internal communication](https://github.com/dashersw/cote/issues/53) between components of your app in a closed network. Put an HTTPS reverse proxy in front of your API. Set up a firewall so that remote users can only access the proxy, not the API or your services directly.

## Unit testing

### Install `mocha`

```bash
yarn add -D @types/mocha mocha source-map-support

# Add this as a "test" script to package.json
mocha --exit --bail -u tdd --timeout 999999 --colors -r source-map-support/register 'out/**/*.test.js'"
```

### Create a service test

```typescript
// src/app/Random/RandomService.test.ts

import { EventHandler, Nyan, Requester } from "nyan-cote";
import { RandomService } from "./RandomService";

/**
 * Example service test. RandomService has a responder and a publisher. Here
 * we create a requester and a subscriber.
 */
describe("RandomService", () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });
  
  afterEach(() => {
    test.instance.nyan.close();
    test.nyan.close();
  });

  it("gets one", async () => {
    const value = await test.randomService.getOne(1, 2);
    console.assert(value >= 0 && value <= 3);
  });

  it("gets one, failing if a or b falsy", async () => {
    let error: Error | undefined;

    try {
      await test.randomService.getOne(0, 1);
    } catch (_) {
      error = _;
    }
    console.assert(!!error);

    error = undefined;

    try {
      await test.randomService.getOne(1, 0);
    } catch (_) {
      error = _;
    }

    console.assert(!!error);
  });

  it("gets one, notifying controllers", async () => {
    const results: Array<{
      a: number,
      b: number,
      value: number,
    }> = [];

    /**
     * Mock. Uses same class name, for service discovery. Nyan sees the
     * decorator and binds a subscriber to every instance.
     */
    class RandomController {
      public nyan = new Nyan(this);

      private timesNotified = 0;

      @EventHandler()
      public notifyAllSubscribers(_: typeof results[0]) {
        results.push(_);
        console.assert(++this.timesNotified === 1);
      }
    }

    const randomController = new RandomController();
    const randomController1 = new RandomController();

    await test.randomService.getOne(1, 2);

    console.assert(results.length === 2);

    for (const result of results) {
      console.assert(result.a === 1 && result.b === 2 && result.value >= 0);
    }

    randomController.nyan.close();
    randomController1.nyan.close();
  });
});

// tslint:disable:max-classes-per-file
class Test {
  public instance = new RandomService();

  public nyan = new Nyan(this);

  // Talk through Cote instead of using the instance directly.
  @Requester()
  public randomService!: RandomService;
  // Exclamation: --> ^ <-
  //
  // Since TypeScript 2.7, one has to say explicitly that Nyan initializes
  // this property, using a "definite assignment assertion".
  //
  // Don't need the exclamation mark with earlier versions.
}
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
yarn test
yarn coverage # TODO
```

Back end, in VS Code:

* Run build task with `Ctrl+Shift+B`.

* Wait until activity indicator in status bar disappears.

* In debug tab, choose the launch task you want to debug.

* Start with `F5`.

## License

MIT
