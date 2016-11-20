declare module 'fastpriorityqueue' {
  export = class FastPriorityQueue<T>{
    constructor(comparator?: (a: T, b: T) => number | boolean);
    add(item: T): void;
    poll(): T;
    isEmpty(): boolean;
  }
}
