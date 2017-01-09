declare namespace Bakaru {
  export interface Entry {
    id: string // sha224 hash of an absolute path to the entry
    path: string // An absolute path to the entry
    title: string // Title of the entry

    mediaProps: MediaProps
  }

  /**
   * Limitations of underlying WebChimera.js are so that it returns us corrupted dimensions of video frame.
   * So we need to store so called common-entry-media-props
   */
  export interface MediaProps {
    width: number
    height: number
  }
}