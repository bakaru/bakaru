declare module NodeJS {
  export interface Global {
    bakaruPaths: {
      [key: string]: any
    }
  }
}