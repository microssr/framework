import express from 'express'

import Component from './component'
import Page from './page'

type AsyncHandlerCallback = (
  req: express.Request,
  res: express.Response
) => Promise<void>

const asyncHandler = (callback: AsyncHandlerCallback): express.RequestHandler =>
  async (req, res, next) => {
    try {
      await callback(req, res)
    }
    catch (error) {
      next(error)
    }
  }

export default class Application {
  #app: express.Application

  constructor() {
    this.#app = express()
  }

  urlForComponent(slug: string) {
    return `/_component/${slug}`
  }

  urlForLibrary(slug: string) {
    return `/_lib/${slug}`
  }

  registerPage(url: string, page: Page) {
    this.#app.get(url, asyncHandler(async (req, res) => {
      const html = await page.render(this, req)
      res.send(html)
    }))
  }

  registerComponent(slug: string, component: Component) {
    type MethodName = keyof Component
    const methods: MethodName[] = ['get', 'post', 'put', 'patch', 'delete']
    const url = this.urlForComponent(slug)

    for (const method of methods) {
      this.#app[method](url, asyncHandler(async (req, res) => {
        const el = await component[method](this, req)
        res.send(el)
      }))
    }
  }

  registerLibrary(slug: string, module: string) {
    this.#app.get(this.urlForLibrary(slug), (req, res) => {
      res.sendFile(require.resolve(module))
    })
  }

  async serve(host: string, port: number) {
    this.#serveHtmx()
    this.#serveAlpine()

    await new Promise(resolve => {
      this.#app.listen(port, host, () => {
        resolve(null)
      })
    })
  }

  #serveHtmx() {
    this.registerLibrary('htmx.js', 'htmx.org/dist/htmx.min.js')
  }

  #serveAlpine() {
    this.registerLibrary('alpine.js', 'alpinejs/dist/cdn.min.js')
  }
}
