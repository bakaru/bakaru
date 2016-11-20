declare module "arson" {
  export function encode(value: any): string;
  export function stringify(value: any): string;

  export function decode<T>(encoding: string|Buffer): T;
  export function parse<T>(encoding: string|Buffer): T;

  export function registerType(typeName: string, handlers: Function[]): void;
}