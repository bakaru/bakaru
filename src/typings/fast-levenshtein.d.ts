declare module 'fast-levenshtein' {
  interface FastLevenstein {
    get(a: string, b: string): number
  }

  export = <FastLevenstein>{}
}