///<reference path="node_modules/@types/node"/>
///<reference path="node_modules/@types/react"/>
///<reference path="node_modules/@types/express"/>

declare module "fastpriorityqueue" {
  class FastPriorityQueue<T> {
    poll: () => T;
  }

  export = FastPriorityQueue;
}
