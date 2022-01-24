// eslint-disable @typescript-eslint/no-unused-vars

import JSX from '@microssr/ts-jsx-str'
import express from 'express'

import Application from './application'

export default class Component {
  async get(app: Application, req: express.Request): Promise<JSX.Element> {
    throw new Error('not implemented')
  }

  async post(app: Application, req: express.Request): Promise<JSX.Element> {
    throw new Error('not implemented')
  }

  async put(app: Application, req: express.Request): Promise<JSX.Element> {
    throw new Error('not implemented')
  }

  async patch(app: Application, req: express.Request): Promise<JSX.Element> {
    throw new Error('not implemented')
  }

  async delete(app: Application, req: express.Request): Promise<JSX.Element> {
    throw new Error('not implemented')
  }
}
