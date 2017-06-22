# nyan-cote

Lets you write `cote` microservices with type safety, code completion and less
naming boilerplate. You call a method on your TypeScript class instance;
processes discover each other and comunicate behind the scenes.

## Usage

### Compare and contrast with ES6 `cote` examples

https://github.com/dashersw/cote#components-reference

### Enable decorators in tsconfig.json

```json
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```

### Create a requester

```typescript
import { Requester, RequesterInjector } from 'nyan-cote';

@RequesterInjector()
class RandomRequester {
  @Requester()
  public randomService: RandomResponder;

  constructor() {
    setInterval(async () => {
      const val = Math.floor(Math.random() * 10);
      const response = await this.randomService.randomRequest({ val });
      console.log('sending', val, 'response', response);
    }, 5000);
  }
}

new RandomRequester();
```

### Create a responder

```typescript
import { RequestHandler, Responder } from 'nyan-cote';

@Responder()
class RandomResponder {
  @RequestHandler()
  public async randomRequest({ val }: { val: number }) {
    const answer = Math.floor(Math.random() * 10);
    console.log('request', val, 'answering with', answer);
    return answer;
  }
}

new RandomResponder();
```

### Create a publisher

```typescript
import { Publisher, PublisherInjector } from 'nyan-cote';

@PublisherInjector()
class RandomPublisher {
  @Publisher()
  public randomSubscriber: RandomSubscriber;

  constructor() {
    setInterval(() => {
      const val = Math.floor(Math.random() * 1000);
      console.log('emitting', val);
      this.randomSubscriber.randomUpdate({ val });
    }, 3000);
  }
}

new RandomPublisher();
```

### Create a subscriber

```typescript
import { EventHandler, Subscriber } from 'nyan-cote';

@Subscriber()
class RandomSubscriber {
  @EventHandler()
  public randomUpdate({ val }: { val: number }) {
    console.log('notified of', val);
  }
}

new RandomSubscriber();
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
