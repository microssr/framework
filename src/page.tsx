// eslint-disable @typescript-eslint/no-unused-vars

import type { Props } from '@microssr/ts-jsx-str'
import JSX from '@microssr/ts-jsx-str'
import express from 'express'

import Application from './application'

export default class Page {
  async htmlProps(app: Application, req: express.Request): Promise<Props> {
    return {}
  }

  async bodyProps(app: Application, req: express.Request): Promise<Props> {
    return {}
  }

  async head(app: Application, req: express.Request): Promise<JSX.Element[]> {
    return []
  }

  async body(app: Application, req: express.Request): Promise<JSX.Element[]> {
    return []
  }

  async render(app: Application, req: express.Request): Promise<string> {
    const htmlProps = await this.htmlProps(app, req)
    const bodyProps = await this.bodyProps(app, req)
    const head = await this.head(app, req)
    const body = await this.body(app, req)
    const html = (
      <html {...htmlProps}>
        <head>
          {...head}

          <script
            defer
            type="application/javascript"
            src={app.urlForLibrary('htmx.js')}
          ></script>
          <script
            defer
            type="application/javascript"
            src={app.urlForLibrary('alpine.js')}
          ></script>
        </head>
        <body {...bodyProps}>
          {...body}
        </body>
      </html>
    )

    return `<!DOCTYPE html>${html}`
  }
}
