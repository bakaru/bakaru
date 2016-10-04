declare module 'fastpriorityqueue' {
  class FastPriorityQueue<T> {
    constructor(comparator?: (a: T, b: T) => number | boolean);
    add(item: T);
    poll(): T;
    isEmpty(): boolean;
  }

  export = FastPriorityQueue;
}
