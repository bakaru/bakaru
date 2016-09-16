import {Router} from "express"

interface CustomEventEmitter {
  on(event: string, data: any): void
}

interface ServerContext {
  events: CustomEventEmitter,
  app: Router
}
