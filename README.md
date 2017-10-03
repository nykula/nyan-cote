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
  private randomController: RandomController;

  @RequestHandler()
  public async getOne({ value }: { value: number }) {
    const answer = Math.floor(Math.random() * value);

    console.log("request", value, "answering and publishing", answer);

    this.randomController.notifyAllSubscribers({ value: answer });

    return answer;
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
  public randomService: RandomService;

  constructor(
    private io: SocketIO.Server,
    router: Router,
  ) {
    router.get("/random/:input", this.getOne);
  }

  @EventHandler()
  public notifyAllSubscribers({ value }: { value: number }) {
    this.io.emit(`notified of ${value}`);
  }

  private getOne = async (req: Request, res: Response) => {
    const value = Number(req.params.input);

    const response = await this.randomService.getOne({ value });

    console.log("sending", value, "response", response);

    res.send({ response });
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
  public express: Express.Express = Express();

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
