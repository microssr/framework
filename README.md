# MicroSSR

Server-Side Rendering micro-framework based on:

 - [Express](https://expressjs.com)
 - [HTMX](https://htmx.org)
 - [Alpine.JS](https://alpinejs.dev)

## :package: Installation

```
$ yarn add @microssr/framework
$ yarn add -D @microssr/tsconfig @microssr/typings-ts-jsx-str @types/express
```

Then add this to your `tsconfig.json`:

```json
{
  "extends": "@microssr/tsconfig/tsconfig.json"
}
```

## :construction: Usage

The entrypoint of your server should look like this:

```typescript
import { Application } from '@microssr/framework'

const main = async() => {
  const app = new Application()

  // ...

  await app.serve('0.0.0.0', 3000)
}

main().catch(console.error)
```

### Creating a page

A `Page` represents a full HTML document to be returned on `GET` requests:

```tsx
import { Application, Page } from '@microssr/framework'
import JSX from '@microssr/ts-jsx-str'
import express from 'express'

export default class Home extends Page {
  async htmlProps(app: Application, req: express.Request) {
    return {lang: 'en'}
  }

  async body(app: Application, req: express.Request) {
    return [
      <div id="app">
        <h1>Home</h1>
      </div>
    ]
  }
}
```

Then, register the page in your entrypoint like so:

```typescript
app.registerPage('/', new Home())
```

### Creating a component

A `Component` represents a chunk of HTML to be returned on `GET`, `POST`, `PUT`,
`PATCH` or `DELETE` requests, usually triggered via **HTMX**.

Consider the following JSX Element:

```tsx
import type { Props } from '@microssr/ts-jsx-str'
import JSX from '@microssr/ts-jsx-str'

const CounterElement = ({ url, count }: Props) => (
  <div id="counter">
    <button hx-post={url} hx-target="#counter" hx-swap="outerHTML">
      Increment
    </button>
    <p>{count}</p>
  </div>
)
```

It can be used in a `Component` like so:

```tsx
import { Application, Component } from '@microssr/framework'
import JSX from '@microssr/ts-jsx-str'
import express from 'express'

export default class Counter extends Component {
  #count = 0

  async get(app: Application, req: express.Request) {
    return <CounterElement
      url={app.urlForComponent('counter')}
      count={this.#count.toString()}
    />
  }

  async post(app: Application, req: express.Request) {
    this.#count += 1

    return <CounterElement
      url={app.urlForComponent('counter')}
      count={this.#count.toString()}
    />
  }
}
```

Then register the component in your entrypoint like so:

```typescript
app.registerComponent('counter', new Counter())
```

Finally, the component can be included in a page, like so:

```tsx
import { Application, Page } from '@microssr/framework'
import JSX from '@microssr/ts-jsx-str'
import express from 'express'

export default class Home extends Page {
  async body(app: Application, req: express.Request) {
    return [
      <div id="app">
        <h1>Home</h1>
        <hr/>
        <div
          hx-get={app.urlForComponent('counter')}
          hx-trigger="load"
          hx-swap="outerHTML"
        ></div>
      </div>
    ]
  }
}
```

## :memo: License

This project is released under the [MIT License](./LICENSE.txt)
