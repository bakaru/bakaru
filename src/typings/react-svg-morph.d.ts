///<reference types="react"/>

declare module 'react-svg-morph' {
  type AspectRatio =
    'none' |
    'xMidYMid meet';

  export interface MorphReplaceProps {
    width?: number,
    height?: number,
    viewBox?: string,
    duration?: number,
    rotation?: 'clockwise' | 'none' | 'counterclock',
    preserveAspectRatio?: AspectRatio,
    easing?(t: number): number
  }

  export class MorphReplace extends React.Component<MorphReplaceProps, {}> {}
}

declare module 'react-svg-morph/lib/utils/easing' {
  /*
   * Easing Functions - inspired from http://gizma.com/easing/
   * only considering the t value for the range [0, 1] => [0, 1]
   */
// no easing, no acceleration
  export function linear(t: number): number;
// accelerating from zero velocity
  export function easeInQuad(t:number): number;
// decelerating to zero velocity
  export function easeOutQuad(t:number): number;
// acceleration until halfway, then deceleration
  export function easeInOutQuad(t:number): number;
// accelerating from zero velocity
  export function easeInCubic(t:number): number;
// decelerating to zero velocity
  export function easeOutCubic(t:number): number;
// acceleration until halfway, then deceleration
  export function easeInOutCubic(t:number): number;
// accelerating from zero velocity
  export function easeInQuart(t:number): number;
// decelerating to zero velocity
  export function easeOutQuart(t:number): number;
// acceleration until halfway, then deceleration
  export function easeInOutQuart(t:number): number;
// accelerating from zero velocity
  export function easeInQuint(t:number): number;
// decelerating to zero velocity
  export function easeOutQuint(t:number): number;
// acceleration until halfway, then deceleration
  export function easeInOutQuint(t:number): number;
}
