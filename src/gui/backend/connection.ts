import * as sioc from 'socket.io-client';

const backend = sioc.connect();

let ready = new Promise<void>(resolve => {
  backend.on('connect', () => {
    resolve();
    ready = true;
  });
}) as Promise<void> | boolean;

function readyPromise<T>(executor: (resolve: Function, reject: Function) => any) {
  const executorPromise = () => new Promise<T>((resolve, reject) => {
    executor(resolve, reject);
  });

  if ((<boolean>ready) === true) {
    return executorPromise();
  } else {
    return (<Promise<void>>ready).then(executorPromise) as Promise<T>;
  }
}

export function trigger<T>(eventName: string, payload: any): Promise<T> {
  return readyPromise((resolve, reject) => {
    backend.emit(eventName, payload, (err: any | null, data: T) => {
      if (err) {
        console.error(err);

        reject(err);
      } else {
        resolve(data);
      }
    });
  }) as Promise<T>;
}

export function listen<T>(eventName: string, cb: (payload: T, respond?: Function) => void): void {
  backend.on(eventName, cb);
}
