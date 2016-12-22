declare module 'webgl-video-renderer' {
  export interface RenderContext {
    canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext,
    render: (videoFrame: any, width: number, height: number, uOffset: number, vOffset: number) => void
    fillBlack: () => void
  }

  export function setupCanvas(canvas: HTMLCanvasElement, options: {}): RenderContext;
}